import { describe, expect, it } from 'vitest';
import { adjacentEntries } from '../../src/lib/content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import LiveExperimentSlot from '../../src/components/interactive/LiveExperimentSlot.astro';

type ProjectFixture = {
  id: string;
};

const projects: ProjectFixture[] = [
  { id: 'encounters' },
  { id: 'luminous-trails' },
  { id: 'ephemeral-pulses-of-a-finite-scroll' },
  { id: 'biowords' },
  { id: 'person-is-a-data-structure' },
];

describe('adjacentEntries', () => {
  it('wraps the first project backward to the last and advances to the second', () => {
    const adjacent = adjacentEntries(projects, 'encounters');

    expect(adjacent.previous.id).toBe('person-is-a-data-structure');
    expect(adjacent.next.id).toBe('luminous-trails');
  });

  it('wraps the last project forward to the first', () => {
    const adjacent = adjacentEntries(projects, 'person-is-a-data-structure');

    expect(adjacent.previous.id).toBe('biowords');
    expect(adjacent.next.id).toBe('encounters');
  });

  it('throws a descriptive error when the current project is absent', () => {
    expect(() => adjacentEntries(projects, 'missing-project')).toThrow(
      'Cannot find current project "missing-project" among published projects.',
    );
  });
});

describe('LiveExperimentSlot', () => {
  it('renders a labelled slot when enabled without claiming the experience is running', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(LiveExperimentSlot, { props: { enabled: true, title: 'BioWords' } });
    expect(html).toContain('data-live-experiment-slot');
    expect(html).toContain('BioWords');
    expect(html).toContain('Live experiment');
    expect(html).not.toContain('<canvas');
  });

  it('leaves no empty experiment region when disabled', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(LiveExperimentSlot, { props: { enabled: false, title: 'Encounters' } });
    expect(html).not.toContain('<section');
    expect(html).not.toContain('data-live-experiment-slot');
  });
});
