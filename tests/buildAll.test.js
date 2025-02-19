// tests/buildAll.test.js (Unit Test for Build-All Command)
const { buildAllChartsCommand } = require('../src/commands/buildAll');
const shell = require('shelljs');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs')

describe('Build-All Command', () => {
  beforeEach(() => {
    shell.exec.mockReset();
  });

  it('should execute helm package for all charts', async () => {
    shell.exec.mockReturnValue({ code: 0 });
    console.log = jest.fn();

    await buildAllChartsCommand({});

    expect(shell.exec).toHaveBeenCalledWith(expect.stringContaining('helm package'));
  });
});
