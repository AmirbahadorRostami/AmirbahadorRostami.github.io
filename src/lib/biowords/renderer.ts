import type { SimulationState } from './model';
export function nextCreatureLabelVisibility(visible: boolean, pointerType: string, event: 'pointerover' | 'pointerout' | 'pointertap'): boolean {
  if (pointerType === 'touch') return event === 'pointertap' ? !visible : visible;
  if (event === 'pointerover') return true;
  if (event === 'pointerout') return false;
  return visible;
}
export interface BioWordsRenderer {
  render(state: SimulationState): void;
  clear(): void;
  resize(width: number, height: number): void;
  destroy(): void;
}
export async function createBioWordsRenderer(mount: HTMLElement): Promise<BioWordsRenderer> {
  const { Application, Circle, Container, Graphics, Text } = await import('pixi.js');
  const app = new Application();
  try {
    await app.init({ width: Math.max(1, mount.clientWidth), height: Math.max(1, mount.clientHeight), resolution: Math.min(devicePixelRatio || 1, 2), autoDensity: true, autoStart: false, preference: 'webgl', backgroundAlpha: 0, antialias: true });
  } catch (error) { try { app.destroy(true); } catch { /* Renderer initialization was incomplete. */ } throw error; }
  app.stop(); mount.append(app.canvas);
  const items = new Map<string, { container: InstanceType<typeof Container>; shape: InstanceType<typeof Graphics>; label: InstanceType<typeof Text> }>();
  const clear = () => {
    for (const item of items.values()) item.container.destroy({ children: true });
    items.clear();
    mount.dataset.biowordsCreatureCount = '0';
    app.render();
  };
  return {
    render(state) {
      if (state.status === 'ready') { clear(); return; }
      const ids = new Set(state.creatures.map(creature => creature.id));
      for (const [id, item] of items) if (!ids.has(id)) { item.container.destroy({ children: true }); items.delete(id); }
      for (const creature of state.creatures) {
        let item = items.get(creature.id);
        if (!item) {
          const container = new Container(); const shape = new Graphics();
          const label = new Text({ text: creature.word, style: { fontFamily: 'IBM Plex Mono, monospace', fontSize: 15, fill: 0xf1ede4 } });
          label.anchor.set(0.5); label.y = 37; label.visible = false;
          container.eventMode = 'static';
          container.cursor = 'pointer';
          container.hitArea = new Circle(0, 0, 38);
          const reveal = (pointerType: string, event: 'pointerover' | 'pointerout' | 'pointertap') => {
            const next = nextCreatureLabelVisibility(label.visible, pointerType, event);
            if (next !== label.visible) { label.visible = next; app.render(); }
          };
          container.on('pointerover', event => reveal(event.pointerType, 'pointerover'));
          container.on('pointerout', event => reveal(event.pointerType, 'pointerout'));
          container.on('pointertap', event => reveal(event.pointerType, 'pointertap'));
          container.addChild(shape, label); app.stage.addChild(container);
          item = { container, shape, label }; items.set(creature.id, item);
        }
        item.label.text = creature.word;
        item.container.visible = creature.alive;
        item.container.alpha = Math.max(0.15, Math.min(1, creature.energy / 30));
        item.container.position.set(45 + creature.x * Math.max(0, app.screen.width - 90), 45 + creature.y * Math.max(0, app.screen.height - 120));
        item.shape.clear();
        const letters = Array.from(creature.word);
        const coreRadius = 14 + (letters.length % 5);
        item.shape.circle(0, 0, coreRadius).stroke({ color: 0xc9c5bc, width: 1, alpha: .85 });
        letters.forEach((letter, index) => {
          const code = letter.codePointAt(0) ?? 0;
          const angle = (index / Math.max(letters.length, 3)) * Math.PI * 2 + (code % 11) * .09;
          const inner = (code % 3) * 2;
          const outer = coreRadius + 8 + (code % 13);
          item!.shape.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner)
            .lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer)
            .stroke({ color: code % 7 === 0 ? 0xcf625a : 0xc9c5bc, width: 1, alpha: .8 });
          if (code % 2 === 0) item!.shape.circle(Math.cos(angle) * outer, Math.sin(angle) * outer, 2 + code % 3)
            .stroke({ color: 0xc9c5bc, width: .8, alpha: .85 });
        });
        item.shape.circle(0, 0, 2).fill(0xf1ede4);
      }
      mount.dataset.biowordsCreatureCount = String(state.creatures.filter(creature => creature.alive).length);
      app.render();
    },
    clear,
    resize(width, height) { app.renderer.resize(Math.max(1, width), Math.max(1, height)); },
    destroy() { items.clear(); app.destroy(true, { children: true, texture: true, textureSource: true }); },
  };
}
