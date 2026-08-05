const fs = require('fs');
const https = require('https');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          return download(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error('Failed to get ' + url + ' (' + res.statusCode + ')'));
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
        file.on('error', (err) => {
          fs.unlink(dest, () => {});
          reject(err);
        });
      })
      .on('error', reject);
  });
}

async function main() {
  console.log('Downloading Android App...');
  await download(
    'https://github.com/webdriverio/native-demo-app/releases/download/v0.4.0/Android-NativeDemoApp-0.4.0.apk',
    'apps/android.apk',
  );
  console.log('Android App downloaded!');

  console.log('Downloading iOS App...');
  await download(
    'https://github.com/webdriverio/native-demo-app/releases/download/v0.4.0/iOS-Simulator-NativeDemoApp-0.4.0.app.zip',
    'apps/ios.zip',
  );
  console.log('iOS App downloaded!');
}

main().catch(console.error);
