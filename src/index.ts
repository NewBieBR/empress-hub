#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
import program from 'commander';
const shell = require('shelljs');
const fs = require('fs');
const prompts = require('prompts');
import yesno from 'yesno';
const homedir = require('os').homedir();
const _ = require('lodash');
import { EmpressConfig, EmpressLocalConfig } from './types';

const CONFIG_DIR_PATH = `${homedir}/.empress-hub`;
const CONFIG_FILE_PATH = `${CONFIG_DIR_PATH}/config.json`;
const LOCAL_CONFIG_DIR_NAME = '.empress-hub-local';
const LOCAL_CONFIG_FILE_NAME = `${LOCAL_CONFIG_DIR_NAME}/config.json`;

clear();
console.log(
  chalk.green(figlet.textSync('EMPRESS HUB', { horizontalLayout: 'full' })),
);

function setConfig(newConfig: Partial<EmpressConfig>) {
  const currentConfig = require(CONFIG_FILE_PATH) || {};
  const config = { ...currentConfig, ...newConfig };
  fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config), (e: any) => {
    if (e) throw e;
  });
}

function getLocalConfigFilePath(dirPath: string): string | null {
  let dir = dirPath;
  let filePath = path.resolve(dir, LOCAL_CONFIG_FILE_NAME);
  let i = 0;
  while (!fs.existsSync(filePath) && i < 5) {
    dir = path.resolve(dir, '..');
    filePath = path.resolve(dir, LOCAL_CONFIG_FILE_NAME);
    i++;
  }
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return filePath;
}

function getLocalConfig(
  dir: string = process.cwd(),
): EmpressLocalConfig | null {
  const configFilePath = getLocalConfigFilePath(dir);
  try {
    if (configFilePath === null) {
      console.log(
        chalk.red('Directory not initalized. Run empress-hub init first'),
      );
      return null;
    }
    return require(configFilePath);
  } catch (e) {
    return null;
  }
}

async function setLocalConfig(
  localConfigFilePath: string,
  newConfig: Partial<EmpressLocalConfig>,
) {
  const currentConfig: EmpressLocalConfig = require(localConfigFilePath) || {};
  console;
  const config: EmpressLocalConfig = {
    ...currentConfig,
    ...newConfig,
    filesToPush: _.uniq(
      (currentConfig.filesToPush || []).concat(newConfig.filesToPush || []),
    ),
  };
  fs.writeFile(localConfigFilePath, JSON.stringify(config), (e: any) => {
    if (e) throw e;
  });
}

program
  .version(require('../package.json').version)
  .option('-d, --debug', 'output extra debugging');

program
  .command('setup')
  .description('Set up empress-hub')
  .action(async () => {
    if (fs.existsSync(CONFIG_DIR_PATH)) {
      console.log(
        chalk.red("Directory '" + CONFIG_DIR_PATH + "' already exists."),
      );
      const ok = await yesno({
        question: 'Do you want to overwrite? [yes]',
        defaultValue: true,
      });
      if (!ok) return;
      else shell.exec('rm -rf ' + CONFIG_DIR_PATH);
    }
    await shell.exec(
      `mkdir ${CONFIG_DIR_PATH} && echo "{}" > ${CONFIG_FILE_PATH}`,
    );
    const config: Partial<EmpressConfig> = {};
    const responses = await prompts({
      type: 'text',
      name: 'host',
      message: 'Enter your empress ssh host (ex: user@mit.edu)',
      validate: (value: string) => value && value.length > 0,
    });
    config.sshHost = responses.host;
    setConfig(config);
  });

function getConfig(): EmpressConfig | null {
  try {
    return require(CONFIG_FILE_PATH);
  } catch (e) {
    return null;
  }
}

program
  .command('host <sshHost>')
  .description('Set empress ssh host (ex: user@emrpess.mit.edu)')
  .action(sshHost => {
    const config: EmpressConfig | null = getConfig();
    if (!config) {
      console.log(
        chalk.red('empress-hub not setup. Run empress-hub setup first'),
      );
      return;
    }
    config.sshHost = sshHost;
  });

program
  .command('init <remotePath>')
  .description('Inititialize directory')
  .action(async remotePath => {
    const dir = process.cwd();
    const configFilePath = getLocalConfigFilePath(dir);
    if (configFilePath !== null) {
      console.log(
        chalk.red('Directory already initialied at ' + configFilePath),
      );
      return;
    }
    await shell.exec(
      `mkdir ${dir}/${LOCAL_CONFIG_DIR_NAME} && echo "{}" > ${dir}/${LOCAL_CONFIG_FILE_NAME}`,
    );
    const config: Partial<EmpressLocalConfig> = { remotePath, filesToPush: [] };
    setLocalConfig(`${dir}/${LOCAL_CONFIG_FILE_NAME}`, config);
    console.log(chalk.green('Initialized at ' + dir));
  });

program
  .command('setRemotePath <remotePath>')
  .description('Reset directory remote path')
  .action(async remotePath => {
    const dir = process.cwd();
    const configFilePath = getLocalConfigFilePath(dir);
    if (configFilePath === null) {
      console.log(
        chalk.red('Directory not initalized. Run empress-hub init first'),
      );
      return;
    }
    const config: Partial<EmpressLocalConfig> = { remotePath };
    setLocalConfig(configFilePath, config);
  });

program
  .command('add <file> [otherFiles...]')
  .description('Add files to be push')
  .action(async (file, otherFiles) => {
    const filesToPush = [file].concat(otherFiles);
    const configFilePath = getLocalConfigFilePath(process.cwd());
    if (!configFilePath) {
      console.log(
        chalk.red('Directory not initalized. Run empress-hub init first'),
      );
      return;
    }
    setLocalConfig(configFilePath, { filesToPush });
  });

program
  .command('push')
  .description('Push added files to empress')
  .action(async () => {
    const configFilePath = getLocalConfigFilePath(process.cwd());
    if (!configFilePath) {
      console.log(
        chalk.red('Directory not initalized. Run empress-hub init first'),
      );
      return;
    }
    const globalConfig: EmpressConfig | null = getConfig();
    if (!globalConfig) {
      console.log(
        chalk.red('empress-hub not setup. Run empress-hub setup first'),
      );
      return;
    }
    const localConfig: EmpressLocalConfig | null = getLocalConfig();
    if (!localConfig) return;
    const filesToPush = localConfig.filesToPush;
    if (filesToPush.length < 1) {
      console.log(chalk.red('No files added. Run empress-hub add firsts.'));
      return;
    }
    let cmd = 'scp';
    let dirPath = configFilePath.replace(LOCAL_CONFIG_FILE_NAME, '');
    for (const file of filesToPush) {
      cmd += ' ' + path.resolve(dirPath, file);
    }
    let remoteDirPath = globalConfig.sshHost + ':' + localConfig.remotePath;
    cmd += ' ' + remoteDirPath;
    console.log(chalk.yellwo(cmd));
    shell.exec(cmd);
    // TODO handle push from subdirectory of initialied directory
  });

program.parse(process.argv);
if (program.debug) console.log(program.opts());

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
