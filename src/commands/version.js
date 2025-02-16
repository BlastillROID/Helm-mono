// src/commands/version.js (Version Bumping Command with Specific Version Option)
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const yaml = require('js-yaml');
const { loadConfig } = require('../utils/config');

function bumpVersion(version, typeOrVersion) {
  if (/^\d+\.\d+\.\d+$/.test(typeOrVersion)) {
    return typeOrVersion; // If a full version is provided, return it directly
  }
  const [major, minor, patch] = version.split('.').map(Number);
  switch (typeOrVersion) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${typeOrVersion}`);
  }
}

function versionBumpCommand(chart, typeOrVersion) {
  try {
    const config = loadConfig();
    let chartPaths = config.charts.map((c) => path.resolve(process.cwd(), c));
    
    const chartPath = chartPaths.find((p) => p.includes(chart));
    if (!chartPath) {
      console.error(chalk.red(`Error: Chart '${chart}' not found in configured paths.`));
      process.exit(1);
    }

    const chartYamlPath = path.join(chartPath, 'Chart.yaml');
    if (!fs.existsSync(chartYamlPath)) {
      console.error(chalk.red(`Error: Chart.yaml not found in '${chartPath}'.`));
      process.exit(1);
    }

    const chartData = yaml.load(fs.readFileSync(chartYamlPath, 'utf8'));
    const oldVersion = chartData.version;
    const newVersion = bumpVersion(oldVersion, typeOrVersion);

    chartData.version = newVersion;
    fs.writeFileSync(chartYamlPath, yaml.dump(chartData));

    console.log(chalk.green(`✔ Version updated for ${chart}: ${oldVersion} → ${newVersion}`));
  } catch (error) {
    console.error(chalk.red("Failed to update version:"), error.message);
    process.exit(1);
  }
}

module.exports = { versionBumpCommand };
