const SANITIZE_REGEXP = /[^\wа-яА-Я]/g;

export function sanitizeLike(value) {
  return value.replace(SANITIZE_REGEXP, '_');
}
