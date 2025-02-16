// src/commands/build.js (Improved Build Command with Dependency Support)
const shell = require('shelljs');
const chalk = require('chalk');
const path = require('path');
const { loadConfig } = require('../utils/config');
const { resolveDependencies } = require('../utils/dependencyResolver');

async function buildChartCommand(chart, options) {
  try {
    const config = loadConfig();
    let chartPaths = config.charts.map((c) => path.resolve(process.cwd(), c));
    
    const chartPath = chartPaths.find((p) => p.includes(chart));
    if (!chartPath) {
      console.error(chalk.red(`Error: Chart '${chart}' not found in configured paths.`));
      process.exit(1);
    }

    let chartsToBuild = [chartPath];
    if (options.buildDeps) {
      console.log(chalk.blue("Resolving dependencies for build..."));
      chartsToBuild = resolveDependencies([chartPath]);
    }

    let outputDir = process.cwd();
    if (options.output) {
      outputDir = path.resolve(process.cwd(), options.output);
      console.log(chalk.blue(`Output directory set to: ${outputDir}`));
    }

    let failedCharts = [];
    await Promise.all(
      chartsToBuild.map(async (chartPath) => {
        console.log(chalk.blue(`Building Helm chart: ${chartPath}`));
        let helmCommand = `helm package ${chartPath} --destination ${outputDir}`;
        if (shell.exec(helmCommand).code !== 0) {
          console.error(chalk.red(`Failed to build Helm chart: ${chartPath}`));
          failedCharts.push(chartPath);
        }
      })
    );

    if (failedCharts.length > 0) {
      console.error(chalk.red(`The following charts failed to build: ${failedCharts.join(', ')}`));
      process.exit(1);
    }

    console.log(chalk.green("✔ Chart and dependencies built successfully!"));
  } catch (error) {
    console.error(chalk.red("Failed to build chart:"), error.message);
    process.exit(1);
  }
}

module.exports = { buildChartCommand };
