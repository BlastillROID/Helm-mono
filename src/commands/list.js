// src/commands/list.js (Improved List Command - Detect Helm Charts in Folders)
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { loadConfig } = require('../utils/config');

function listChartsCommand() {
  try {
    const config = loadConfig();
    const chartDirectories = config.charts.map((dir) => path.resolve(process.cwd(), dir));
    let foundCharts = [];

    chartDirectories.forEach((baseDir) => {
      if (fs.existsSync(baseDir)) {
        const subDirs = fs.readdirSync(baseDir, { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => path.join(baseDir, dirent.name));

        subDirs.forEach((chartPath) => {
          const chartYamlPath = path.join(chartPath, 'Chart.yaml');
          if (fs.existsSync(chartYamlPath)) {
            foundCharts.push(chartPath);
          }
        });
      }
    });

    if (foundCharts.length === 0) {
      console.log(chalk.yellow("No Helm charts found in the configured paths."));
    } else {
      console.log(chalk.cyan("Detected Helm Charts:"));
      foundCharts.forEach((chart, index) => {
        console.log(chalk.green(`  ${index + 1}. ${chart}`));
      });
    }
  } catch (error) {
    console.error(chalk.red("Failed to list charts:"), error.message);
  }
}

module.exports = { listChartsCommand };
