const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts;
const blacklist = require('metro-config/src/defaults/exclusionList');

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

module.exports = config;
