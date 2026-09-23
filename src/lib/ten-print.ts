export interface TenPrintCell {
  x: number;
  y: number;
  size: number;
  direction: 'forward' | 'backward';
  alpha: number;
  tone: number;
}

export function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

export function createTenPrintCells({
  width,
  height,
  cellSize,
  seed,
  probability = 0.5,
}: {
  width: number;
  height: number;
  cellSize: number;
  seed: number;
  probability?: number;
}): TenPrintCell[] {
  if (![width, height, cellSize].every((value) => Number.isFinite(value) && value > 0)) {
    throw new RangeError('10 PRINT dimensions and cell size must be positive finite numbers.');
  }

  const random = mulberry32(seed);
  const threshold = Math.min(1, Math.max(0, probability));
  const columns = Math.ceil(width / cellSize);
  const rows = Math.ceil(height / cellSize);
  const cells: TenPrintCell[] = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      cells.push({
        x: column * cellSize,
        y: row * cellSize,
        size: cellSize,
        direction: random() < threshold ? 'forward' : 'backward',
        alpha: 0.24 + random() * 0.6,
        tone: random(),
      });
    }
  }

  return cells;
}
