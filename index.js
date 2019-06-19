#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const Configstore = require('configstore');

const files = require('./lib/files');
const inquirer = require('./lib/inquirer');
const github = require('./lib/github');
const repo = require('./lib/repo');

const git = require('simple-git')();

const conf = new Configstore('gitstart');

clear();
console.log(
    chalk.yellow(
        figlet.textSync('Drivezy Boilerplate', { horizontalLayout: 'full' })
    )
);

if (files.directoryExists('.git')) {
    console.log(chalk.red('Already a git repository!'));
    // @todo uncomment
    // process.exit();
}

// const run = async () => {
//     const credentials = await inquirer.askGithubCredentials();
//     console.log(credentials);
// }


const run = async () => {
    try {
        // Retrieve & Set Authentication Token
        const token = await getGithubToken();
        github.githubAuth(token);

        // try {
        //     await git
        //         // .init()
        //         // .add('.gitignore')
        //         // .add('./*')
        //         // .commit('Initial commit')
        //         // .addRemote('origin', 'git@github.com/shubhamkes/okla.git')
        //         // .push('origin', 'master')
        //         .push['-u', 'origin', 'master']
        //     return true;
        // } catch (err) {
        //     throw err;
        // } finally {
        //     // status.stop();
        // }
        // return;

        // Create remote repository
        const url = await repo.createRemoteRepo();
        // Create .gitignore file
        await repo.createGitignore();

        // Set up local repository and push to remote
        const done = await repo.setupRepo(url);
        if (done) {
            console.log(chalk.green('All done!'));
        }
    } catch (err) {
        if (err && typeof err == 'object') {
            switch (err.status) {
                case 401:
                    console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
                    break;
                case 422:
                    console.log(chalk.red('There already exists a remote repository with the same name'));
                    break;
                default:
                    console.log(err);
            }
        } else {
            console.log(err);
        }
    }
}

const getGithubToken = async () => {
    // Fetch token from config store
    let token = github.getStoredGithubToken();
    if (token) {
        return token;
    }

    // No token found, use credentials to access GitHub account
    await github.setGithubCredentials();

    // register new token
    token = await github.registerNewToken();
    return token;
}

run();