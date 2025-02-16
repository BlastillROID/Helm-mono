// tests/init.test.js (Unit Test for Init Command)
const fs = require('fs');
const path = require('path');
const { initCommand } = require('../src/commands/init');
const readline = require('readline');
const chalk = require('chalk');

jest.mock('fs');
jest.mock('readline');

describe('Init Command', () => {
  let mockRl;

  beforeEach(() => {
    mockRl = {
      question: jest.fn(),
      close: jest.fn()
    };
    readline.createInterface.mockReturnValue(mockRl);
    fs.writeFileSync.mockClear();
  });

  it('should create helm.monorepo.json with valid input', async () => {
    mockRl.question
      .mockImplementationOnce((_, cb) => cb('charts/*'))
      .mockImplementationOnce((_, cb) => cb('https://harbor.example.com'))
      .mockImplementationOnce((_, cb) => cb('my-project'));

    await initCommand();

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(process.cwd(), 'helm.monorepo.json'),
      JSON.stringify(
        {
          charts: ['charts/*'],
          harbor: {
            url: 'https://harbor.example.com',
            project: 'my-project'
          }
        },
        null,
        2
      )
    );
  });

  it('should exit with error if no chart paths are provided', async () => {
    mockRl.question.mockImplementationOnce((_, cb) => cb(''));
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await initCommand();

    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
  });
});
