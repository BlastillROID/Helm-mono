// src/utils/dependencyResolver.js (Resolve Helm Chart Dependencies)
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

function resolveDependencies(chartPaths) {
  const dependencyGraph = new Map();

  chartPaths.forEach((chartPath) => {
    const chartYamlPath = path.join(chartPath, 'Chart.yaml');
    if (fs.existsSync(chartYamlPath)) {
      try {
        const chartData = yaml.load(fs.readFileSync(chartYamlPath, 'utf8'));
        const dependencies = (chartData.dependencies || []).map(dep => path.resolve(chartPath, dep.repository.replace('file://', '')));
        dependencyGraph.set(chartPath, dependencies);
      } catch (error) {
        console.error(`Error reading dependencies for chart ${chartPath}:`, error.message);
      }
    }
  });

  // Sort charts based on dependency order
  const sortedCharts = []; 
  const visited = new Set();

  function visit(chart) {
    if (visited.has(chart)) return;
    visited.add(chart);
    (dependencyGraph.get(chart) || []).forEach(visit);
    sortedCharts.push(chart);
  }

  chartPaths.forEach(visit);
  return sortedCharts;
}

module.exports = { resolveDependencies };
