// tests/buildAffected.test.js (Unit Test for Build-Affected Command)
const { buildAffectedChartsCommand } = require('../src/commands/buildAffected');
const shell = require('shelljs');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs')

describe('Build-Affected Command', () => {
  beforeEach(() => {
    shell.exec.mockReset();
  });

  it('should execute helm package for affected charts', async () => {
    shell.exec.mockReturnValue({ code: 0 });
    console.log = jest.fn();

    await buildAffectedChartsCommand({});

    expect(shell.exec).toHaveBeenCalledWith(expect.stringContaining('helm package'));
  });
});