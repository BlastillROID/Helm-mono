// src/commands/push.js (Push Helm Charts to Harbor Command with Authentication)
const shell = require('shelljs');
const chalk = require('chalk');
const path = require('path');
const { loadConfig } = require('../utils/config');

function pushChartCommand(chart, options) {
  pushCharts([chart], options);
}

function pushAllChartsCommand(options) {
  try {
    const config = loadConfig();
    pushCharts(config.charts, options);
  } catch (error) {
    console.error(chalk.red("Failed to push charts:"), error.message);
    process.exit(1);
  }
}

function pushCharts(charts, options) {
  try {
    const config = loadConfig();
    if (!config.harbor || !config.harbor.url || !config.harbor.project) {
      console.error(chalk.red("Error: Harbor configuration is missing in 'helm.monorepo.json'."));
      process.exit(1);
    }

    let chartPaths = config.charts.map((c) => path.resolve(process.cwd(), c));
    
    if (options.username && options.password) {
      shell.exec(`helm registry login ${config.harbor.url} --username ${options.username} --password ${options.password}`);
    }

    charts.forEach((chart) => {
      const chartPath = chartPaths.find((p) => p.includes(chart));
      if (!chartPath) {
        console.error(chalk.red(`Error: Chart '${chart}' not found in configured paths.`));
        return;
      }

      const tgzFile = path.join(chartPath, `${chart}-*.tgz`);
      const repository = `${config.harbor.url}/${config.harbor.project}`;
      console.log(chalk.blue(`Pushing Helm chart '${chart}' to Harbor repository '${repository}'...`));

      let helmPushCmd = `helm push ${tgzFile} ${repository}`;
      if (shell.exec(helmPushCmd).code !== 0) {
        console.error(chalk.red(`Failed to push Helm chart '${chart}' to '${repository}'.`));
      } else {
        console.log(chalk.green(`✔ Successfully pushed '${chart}' to '${repository}'!`));
      }
    });
  } catch (error) {
    console.error(chalk.red("Failed to push charts:"), error.message);
    process.exit(1);
  }
}

module.exports = { pushChartCommand, pushAllChartsCommand };