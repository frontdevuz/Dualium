export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function shuffle<T>(array: T[]) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[randomIndex]] = [copy[randomIndex], copy[i]];
  }
  return copy;
}

export function unique<T>(items: T[]) {
  return [...new Set(items)];
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
