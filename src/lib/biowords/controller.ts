import { createSimulation, stepSimulation, runToCompletion, survivorSentence, type SimulationState } from './model';
import { createBioWordsRenderer, type BioWordsRenderer } from './renderer';

export interface BioWordsController {
  begin(): void; pause(): void; resume(): void; restart(): void; skip(): void;
  advance(ms: number): void; snapshot(): SimulationState; result(): string; destroy(): void;
}
export function createBioWordsController(options: { input: string; seed: number }): BioWordsController {
  const { input, seed } = options;
  let state = createSimulation(input, seed);
  let destroyed = false;
  const active = () => { if (destroyed) throw new Error('BioWords controller has been destroyed.'); };
  return {
    begin() { active(); if (state.status === 'ready') state = { ...state, status: 'running' }; },
    pause() { active(); if (state.status === 'running') state = { ...state, status: 'paused' }; },
    resume() { active(); if (state.status === 'paused') state = { ...state, status: 'running' }; },
    restart() { active(); state = createSimulation(input, seed); },
    skip() { active(); state = runToCompletion(state); },
    advance(ms) { active(); if (state.status === 'running') state = stepSimulation(state, ms); },
    snapshot() { active(); return structuredClone(state); },
    result() { active(); return survivorSentence(state); },
    destroy() { destroyed = true; },
  };
}

export function mountBioWords(root: HTMLElement): () => void {
  const input = root.querySelector<HTMLTextAreaElement>('textarea')!;
  const status = root.querySelector<HTMLElement>('[data-biowords-status]')!;
  const result = root.querySelector<HTMLElement>('[data-biowords-result]')!;
  const overlay = root.querySelector<HTMLElement>('[data-biowords-overlay]')!;
  const mount = root.querySelector<HTMLElement>('[data-biowords-mount]')!;
  const count = root.querySelector<HTMLElement>('[data-biowords-count]')!;
  const wordList = root.querySelector<HTMLOListElement>('[data-biowords-word-list]')!;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let controller: BioWordsController | undefined;
  let renderer: BioWordsRenderer | undefined;
  let disposed = false;
  let visible = false;
  let frame = 0;
  let previous = 0;
  let accumulator = 0;
  let runInput = '';
  let announced = '';
  let validationMessage = '';
  let listedWords = '';
  const stop = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; accumulator = 0; };
  const active = () => visible && !document.hidden && !disposed;
  const update = () => {
    const state = controller?.snapshot();
    const phase = state?.status ?? 'ready';
    root.dataset.status = phase;
    const message = phase === 'complete' ? 'Complete. The surviving original words are in the viewport.' : phase === 'running' ? 'The ecosystem is running.' : phase === 'paused' ? 'Paused. Resume to continue or skip to the result.' : validationMessage || 'Ready. Enter words and choose Begin.';
    if (message !== announced) { status.textContent = message; announced = message; }
    result.textContent = phase === 'complete' ? controller!.result() : '';
    overlay.hidden = phase !== 'complete';
    const words = phase === 'ready' ? '' : state?.creatures.map(creature => creature.word).join('\u0000') ?? '';
    if (words !== listedWords) {
      wordList.replaceChildren(...(state && phase !== 'ready' ? state.creatures.map(creature => {
        const item = document.createElement('li');
        item.textContent = creature.word;
        return item;
      }) : []));
      listedWords = words;
    }
    root.dataset.elapsed = String(state?.elapsedMs ?? 0);
    root.dataset.motion = motion.matches ? 'reduced' : 'full';
    for (const button of root.querySelectorAll<HTMLButtonElement>('button[data-action]')) {
      const action = button.dataset.action;
      button.disabled = action === 'pause' ? phase !== 'running' : action === 'resume' ? phase !== 'paused' : action === 'restart' || action === 'reset' ? !controller : action === 'skip' ? !controller || phase === 'complete' : phase === 'running' || phase === 'paused';
    }
    if (phase === 'ready') renderer?.clear();
    else if (state && active()) renderer?.render(state);
  };
  const tick = (time: number) => {
    frame = 0;
    if (!active() || motion.matches || controller?.snapshot().status !== 'running') { stop(); return; }
    if (previous) accumulator += Math.min(time - previous, 250);
    previous = time;
    while (accumulator >= 50 && controller.snapshot().status === 'running') {
      controller.advance(50); accumulator -= 50; update();
    }
    if (controller.snapshot().status === 'running') frame = requestAnimationFrame(tick);
    else stop();
  };
  const sync = () => {
    stop();
    root.dataset.motion = motion.matches ? 'reduced' : 'full';
    if (motion.matches && controller?.snapshot().status === 'running') controller.pause();
    if (active()) renderer?.resize(mount.clientWidth, mount.clientHeight);
    update();
    if (active() && !motion.matches && controller?.snapshot().status === 'running') frame = requestAnimationFrame(tick);
  };
  const click = (event: Event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
    if (!button || button.disabled) return;
    try {
      validationMessage = '';
      const action = button.dataset.action;
      if (action === 'begin') {
        if (!controller || input.value !== runInput || controller.snapshot().status === 'complete') {
          const next = createBioWordsController({ input: input.value, seed: crypto.getRandomValues(new Uint32Array(1))[0] });
          controller?.destroy(); controller = next; runInput = input.value;
          renderer?.clear();
        }
        controller.begin();
      } else if (action === 'restart' || action === 'reset') {
        controller?.restart();
        renderer?.clear();
        if (action === 'reset') input.focus();
      }
      else if (action === 'pause') controller?.pause();
      else if (action === 'resume') controller?.resume();
      else if (action === 'skip') controller?.skip();
      if (motion.matches && (action === 'begin' || action === 'resume')) { controller?.advance(500); controller?.pause(); }
      sync();
    } catch (error) {
      validationMessage = error instanceof Error ? error.message : 'Please enter words to begin.';
      announced = validationMessage;
      status.textContent = validationMessage;
    }
  };
  const change = () => { count.textContent = `${input.value.length} / 280 characters`; };
  root.addEventListener('click', click); input.addEventListener('input', change);
  const observer = new IntersectionObserver(([entry]) => { visible = entry?.isIntersecting ?? false; sync(); });
  observer.observe(root);
  const resize = new ResizeObserver(() => { if (active()) { renderer?.resize(mount.clientWidth, mount.clientHeight); update(); } });
  resize.observe(mount);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  const cleanup = () => {
    disposed = true; stop(); observer.disconnect(); resize.disconnect();
    root.removeEventListener('click', click); input.removeEventListener('input', change);
    document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync);
    document.removeEventListener('astro:before-swap', cleanup); window.removeEventListener('pagehide', leave);
    controller?.destroy(); renderer?.destroy();
  };
  const leave = (event: PageTransitionEvent) => { if (!event.persisted) cleanup(); };
  document.addEventListener('astro:before-swap', cleanup); window.addEventListener('pagehide', leave);
  change(); sync();
  // Load drawing resources at mount, before interaction; input never drives a request.
  void createBioWordsRenderer(mount).then(next => {
    if (disposed) { next.destroy(); return; }
    renderer = next; update(); root.dataset.renderState = 'ready'; root.dataset.ready = 'true';
  }).catch(() => { if (!disposed) { root.dataset.renderState = 'fallback'; root.dataset.ready = 'true'; } });
  return cleanup;
}
