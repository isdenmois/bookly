const upstreamTransformer = require('metro/src/reactNativeTransformer');

module.exports.transform = function({ src, filename, options }) {
  if (filename.endsWith('.graphqls')) {
    return upstreamTransformer.transform({ src: "module.exports = " + JSON.stringify(src), filename, options });
  }

  return upstreamTransformer.transform({ src, filename, options });
};
