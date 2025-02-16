#!/usr/bin/env node
const { program } = require('commander');
const { loadConfig } = require('../src/utils/config');
const { initCommand } = require('../src/commands/init');
const { listChartsCommand } = require('../src/commands/list');
const { buildChartCommand } = require('../src/commands/build');
const { buildAllChartsCommand } = require('../src/commands/buildAll');
const { buildAffectedChartsCommand } = require('../src/commands/buildAffected');
const { versionBumpCommand } = require('../src/commands/version');
const { pushChartCommand, pushAllChartsCommand } = require('../src/commands/push');

program
  .name('helm-mono')
  .description('Helm Monorepo Management CLI')
  .version('1.0.0');

// Register Commands
program.command('init')
  .description('Initialize helm.monorepo.json configuration')
  .action(initCommand);

program.command('list')
  .description('List available Helm charts from configuration')
  .action(listChartsCommand);

program.command('build <chart>')
  .description('Build a specified Helm chart')
  .option('-o, --output <directory>', 'Specify the output directory for the built chart')
  .option('--build-deps', 'Build dependent charts first')
  .action(buildChartCommand);

program.command('build-all')
  .description('Build all Helm charts')
  .option('-o, --output <directory>', 'Specify the output directory for the built charts')
  .option('--build-deps', 'Build charts in dependency order')
  .action(buildAllChartsCommand);

program.command('build-affected')
  .description('Build only Helm charts that have changed since the last commit')
  .option('-o, --output <directory>', 'Specify the output directory for the built charts')
  .option('-r, --ref <commit>', 'Specify the commit reference to compare changes against', 'HEAD~1')
  .option('--build-deps', 'Build affected charts along with their dependencies')
  .action(buildAffectedChartsCommand);

program.command('version <chart> <typeOrVersion>')
  .description('Bump the version of a specified Helm chart or set a specific version')
  .action(versionBumpCommand);

program.command('push <chart>')
  .description('Push a Helm chart to the configured Harbor repository')
  .option('-u, --username <username>', 'Specify the Harbor username')
  .option('-p, --password <password>', 'Specify the Harbor password')
  .action(pushChartCommand);

program.command('push-all')
  .description('Push all Helm charts to the configured Harbor repository')
  .option('-u, --username <username>', 'Specify the Harbor username')
  .option('-p, --password <password>', 'Specify the Harbor password')
  .action(pushAllChartsCommand);

program.command('config')
  .description('Validate and show configuration')
  .action(() => {
    const config = loadConfig();
    console.log('Loaded Configuration:', config);
  });

program.parse(process.argv);