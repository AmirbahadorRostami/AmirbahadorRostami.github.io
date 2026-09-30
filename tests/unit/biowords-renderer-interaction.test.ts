import { describe, expect, it } from 'vitest';
import { nextCreatureLabelVisibility } from '../../src/lib/biowords/renderer';

describe('BioWords creature label interactions', () => {
  it('reveals on mouse hover and hides on mouse exit', () => {
    expect(nextCreatureLabelVisibility(false, 'mouse', 'pointerover')).toBe(true);
    expect(nextCreatureLabelVisibility(true, 'mouse', 'pointerout')).toBe(false);
  });

  it('ignores synthetic touch hover and toggles only on taps', () => {
    expect(nextCreatureLabelVisibility(false, 'touch', 'pointerover')).toBe(false);
    expect(nextCreatureLabelVisibility(false, 'touch', 'pointertap')).toBe(true);
    expect(nextCreatureLabelVisibility(true, 'touch', 'pointerout')).toBe(true);
    expect(nextCreatureLabelVisibility(true, 'touch', 'pointertap')).toBe(false);
  });
});
