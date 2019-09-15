const { execSync } = require('child_process');
const { formatMarkdown } = require('./format-log');
const fs = require('fs');

exports.writeLog = function(features) {
  const message = formatMarkdown(features);
  const hasFeatures = checkFeaturesExisting(features);

  execSync(`yarn version ${hasFeatures ? '--minor' : '--patch'}`);
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
