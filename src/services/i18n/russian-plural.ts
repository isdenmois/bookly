const pluralize = require('pluralize-ru');

export default {
  name: 'ruplur',
  type: 'postProcessor',
  process(value, key, options) {
    return pluralize(options.count % 1 !== 0 ? 2 : options.count, ...value.split(';'));
  },
} as any;

const REG_EXP = /\$r\((.*?)(,.*?)?\)/gi;

export const rp: any = {
  name: 'rp',
  type: 'postProcessor',
  process(value, _, options, translator) {
    return value?.replace(REG_EXP, (s, key, count = ', count') =>
      translator.translate(key, { count: options[count.slice(2)], postProcess: 'ruplur' }),
    );
  },
};
