const fs = require('fs');
const path = require('path');

const reportPath = path.join(process.cwd(), 'ctrf', 'ctrf-report.json');

try {
  if (fs.existsSync(reportPath)) {
    const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const summary = data.results.summary;
    const tests = data.results.tests;
    
    let flakyCount = 0;
    if (tests) {
       flakyCount = tests.filter(t => t.flaky).length;
    }

    let durationStr = 'N/A';
    if (summary.duration) {
       durationStr = (summary.duration / 1000).toFixed(2) + 's';
    }

    let markdown = `## 📱 Mobile Native Execution Summary\n\n`;
    markdown += `| Total Tests | Passed ✅ | Failed ❌ | Skipped ⏭️ | Flaky 🍂 | Duration ⏱️ |\n`;
    markdown += `| --- | --- | --- | --- | --- | --- |\n`;
    markdown += `| **${summary.tests || 0}** | **${summary.passed || 0}** | **${summary.failed || 0}** | **${summary.skipped || 0}** | **${flakyCount}** | **${durationStr}** |\n\n`;

    // Calculate Device/Platform Breakdown
    const platforms = {};
    if (tests) {
      tests.forEach(test => {
        // We injected [App - Platform] in enhance-ctrf-report.js
        const match = test.name.match(/^\[(.*?)\]/);
        const platformName = match ? match[1] : 'Unknown Platform';
        
        if (!platforms[platformName]) {
          platforms[platformName] = { total: 0, passed: 0, failed: 0, skipped: 0, flaky: 0 };
        }
        platforms[platformName].total++;
        if (test.status === 'passed') platforms[platformName].passed++;
        if (test.status === 'failed') platforms[platformName].failed++;
        if (test.status === 'skipped') platforms[platformName].skipped++;
        if (test.flaky) platforms[platformName].flaky++;
      });
    }

    markdown += `### 📱 Platform Breakdown\n\n`;
    markdown += `| Platform & App | Total | Passed | Failed | Skipped | Flaky |\n`;
    markdown += `| --- | --- | --- | --- | --- | --- |\n`;

    for (const [platform, stats] of Object.entries(platforms)) {
      const statusIcon = stats.failed > 0 ? '❌' : '✅';
      markdown += `| **${statusIcon} ${platform}** | ${stats.total} | ${stats.passed} | ${stats.failed} | ${stats.skipped} | ${stats.flaky} |\n`;
    }

    // List Failed Tests (if any)
    let failedTests = [];
    if (tests) {
       failedTests = tests.filter(t => t.status === 'failed');
    }
    
    if (failedTests.length > 0) {
      markdown += `\n### ❌ Failed Tests\n\n`;
      failedTests.forEach(t => {
        markdown += `- **${t.name}**\n`;
      });
    }

    // Link to Full Dashboard
    const repoName = process.env.GITHUB_REPOSITORY || 'aquarian-patil/mobile-native-app-automation';
    const username = repoName.split('/')[0];
    const repo = repoName.split('/')[1];
    const pagesUrl = `https://${username}.github.io/${repo}/`;

    markdown += `\n---\n\n`;
    markdown += `### 🔗 **[👉 View Full CTRF HTML Dashboard & Media Here](${pagesUrl})**\n`;
    markdown += `*(Note: The visual dashboard may take 1-2 minutes to deploy to GitHub Pages after the pipeline finishes)*\n`;

    // Append to GitHub Actions Summary
    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
    } else {
      console.log(markdown);
    }

    console.log('Successfully generated GitHub Actions Custom Summary.');
  } else {
    console.log('ctrf-report.json not found, skipping summary generation.');
  }
} catch (error) {
  console.error('Error generating summary:', error);
}
