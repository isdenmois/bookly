export const bindings = new Map();

type Constructor<T> = new (...args: any[]) => T;

export function inject<T>(key: Constructor<T>): T {
  if (!bindings.has(key)) {
    throw new Error(`INJECT: Key ${key} doesn't exist`);
  }

  return bindings.get(key)
}
