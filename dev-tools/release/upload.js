const Diawi = require('diawi');

exports.upload = function upload(path) {
  return new Promise((resolve, reject) => {
    console.log('Start upload apk');

    new Diawi({ path, token: process.env.DIAWI_TOKEN, callback_emails: process.env.DIAWI_EMAILS })
      .on('complete', resolve)
      .on('error', reject)
      .execute();
  }).then(url => console.log('Successfully uploaded to', url));
};
