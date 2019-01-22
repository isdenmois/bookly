export const APP_VERSION = '2.3.3'

export function check(version: string) {
  return __DEV__ || version >= APP_VERSION
}
