// Frozen dictionaries are immutable word sets (freezing a native Set does not prevent add()).
export const POSITIVE_WORDS: Readonly<Record<string, true>> = Object.freeze(Object.fromEntries(
  ['love', 'hope', 'happy', 'joy', 'peace', 'kind', 'calm', 'beautiful', 'good', 'gentle', 'bright', 'together'].map(word => [word, true as const]),
));
export const NEGATIVE_WORDS: Readonly<Record<string, true>> = Object.freeze(Object.fromEntries(
  ['hate', 'fear', 'sad', 'anger', 'pain', 'dark', 'bad', 'cruel', 'lonely', 'death', 'cold', 'broken'].map(word => [word, true as const]),
));

export function scoreSentiment(words: string[]): number {
  let sum = 0;
  let matches = 0;
  for (const word of words) {
    const key = word.toLowerCase();
    const score = Object.hasOwn(POSITIVE_WORDS, key) ? 1 : Object.hasOwn(NEGATIVE_WORDS, key) ? -1 : 0;
    if (score) { sum += score; matches += 1; }
  }
  return matches ? Math.max(-1, Math.min(1, sum / matches)) : 0;
}
