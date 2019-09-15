const gitSemverTags = require('git-semver-tags');
const semver = require('semver');

exports.getLatestTag = function() {
  return new Promise((resolve, reject) => {
    gitSemverTags((err, tags) => {
      if (err) return reject(err);
      else if (!tags.length) return resolve('v1.0.0');
      tags = tags.map(tag => semver.clean(tag));

      tags.sort(semver.rcompare);

      return resolve(`v${tags[0]}`);
    });
  });
};
