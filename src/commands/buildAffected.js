// src/commands/buildAffected.js (Build Affected Charts Command - Improved Version)
const shell = require('shelljs');
const chalk = require('chalk');
const path = require('path');
const { loadConfig } = require('../utils/config');
const { resolveDependencies } = require('../utils/dependencyResolver');

async function buildAffectedChartsCommand(options) {
    try {
      const config = loadConfig();
      const chartPaths = config.charts.map((c) => path.resolve(process.cwd(), c));
      
      if (!chartPaths.length) {
        console.error(chalk.red("Error: No charts found in configured paths."));
        process.exit(1);
      }
  
      const gitReference = options.ref || 'HEAD~1';
      const changedFiles = shell.exec(`git diff --name-only ${gitReference}`, { silent: true }).stdout.split('\n');
      console.log(chalk.yellow(`Detected changed files:
  ${changedFiles.join('\n')}`));
  
      let affectedCharts = chartPaths.filter((chartPath) => 
        changedFiles.some((file) => path.relative(chartPath, file).startsWith(''))
      );
  
      if (options.buildDeps) {
        console.log(chalk.blue("Resolving dependencies for affected charts..."));
        affectedCharts = resolveDependencies(affectedCharts);
      }
  
      if (!affectedCharts.length) {
        console.log(chalk.green("No affected charts to build."));
        return;
      }
  
      let outputDir = process.cwd();
      if (options.output) {
        outputDir = path.resolve(process.cwd(), options.output);
        console.log(chalk.blue(`Output directory set to: ${outputDir}`));
      }
  
      let failedCharts = [];
      await Promise.all(
        affectedCharts.map(async (chartPath) => {
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
  
      console.log(chalk.green("✔ Affected charts and dependencies built successfully!"));
    } catch (error) {
      console.error(chalk.red("Failed to build affected charts:"), error.message);
      process.exit(1);
    }
  }
  
  module.exports = { buildAffectedChartsCommand };
  