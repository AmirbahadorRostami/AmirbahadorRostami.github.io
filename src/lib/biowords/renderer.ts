import type { SimulationState } from './model';
export interface BioWordsRenderer {
  render(state: SimulationState): void;
  resize(width: number, height: number): void;
  destroy(): void;
}
export async function createBioWordsRenderer(mount: HTMLElement): Promise<BioWordsRenderer> {
  const { Application, Container, Graphics, Text } = await import('pixi.js');
  const app = new Application();
  try {
    await app.init({ width: Math.max(1, mount.clientWidth), height: Math.max(1, mount.clientHeight), resolution: Math.min(devicePixelRatio || 1, 2), autoDensity: true, autoStart: false, preference: 'webgl', backgroundAlpha: 0, antialias: true });
  } catch (error) { try { app.destroy(true); } catch { /* Renderer initialization was incomplete. */ } throw error; }
  app.stop(); mount.append(app.canvas);
  const items = new Map<string, { container: InstanceType<typeof Container>; shape: InstanceType<typeof Graphics>; label: InstanceType<typeof Text> }>();
  return {
    render(state) {
      const present = new Set(state.creatures.map(creature => creature.id));
      for (const [id, item] of items) if (!present.has(id)) item.container.visible = false;
      const ids = new Set(state.creatures.map(creature => creature.id));
      for (const [id, item] of items) if (!ids.has(id)) { item.container.destroy({ children: true }); items.delete(id); }
      for (const creature of state.creatures) {
        let item = items.get(creature.id);
        if (!item) {
          const container = new Container(); const shape = new Graphics();
          const label = new Text({ text: creature.word, style: { fontFamily: 'sans-serif', fontSize: 13, fill: 0xf4eee7 } });
          label.anchor.set(0.5); label.y = 26; container.addChild(shape, label); app.stage.addChild(container);
          item = { container, shape, label }; items.set(creature.id, item);
        }
        item.label.text = creature.word;
        item.container.visible = creature.alive;
        item.container.alpha = Math.max(0.15, Math.min(1, creature.energy / 30));
        item.container.position.set(24 + creature.x * Math.max(0, app.screen.width - 48), 24 + creature.y * Math.max(0, app.screen.height - 80));
        item.shape.clear();
        creature.genome.forEach((gene, index) => {
          const angle = index / creature.genome.length * Math.PI * 2;
          const radius = 9 + (gene * 0x10ffff % 17);
          item!.shape.moveTo(0, 0).lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius).stroke({ color: 0xd54e3d, width: 2 });
        });
        item.shape.circle(0, 0, 4).fill(0xf4eee7);
      }
      app.render();
    },
    resize(width, height) { app.renderer.resize(Math.max(1, width), Math.max(1, height)); },
    destroy() { items.clear(); app.destroy(true, { children: true, texture: true, textureSource: true }); },
  };
}
