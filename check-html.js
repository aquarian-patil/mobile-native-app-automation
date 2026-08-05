const { remote } = require('webdriverio');
const path = require('path');

(async () => {
    const browser = await remote({
        capabilities: {
            browserName: 'chrome',
            'goog:chromeOptions': {
                args: ['--headless', '--disable-gpu']
            }
        },
        logLevel: 'error'
    });

    const fileUrl = 'file://' + path.resolve(__dirname, '.ctrf/report/index.html');
    await browser.url(fileUrl);
    
    // wait for a bit
    await browser.pause(2000);
    
    // get browser logs
    const logs = await browser.getLogs('browser');
    console.log('BROWSER LOGS:', logs);
    
    await browser.deleteSession();
})();
