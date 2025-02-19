// src/utils/config.js
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

function loadConfig() {
  const configPath = path.join(process.cwd(), 'helm.monorepo.json');
  
  if (!fs.existsSync(configPath)) {
    console.error(chalk.red("Error: Configuration file 'helm.monorepo.json' not found."));
    console.error(chalk.yellow("Run 'helm-mono init' to create one."));
    process.exit(1);
  }

  try {
    const rawData = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(rawData);

    if (!config.charts || !Array.isArray(config.charts)) {
      console.error(chalk.red("Error: Missing or invalid 'charts' field in 'helm.monorepo.json'."));
      process.exit(1);
    }

    return config;
  } catch (error) {
    console.error(chalk.red("Error reading 'helm.monorepo.json':"), error.message);
    process.exit(1);
  }
}

module.exports = { loadConfig };
