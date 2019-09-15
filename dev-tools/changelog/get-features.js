const { getLog } = require('./git-log');

const COMMIT_REGEX = /^([Ff]eat|[Ff]eature|[Ff]ix|[Ff]ixed|)(\(.*\))?: (.*)$/;
const featureTitles = ['feat', 'feature'];

exports.getFeatures = async function(tag) {
  const result = { default: [] };
  const log = await getLog(tag);
  const commits = log.split('\n').filter(i => i);
  commits.reverse().forEach(c => {
    const [hash, info] = c.split('||');
    const match = info.match(COMMIT_REGEX);
    if (!match) {
      return;
    }

    let [, type, feature, message] = match;

    message = message[0].toUpperCase() + message.slice(1);

    if (featureTitles.includes(type)) {
      type = 'feat';
    } else {
      type = 'fix';
    }

    if (feature) {
      feature = feature.replace(/[()]/g, '');
      feature = feature[0].toUpperCase() + feature.slice(1);
    } else {
      feature = 'default';
    }

    result[feature] = result[feature] || [];

    result[feature].unshift({ hash, type, message });
  });

  return result;
};
