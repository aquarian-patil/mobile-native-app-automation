import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';

// Load apps config
const appsConfigPath = path.resolve(__dirname, 'apps.json');
let appsConfig: Record<string, Record<string, string>> = {};
if (fs.existsSync(appsConfigPath)) {
  appsConfig = JSON.parse(fs.readFileSync(appsConfigPath, 'utf8'));
} else {
  console.warn('apps.json not found! Please run node upload-apps.js first.');
}

const currentApp = process.env.APP || 'wikipedia'; // Default to wikipedia if not specified
const androidAppId = appsConfig[currentApp]?.android || '';
const iosAppId = appsConfig[currentApp]?.ios || '';
const capitalizedApp = currentApp.charAt(0).toUpperCase() + currentApp.slice(1);

export const config: WebdriverIO.Config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  //
  runner: 'local',
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      project: './tsconfig.json',
      transpileOnly: true,
    },
  },

  //
  // =====================
  // BrowserStack Credentials
  // =====================
  //
  user: process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
  key: process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',

  //
  // ==================
  // Specify Test Files
  // ==================
  //
  specs: [`./test/specs/${currentApp}/**/*.ts`],
  exclude: [
    // 'path/to/excluded/files'
  ],

  // before: function (capabilities, specs) {
  // },
  /**
   * Gets executed before a worker process is spawned and can be used to initialise specific service
   * for that worker as well as modify runtime environments in an async fashion.
   * @param  {String} cid      capability id (e.g 0-0)
   * @param  {[type]} caps     object containing capabilities for session that will be spawn in the worker
   * @param  {[type]} specs    specs to be run in the worker process
   * @param  {[type]} args     object that will be merged with the main configuration once worker is initialized
   * @param  {[type]} execArgv list of string arguments passed to the worker process
   */
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {
  // },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   * @param {String} cid worker id (e.g. 0-0)
   */
  /**
   * Gets executed after a worker process has exited.
   */
  afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    if (error) {
      // Take screenshot on failure
      const screenshot = await browser.takeScreenshot();
      const dir = path.join(__dirname, 'ctrf', 'screenshots');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const safeName = test.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      fs.writeFileSync(path.join(dir, `${safeName}.png`), screenshot, 'base64');
      
      // Print BrowserStack Session Link
      if (browser.sessionId) {
        console.log(`\n🔗 BrowserStack Session (Video & Logs): https://app-automate.browserstack.com/dashboard/v2/builds/search?query=${browser.sessionId}\n`);
      }
    }
  },
  /**
   * Gets executed after a worker process has exited.
   * @param  {String} cid      capability id (e.g 0-0)
   * @param  {Number} exitCode 0 - success, 1 - fail
   * @param  {Array.<String>} specs    specs to be run in the worker process
   * @param  {Number} retries  number of retries used
   */
  onWorkerEnd: function (cid, exitCode, specs, retries) {
    const ctrfDir = path.join(__dirname, 'ctrf');
    if (fs.existsSync(ctrfDir)) {
      const files = fs.readdirSync(ctrfDir);
      files.forEach((file) => {
        // Find generic ctrf reports and append the CID so it doesn't get overwritten.
        // We only rename files that don't already have a CID (-X-Y.json) appended.
        if (
          file.endsWith('.json') &&
          file !== 'ctrf-report.json' &&
          !/-\d+-\d+\.json$/.test(file)
        ) {
          const oldPath = path.join(ctrfDir, file);
          const newPath = path.join(ctrfDir, file.replace('.json', `-${cid}.json`));
          try {
            fs.renameSync(oldPath, newPath);
          } catch (e) {
            console.error('Failed to rename CTRF report', e);
          }
        }
      });
    }
  },

  //
  // ============
  // Capabilities
  // ============
  //
  maxInstances: 1, // Run sequentially on free tier
  capabilities: [
    {
      // Android capabilities
      platformName: 'Android',
      'appium:deviceName': 'Samsung Galaxy S22 Ultra',
      'appium:os_version': '12.0',
      'appium:app': androidAppId,
      'appium:automationName': 'UiAutomator2',
      'bstack:options': {
        projectName: 'Mobile Native Demo',
        buildName: `${capitalizedApp} E2E Test Suite`,
        sessionName: `${capitalizedApp} Android`,
      },
    },
    {
      // iOS capabilities
      platformName: 'iOS',
      'appium:deviceName': 'iPhone 14 Pro Max',
      'appium:os_version': '16',
      'appium:app': iosAppId,
      'appium:automationName': 'XCUITest',
      'bstack:options': {
        projectName: 'Mobile Native Demo',
        buildName: `${capitalizedApp} E2E Test Suite`,
        sessionName: `${capitalizedApp} iOS`,
      },
    },
  ],

  //
  // ===================
  // Test Configurations
  // ===================
  //
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['browserstack'],
  framework: 'mocha',
  reporters: [
    'spec',
    [
      'ctrf-json',
      {
        outputFile: 'ctrf-report.json',
        outputDir: 'ctrf',
      },
    ],
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },
};
