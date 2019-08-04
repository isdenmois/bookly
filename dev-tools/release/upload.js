const Diawi = require('diawi');
const npath = require('path');
const fs = require('fs');
const { name, version } = require('../../package.json');

exports.upload = function upload(path) {
  return new Promise((resolve, reject) => {
    console.log('Start upload apk');

    path = renameApk(path);

    new Diawi({ path, token: process.env.DIAWI_TOKEN, callback_emails: process.env.DIAWI_EMAILS })
      .on('complete', resolve)
      .on('error', reject)
      .execute();
  }).then(url => console.log('Successfully uploaded to', url));
};

function renameApk(path) {
  const newPath = npath.join(npath.dirname(path), `${name}-${version}.apk`);

  if (newPath !== path) {
    fs.renameSync(path, newPath);
  }

  return newPath;
}
