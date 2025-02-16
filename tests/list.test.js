// tests/list.test.js (Unit Test for List Command)
const { listChartsCommand } = require('../src/commands/list');
const fs = require('fs');
const path = require('path');

jest.mock('fs');

describe('List Command', () => {
  beforeEach(() => {
    fs.existsSync.mockReset();
    fs.readdirSync.mockReset();
  });

  it('should list Helm charts found in configured paths', () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue([
      { name: 'chart1', isDirectory: () => true },
      { name: 'chart2', isDirectory: () => true }
    ]);
    fs.existsSync.mockImplementation((path) => path.endsWith('Chart.yaml'));

    console.log = jest.fn();
    listChartsCommand();

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Detected Helm Charts:'));
  });

  it('should display a warning when no charts are found', () => {
    fs.existsSync.mockReturnValue(false);
    console.log = jest.fn();
    listChartsCommand();

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('No Helm charts found'));
  });
});