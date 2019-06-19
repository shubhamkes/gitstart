const Octokit = require('@octokit/rest');
const Configstore = require('configstore');
const pkg = require('../package.json');
const _ = require('lodash');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');

const inquirer = require('./inquirer');

const conf = new Configstore(pkg.name);

// let octokit;
let octokit = new Octokit();

module.exports = {

    getInstance: () => {
        console.log('2')
        return octokit;
    },

    getStoredGithubToken: () => {
        return conf.get('github.token');
    },

    setGithubCredentials: async () => {
        const credentials = await inquirer.askGithubCredentials();

        octokit = new Octokit({
            auth: {
                ...credentials,
                async on2fa() {
                    return promptForOTP()
                }
            }
        })
    },

    registerNewToken: async () => {
        const status = new Spinner('Authenticating you, please wait...');
        status.start();

        try {
            const response = await octokit.oauthAuthorizations.createAuthorization({
                scopes: ['user', 'public_repo', 'repo', 'repo:status'],
                note: 'gitstart, the command-line tool for initalizing Git repos'
            });
            const token = response.data.token;
            if (token) {
                conf.set('github.token', token);
                return token;
            } else {
                throw new Error("Missing Token", "GitHub token was not found in the response");
            }
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    },

    githubAuth: (token) => {
        // octokit.authenticate({
        //     type: 'oauth',
        //     token: token
        // });

        // octokit = new Octokit({
        //     auth: {
        //         type: 'oauth',
        //         token: token
        //     }
        // })

        console.log('token', token)
        octokit = new Octokit({
            auth: `token ${token}`
        })

        // octokit = new Octokit({
        //     auth: `token ${token}`
        // });
    },

}