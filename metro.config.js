const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const { resolver } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('./rn-transformer')
    },
    resolver: {
      sourceExts: [...resolver.sourceExts, 'css']
    }
  };
})();
