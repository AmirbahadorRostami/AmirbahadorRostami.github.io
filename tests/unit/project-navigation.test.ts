import { describe, expect, it } from 'vitest';
import { adjacentEntries } from '../../src/lib/content';

type ProjectFixture = {
  id: string;
};

const projects: ProjectFixture[] = [
  { id: 'encounters' },
  { id: 'luminous-trails' },
  { id: 'remote-realities' },
  { id: 'biowords' },
  { id: 'person-is-a-data-structure' },
  { id: 'cellular-automata' },
];

describe('adjacentEntries', () => {
  it('wraps the first project backward to the last and advances to the second', () => {
    const adjacent = adjacentEntries(projects, 'encounters');

    expect(adjacent.previous.id).toBe('cellular-automata');
    expect(adjacent.next.id).toBe('luminous-trails');
  });

  it('wraps the last project forward to the first', () => {
    const adjacent = adjacentEntries(projects, 'cellular-automata');

    expect(adjacent.previous.id).toBe('person-is-a-data-structure');
    expect(adjacent.next.id).toBe('encounters');
  });

  it('throws a descriptive error when the current project is absent', () => {
    expect(() => adjacentEntries(projects, 'missing-project')).toThrow(
      'Cannot find current project "missing-project" among published projects.',
    );
  });
});
