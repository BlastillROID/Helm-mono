// tests/push.test.js (Unit Test for Push Command)
const { pushChartCommand } = require('../src/commands/push');
const shell = require('shelljs');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs')

describe('Push Command', () => {
  beforeEach(() => {
    shell.exec.mockReset();
  });

  it('should execute helm push command', async () => {
    shell.exec.mockReturnValue({ code: 0 });
    console.log = jest.fn();

    await pushChartCommand('test-chart', {});

    expect(shell.exec).toHaveBeenCalledWith(expect.stringContaining('helm push'));
  });
});
