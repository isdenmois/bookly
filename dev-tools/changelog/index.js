const { getLatestTag } = require('./latest-tag');
const { getFeatures } = require('./get-features');
const { writeLog } = require('./write');
const { formatMarkdown } = require('./format-log');

const argv = require('yargs')
  .option('type', { default: 'release' })
  .help().argv;

async function printChangelog(type) {
  const tag = await getLatestTag();
  const features = await getFeatures(tag);

  if (isEmpty(features)) {
    throw Error('Empty changelog');
  }

  if (type === 'release') {
    return writeLog(features);
  } else {
    console.log(formatMarkdown(features));
  }
}

function isEmpty(features) {
  for (let key in features) {
    if (features[key] && features[key].length) {
      return false;
    }
  }

  return true;
}

printChangelog(argv.type).catch(e => console.error(e));
