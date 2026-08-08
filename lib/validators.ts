export function normalizeText(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value: string): boolean {
  const cleaned = value.replace(/\s+/g, '');
  return cleaned.length >= 7 && /^[+0-9()\-]+$/.test(cleaned);
}
