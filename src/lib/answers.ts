export function normaliseAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/,/g, "").replace(/\s+/g, " ");
}

export function answersMatch(
  given: string,
  expected: string,
  accept: string[] = [],
): boolean {
  const guess = normaliseAnswer(given);
  if (!guess) return false;

  const targets = [expected, ...accept].map(normaliseAnswer);
  if (targets.includes(guess)) return true;

  const asNumber = Number(guess);
  if (!Number.isNaN(asNumber) && Number.isFinite(asNumber)) {
    return targets.some((target) => Number(target) === asNumber);
  }

  return false;
}
