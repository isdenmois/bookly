const { exec } = require('child_process');

exports.getLog = function(tag) {
  const cmd = `git log --pretty=tformat:"%H||%s" ${tag}...HEAD`;

  return new Promise((resolve, reject) => {
    exec(cmd, function(err, stdout, stderr) {
      if (err) {
        console.error(stderr || err.message);
        return reject(err);
      } else if (stderr) {
        console.error(stderr, { level: 'warn', color: 'yellow' });
      }
      return resolve(stdout);
    });
  });
};
