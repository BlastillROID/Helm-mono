// tests/version.test.js (Unit Test for Version Command)
const { versionBumpCommand } = require('../src/commands/version');
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const yaml = require("js-yaml");

jest.mock('fs');
jest.mock('js-yaml');

describe('Version Command', () => {
  beforeEach(() => {
    fs.writeFileSync.mockReset();
  });

  it('should bump the patch version of a chart', () => {
    yaml.load.mockReturnValue({ version: '1.0.0' });
    versionBumpCommand('test-chart', 'patch');

    expect(fs.writeFileSync).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('1.0.1'));
  });
});