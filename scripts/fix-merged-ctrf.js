const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../ctrf/ctrf-report.json');

try {
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const tests = data.results.tests || [];
    
    let minStart = Infinity;
    let maxStop = 0;

    tests.forEach(t => {
      // WDIO test timestamps are in seconds (10 digits), CTRF summary expects ms (13 digits)
      const tStartMs = t.start ? (t.start < 10000000000 ? t.start * 1000 : t.start) : Infinity;
      const tStopMs = t.stop ? (t.stop < 10000000000 ? t.stop * 1000 : t.stop) : 0;
      if (tStartMs < minStart) minStart = tStartMs;
      if (tStopMs > maxStop) maxStop = tStopMs;
    });

    if (minStart !== Infinity && maxStop !== 0 && data.results && data.results.summary) {
      data.results.summary.start = minStart;
      data.results.summary.stop = maxStop;
      
      // Calculate realistic duration instead of N/A
      const durationMillis = maxStop - minStart;
      if (durationMillis > 0) {
        data.results.summary.duration = durationMillis;
      }
    } else if (data.results && data.results.summary) {
       // Fallback if tests don't have start/stop
       data.results.summary.start = Date.now() - 60000;
       data.results.summary.stop = Date.now();
    }

    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    console.log('Successfully fixed merged CTRF timestamps to prevent year 58564 bug.');
  } else {
    console.log('Merged CTRF report not found, skipping fix.');
  }
} catch (error) {
  console.error('Error fixing CTRF report:', error);
}
