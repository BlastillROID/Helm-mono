// src/commands/init.js (Improved Init Command with Harbor Configuration)
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');

async function initCommand() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

  try {
    const charts = await askQuestion(chalk.cyan("Enter chart paths (comma-separated): "));
    const chartPaths = charts.split(',').map((c) => c.trim()).filter(Boolean);

    if (chartPaths.length === 0) {
      console.error(chalk.red("Error: At least one chart path must be provided."));
      process.exit(1);
    }

    const harborUrl = await askQuestion(chalk.cyan("Enter Harbor URL (e.g., https://harbor.example.com): "));
    const harborProject = await askQuestion(chalk.cyan("Enter Harbor project name: "));

    const config = {
      charts: chartPaths,
      harbor: {
        url: harborUrl.trim(),
        project: harborProject.trim()
      }
    };

    const configPath = path.join(process.cwd(), 'helm.monorepo.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(chalk.green("✔ Configuration file 'helm.monorepo.json' created successfully!"));
  } catch (error) {
    console.error(chalk.red("Failed to initialize configuration:"), error.message);
  } finally {
    rl.close();
  }
}

module.exports = { initCommand };
