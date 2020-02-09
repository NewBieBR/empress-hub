#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk = require('chalk');
var clear = require('clear');
var figlet = require('figlet');
var path = require('path');
var commander_1 = __importDefault(require("commander"));
var shell = require('shelljs');
var fs = require('fs');
var prompts = require('prompts');
var yesno_1 = __importDefault(require("yesno"));
var homedir = require('os').homedir();
var _ = require('lodash');
var CONFIG_DIR_PATH = homedir + "/.empress-hub";
var CONFIG_FILE_PATH = CONFIG_DIR_PATH + "/config.json";
var LOCAL_CONFIG_DIR_NAME = '.empress-hub';
var LOCAL_CONFIG_FILE_NAME = LOCAL_CONFIG_DIR_NAME + "/config.json";
clear();
console.log(chalk.green(figlet.textSync('EMPRESS HUB', { horizontalLayout: 'full' })));
function setConfig(newConfig) {
    var currentConfig = require(CONFIG_FILE_PATH) || {};
    var config = __assign(__assign({}, currentConfig), newConfig);
    fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config), function (e) {
        if (e)
            throw e;
    });
}
function getLocalConfigFilePath(dirPath) {
    var dir = dirPath;
    var filePath = path.resolve(dir, LOCAL_CONFIG_FILE_NAME);
    var i = 0;
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
function getLocalConfig(dir) {
    if (dir === void 0) { dir = __dirname; }
    var configFilePath = getLocalConfigFilePath(dir);
    try {
        if (configFilePath === null) {
            console.log(chalk.red('Directory not initalized. Run empress-hub init first'));
            return null;
        }
        return require(configFilePath);
    }
    catch (e) {
        return null;
    }
}
function setLocalConfig(localConfigFilePath, newConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var currentConfig, config;
        return __generator(this, function (_a) {
            currentConfig = require(localConfigFilePath) || {};
            console;
            config = __assign(__assign(__assign({}, currentConfig), newConfig), { filesToPush: _.uniq(currentConfig.filesToPush.concat(newConfig.filesToPush || [])) });
            fs.writeFile(localConfigFilePath, JSON.stringify(config), function (e) {
                if (e)
                    throw e;
            });
            return [2 /*return*/];
        });
    });
}
commander_1.default
    .version(require('../package.json').version)
    .option('-d, --debug', 'output extra debugging');
