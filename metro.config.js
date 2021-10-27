const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts;
const blacklist = require('metro-config/src/defaults/exclusionList');
const { makeMetroConfig } = require('@rnx-kit/metro-config');
const { MetroSerializer, esbuildTransformerConfig } = require('@rnx-kit/metro-serializer-esbuild');

const inProduction = process.env.NODE_ENV === 'production';

const config = {
  transformer: {
    minifierPath: 'metro-minify-terser',
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    sourceExts: process.env.RN_SRC_EXT
      ? process.env.RN_SRC_EXT.split(',').concat(defaultSourceExts)
      : defaultSourceExts,
    blacklistRE: blacklist([
      // Ignore BBCode
      /node_modules\/bbcode-to-react\/(dist|lib\/tags)\/.*/,

      // Ignore git directories
      /.*\.git\/.*/,
      // Ignore android directories
      /.*\/app\/build\/.*/,
    ]),
  },
};

module.exports = inProduction
  ? makeMetroConfig({
      ...config,
      projectRoot: __dirname,
      serializer: {
        customSerializer: MetroSerializer(),
      },
      transformer: esbuildTransformerConfig,
    })
  : config;
