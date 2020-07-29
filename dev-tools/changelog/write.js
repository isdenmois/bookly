const { execSync } = require('child_process');
const { formatMarkdown } = require('./format-log');
const fs = require('fs');

exports.writeLog = function (features, major) {
  const message = formatMarkdown(features);
  const hasFeatures = checkFeaturesExisting(features);
  const type = major ? 'major' : hasFeatures ? 'minor' : 'patch';

  execSync(`yarn version --${type}`);
  fs.writeFileSync('RELEASE_NOTES.md', message);
};

function checkFeaturesExisting(features) {
  for (let key in features) {
    if (features[key].some(f => f.type === 'feat')) {
      return true;
    }
  }

  return false;
}