commander_1.default
    .command('setup')
    .description('Set up empress-hub')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var ok, config, responses;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!fs.existsSync(CONFIG_DIR_PATH)) return [3 /*break*/, 2];
                console.log(chalk.red("Directory '" + CONFIG_DIR_PATH + "' already exists."));
                return [4 /*yield*/, yesno_1.default({
                        question: 'Do you want to overwrite? [yes]',
                        defaultValue: true,
                    })];
            case 1:
                ok = _a.sent();
                if (!ok)
                    return [2 /*return*/];
                else
                    shell.exec('rm -rf ' + CONFIG_DIR_PATH);
                _a.label = 2;
            case 2: return [4 /*yield*/, shell.exec("mkdir " + CONFIG_DIR_PATH + " && echo \"{}\" > " + CONFIG_FILE_PATH)];
            case 3:
                _a.sent();
                config = {};
                return [4 /*yield*/, prompts({
                        type: 'text',
                        name: 'host',
                        message: 'Enter your empress ssh host (ex: user@mit.edu)',
                        validate: function (value) { return value && value.length > 0; },
                    })];
            case 4:
                responses = _a.sent();
                config.sshHost = responses.host;
                setConfig(config);
                return [2 /*return*/];
        }
    });
}); });
function getConfig() {
    try {
        return require(CONFIG_FILE_PATH);
    }
    catch (e) {
        return null;
    }
}
commander_1.default
    .command('host <sshHost>')
    .description('Set empress ssh host (ex: user@emrpess.mit.edu)')
    .action(function (sshHost) {
    var config = getConfig();
    if (!config) {
        console.log(chalk.red('empress-hub not setup. Run empress-hub setup first'));
        return;
    }
    config.sshHost = sshHost;
});
commander_1.default
    .command('init <remotePath>')
    .description('Inititialize directory')
    .action(function (remotePath) { return __awaiter(void 0, void 0, void 0, function () {
    var dir, configFilePath, config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dir = __dirname;
                configFilePath = getLocalConfigFilePath(dir);
                if (configFilePath !== null) {
                    console.log(chalk.red('Directory already initialied at ' + configFilePath));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, shell.exec("mkdir " + dir + "/" + LOCAL_CONFIG_DIR_NAME + " && echo \"{}\" > " + dir + "/" + LOCAL_CONFIG_FILE_NAME)];
            case 1:
                _a.sent();
                config = { remotePath: remotePath, filesToPush: [] };
                setLocalConfig(dir + "/" + LOCAL_CONFIG_FILE_NAME, config);
                return [2 /*return*/];
        }
    });
}); });
commander_1.default
    .command('setRemotePath <remotePath>')
    .description('Reset directory remote path')
    .action(function (remotePath) { return __awaiter(void 0, void 0, void 0, function () {
    var dir, configFilePath, config;
    return __generator(this, function (_a) {
        dir = __dirname;
        configFilePath = getLocalConfigFilePath(dir);
        if (configFilePath === null) {
            console.log(chalk.red('Directory not initalized. Run empress-hub init first'));
            return [2 /*return*/];
        }
        config = { remotePath: remotePath };
        setLocalConfig(configFilePath, config);
        return [2 /*return*/];
    });
}); });
commander_1.default
    .command('add <file> [otherFiles...]')
    .description('Add files to be push')
    .action(function (file, otherFiles) { return __awaiter(void 0, void 0, void 0, function () {
    var filesToPush, configFilePath;
    return __generator(this, function (_a) {
        filesToPush = [file].concat(otherFiles);
        configFilePath = getLocalConfigFilePath(__dirname);
        if (!configFilePath) {
            console.log(chalk.red('Directory not initalized. Run empress-hub init first'));
            return [2 /*return*/];
        }
        setLocalConfig(configFilePath, { filesToPush: filesToPush });
        return [2 /*return*/];
    });
}); });
commander_1.default
    .command('push')
    .description('Push added files to empress')
    .action(function () { return __awaiter(void 0, void 0, void 0, function () {
    var configFilePath, globalConfig, localConfig, filesToPush, cmd, dirPath, _i, filesToPush_1, file, remoteDirPath;
    return __generator(this, function (_a) {
        configFilePath = getLocalConfigFilePath(__dirname);
        if (!configFilePath) {
            console.log(chalk.red('Directory not initalized. Run empress-hub init first'));
            return [2 /*return*/];
        }
        globalConfig = getConfig();
        if (!globalConfig) {
            console.log(chalk.red('empress-hub not setup. Run empress-hub setup first'));
            return [2 /*return*/];
        }
        localConfig = getLocalConfig();
        if (!localConfig)
            return [2 /*return*/];
        filesToPush = localConfig.filesToPush;
        if (filesToPush.length < 1) {
            console.log(chalk.red('No files added. Run empress-hub add firsts.'));
            return [2 /*return*/];
        }
        cmd = 'scp';
        dirPath = configFilePath.replace(LOCAL_CONFIG_FILE_NAME, '');
        for (_i = 0, filesToPush_1 = filesToPush; _i < filesToPush_1.length; _i++) {
            file = filesToPush_1[_i];
            cmd += ' ' + path.resolve(dirPath, file);
        }
        remoteDirPath = globalConfig.sshHost + ':' + localConfig.remotePath;
        cmd += ' ' + remoteDirPath;
        console.log(cmd);
        shell.exec(cmd);
        return [2 /*return*/];
    });
}); });
commander_1.default.parse(process.argv);
if (commander_1.default.debug)
    console.log(commander_1.default.opts());
if (!process.argv.slice(2).length) {
    commander_1.default.outputHelp();
}
