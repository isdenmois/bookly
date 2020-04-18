const { spawn } = require('child_process');
const path = require('path');
const fg = require('fast-glob');

exports.build = async function build(type, clean, isTest) {
  console.log('Start gradle build');

  const cwd = path.join(__dirname, '../../android');
  const tasks = [`assemble${type.charAt(0).toUpperCase()}${type.slice(1)}`];

  if (clean) {
    tasks.unshift('clean');
  }

  if (isTest) {
    process.env.RN_SRC_EXT = 'e2e.ts';
    tasks.push('assembleAndroidTest', `-DtestBuildType=${type}`);
  }

  await runGradle(cwd, tasks);

  return findApk(cwd);
};

function runGradle(cwd, tasks) {
  return new Promise((resolve, reject) => {
    const gradlew = spawn('./gradlew', tasks, { cwd, shell: true });

    gradlew.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    gradlew.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    gradlew.on('error', reject);

    gradlew.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

function findApk(cwd) {
  const files = fg.sync('app/build/outputs/apk/**/*.apk', { cwd });

  if (files.length > 0) {
    const localPath = files[files.length - 1];

    return path.join(cwd, localPath);
  }
}
