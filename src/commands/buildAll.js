// src/commands/buildAll.js (Improved Build All Charts Command with Dependency Support)
const shell = require('shelljs');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs')
const { loadConfig } = require('../utils/config');
const { resolveDependencies } = require('../utils/dependencyResolver');

async function buildAllChartsCommand(options) {
  try {
    const config = loadConfig();
    let chartPaths = config.charts.map((c) => path.resolve(process.cwd(), c));
    
    let charts = []
    chartPaths.forEach((baseDir) => {
          if (fs.existsSync(baseDir)) {
            const subDirs = fs.readdirSync(baseDir, { withFileTypes: true })
              .filter((dirent) => dirent.isDirectory())
              .map((dirent) => path.join(baseDir, dirent.name));
    
            subDirs.forEach((chartPath) => {
              const chartYamlPath = path.join(chartPath, 'Chart.yaml');
              if (fs.existsSync(chartYamlPath)) {
                charts.push(chartPath);
              }
            });
          }
        });
    
    if (!charts.length) {
      console.error(chalk.red("Error: No charts found in configured paths."));
      process.exit(1);
    }

    if (options.buildDeps) {
      console.log(chalk.blue("Building charts in dependency order..."));
      chartPaths = resolveDependencies(chartPaths);
    }

    let outputDir = process.cwd();
    if (options.output) {
      outputDir = path.resolve(process.cwd(), options.output);
      console.log(chalk.blue(`Output directory set to: ${outputDir}`));
    }

    let failedCharts = [];
    await Promise.all(
      charts.map(async (chart) => {
        console.log(chalk.blue(`Building Helm chart: ${chart}`));
        let helmCommand = `helm package ${chart} --destination ${outputDir}`;
        if (shell.exec(helmCommand).code !== 0) {
          console.error(chalk.red(`Failed to build Helm chart: ${chart}`));
          failedCharts.push(chart);
        }
      })
    );

    if (failedCharts.length > 0) {
      console.error(chalk.red(`The following charts failed to build: ${failedCharts.join(', ')}`));
      process.exit(1);
    }

    console.log(chalk.green("✔ All Helm charts built successfully!"));
  } catch (error) {
    console.error(chalk.red("Failed to build all charts:"), error.message);
    process.exit(1);
  }
}

module.exports = { buildAllChartsCommand };