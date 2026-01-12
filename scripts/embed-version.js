/**
 * Embed Version Script
 * Writes the current git commit SHA to a file that gets bundled with the app.
 * This allows packaged .dmg apps to know what version they are.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'version.json');

try {
  // Get current commit SHA
  const commitSha = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  const shortSha = commitSha.substring(0, 7);

  // Get commit date
  const commitDate = execSync('git log -1 --format=%ci', { encoding: 'utf8' }).trim();

  const versionInfo = {
    commit: commitSha,
    shortCommit: shortSha,
    buildDate: new Date().toISOString(),
    commitDate: commitDate
  };

  fs.writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2));
  console.log(`Version info written to version.json`);
  console.log(`  Commit: ${shortSha}`);
  console.log(`  Build date: ${versionInfo.buildDate}`);
} catch (error) {
  console.error('Failed to embed version info:', error.message);

  // Write a fallback so the app doesn't crash
  const fallback = {
    commit: 'unknown',
    shortCommit: 'unknown',
    buildDate: new Date().toISOString(),
    commitDate: 'unknown'
  };
  fs.writeFileSync(outputPath, JSON.stringify(fallback, null, 2));
  console.log('Wrote fallback version info');
}
