const _ = require('lodash');
const fs = require('fs');
const git = require('simple-git')('/Users/shubhamkesarwani/jr/project/gitstart');
const CLI = require('clui')
const Spinner = CLI.Spinner;

const inquirer = require('./inquirer');
const gh = require('./github');

module.exports = {
    createRemoteRepo: async () => {
        const github = gh.getInstance();
        const answers = await inquirer.askRepoDetails();

        const data = {
            name: answers.name,
            description: answers.description,
            private: (answers.visibility === 'private')
        };

        const status = new Spinner('Creating remote repository...');
        status.start();

        try {

            // console.log('github', github.repos);

            const response = await github.repos.createForAuthenticatedUser(data);
            return response.data.clone_url;
            // return response.data.ssh_url;

        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    },
    createGitignore: async () => {
        const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');

        if (filelist.length) {
            const answers = await inquirer.askIgnoreFiles(filelist);
            if (answers.ignore.length) {
                fs.writeFileSync('.gitignore', answers.ignore.join('\n'));
            } else {
                touch('.gitignore');
            }
        } else {
            touch('.gitignore');
        }
    },
    setupRepo: async (url) => {
        console.log('repo created', url);
        const status = new Spinner('Initializing local repository and pushing to remote...');
        status.start();

        try {
            await git
                .init()
                .add('.gitignore')
                .add('./*')
                .commit('Initial commit')
                .addRemote('origin', url)
                .push('origin', 'master');
            return true;
        } catch (err) {
            throw err;
        } finally {
            status.stop();
        }
    },
}