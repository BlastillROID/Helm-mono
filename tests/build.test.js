// tests/build.test.js (Unit Test for Build Command)
const { buildChartCommand } = require('../src/commands/build');
const shell = require('shelljs');

jest.mock('shelljs');

describe('Build Command', () => {
  beforeEach(() => {
    shell.exec.mockReset();
  });

  it('should execute helm package for a chart', async () => {
    shell.exec.mockReturnValue({ code: 0 });
    console.log = jest.fn();

    await buildChartCommand('test-chart', {});

    expect(shell.exec).toHaveBeenCalledWith(expect.stringContaining('helm package'));
  });

  it('should log an error if helm package fails', async () => {
    shell.exec.mockReturnValue({ code: 1 });
    console.error = jest.fn();

    await buildChartCommand('test-chart', {});

    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Failed to build Helm chart'));
  });
});