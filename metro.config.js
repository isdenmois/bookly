const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const { resolver } = await getDefaultConfig();

  return {
    transformer: {
      babelTransformerPath: require.resolve('./dev-tools/transformer')
    },
    resolver: {
      sourceExts: [...resolver.sourceExts, 'graphqls']
    }
  };
})();
