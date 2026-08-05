const fs = require('fs');
require('dotenv').config();

async function uploadApp(url) {
  const response = await fetch('https://api-cloud.browserstack.com/app-automate/upload', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          process.env.BROWSERSTACK_USERNAME + ':' + process.env.BROWSERSTACK_ACCESS_KEY,
        ).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ url: url }),
  });
  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data.app_url;
}

async function main() {
  console.log('Uploading Wikipedia Android App...');
  const wikiAndroid = await uploadApp(
    'https://www.browserstack.com/app-automate/sample-apps/android/WikipediaSample.apk',
  );
  console.log('Wiki Android ID:', wikiAndroid);

  console.log('Uploading Wikipedia iOS App...');
  const wikiIos = await uploadApp(
    'https://www.browserstack.com/app-automate/sample-apps/ios/BStackSampleApp.ipa',
  );
  console.log('Wiki iOS ID:', wikiIos);

  console.log('Uploading SauceLabs Android App...');
  const sauceAndroid = await uploadApp(
    'https://github.com/saucelabs/my-demo-app-rn/releases/download/v1.3.0/Android-MyDemoAppRN.1.3.0.build-244.apk',
  );
  console.log('Sauce Android ID:', sauceAndroid);

  console.log('Uploading SauceLabs iOS App...');
  const sauceIos = await uploadApp(
    'https://github.com/saucelabs/my-demo-app-rn/releases/download/v1.3.0/iOS-Real-Device-MyRNDemoApp.1.3.0-162.ipa',
  );
  console.log('Sauce iOS ID:', sauceIos);

  const appConfig = {
    wikipedia: {
      android: wikiAndroid,
      ios: wikiIos,
    },
    saucelabs: {
      android: sauceAndroid,
      ios: sauceIos,
    },
  };

  fs.writeFileSync('apps.json', JSON.stringify(appConfig, null, 2));
  console.log('Successfully saved App IDs to apps.json!');
}

main().catch(console.error);
