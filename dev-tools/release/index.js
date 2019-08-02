require('dotenv').config();
const { build } = require('./gradle');
const { upload } = require('./upload');

build()
  .then(apk => upload(apk))
  .then(url => console.log('Successfully uploaded to', url))
  .catch(error => console.error(error && error.toString()));
