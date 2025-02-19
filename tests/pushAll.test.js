// tests/pushAll.test.js (Unit Test for Push-All Command)
const { pushAllChartsCommand } = require('../src/commands/push');
const shell = require('shelljs');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs')

describe('Push-All Command', () => {
  beforeEach(() => {
    shell.exec.mockReset();
  });

  it('should execute helm push for all charts', async () => {
    shell.exec.mockReturnValue({ code: 0 });
    console.log = jest.fn();

    await pushAllChartsCommand({});

    expect(shell.exec).toHaveBeenCalledWith(expect.stringContaining('helm push'));
  });
});
