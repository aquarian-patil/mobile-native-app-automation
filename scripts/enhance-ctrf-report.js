const fs = require('fs');
const path = require('path');

const ctrfDir = path.resolve(__dirname, '../ctrf');

try {
  if (!fs.existsSync(ctrfDir)) {
    console.warn('CTRF directory not found at:', ctrfDir);
    process.exit(0);
  }

  const files = fs.readdirSync(ctrfDir);
  const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'ctrf-report.json');

  if (jsonFiles.length === 0) {
    console.warn('No individual CTRF reports found to enhance.');
    process.exit(0);
  }

  const appName = process.env.APP || 'App';
  const capitalizedApp = appName.charAt(0).toUpperCase() + appName.slice(1);

  jsonFiles.forEach((file) => {
    const ctrfPath = path.join(ctrfDir, file);
    const ctrfRaw = fs.readFileSync(ctrfPath, 'utf8');
    const ctrfData = JSON.parse(ctrfRaw);

    // Extract platform from the environment extra info if available
    let platform = '';
    let sessionId = '';
    if (ctrfData.results.environment && ctrfData.results.environment.extra) {
      platform = ctrfData.results.environment.extra.platformName || '';
      sessionId = ctrfData.results.environment.extra.sessionId || '';
      
      // Remove the overflowing property if it exists from a previous run
      if (ctrfData.results.environment.extra.browserStackDashboard) {
        delete ctrfData.results.environment.extra.browserStackDashboard;
      }
    }

    const prefix = platform ? `[${capitalizedApp} - ${platform}]` : `[${capitalizedApp}]`;

    // Update test names and inject clickable links
    if (ctrfData.results && ctrfData.results.tests) {
      ctrfData.results.tests.forEach((test) => {
        if (!test.name.startsWith('[')) {
          test.name = `${prefix} ${test.name}`;
        }
        
        // Add a clickable BrowserStack link directly to each test case
        if (sessionId) {
          if (!test.links) test.links = [];
          // Avoid duplicates if script runs twice
          if (!test.links.some(l => l.name === 'BrowserStack Video & Logs')) {
            test.links.push({
              name: 'BrowserStack Video & Logs',
              url: `https://app-automate.browserstack.com/dashboard/v2/builds/search?query=${sessionId}`
            });
          }
        }
      });
    }

    fs.writeFileSync(ctrfPath, JSON.stringify(ctrfData, null, 2));
    console.log(`Successfully enhanced ${file} with prefix: ${prefix}`);
  });
} catch (error) {
  console.error('Error enhancing CTRF reports:', error);
  process.exit(1);
}
