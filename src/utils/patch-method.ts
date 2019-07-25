export function patchMethod(obj: any, method: string, callback: Function) {
  const original = obj[method];

  obj[method] = function () {
    original.apply(obj, arguments);
    callback.apply(obj, arguments);
  }
}
