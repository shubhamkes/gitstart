const { Octokit } = require("@octokit/rest");
const { createAppAuth } = require("@octokit/auth-app");
const Configstore = require("configstore");
const pkg = require("../package.json");
const _ = require("lodash");
const CLI = require("clui");
const Spinner = CLI.Spinner;
const chalk = require("chalk");
const fs = require("fs");
const homedir = require("os").homedir();

const inquirer = require("./inquirer");

const conf = new Configstore(pkg.name);

let octokit;

module.exports = {
	getInstance: () => {
		return octokit;
	},

	setGithubCredentials: async () => {
        const token = require("../config/keys.json").github_token;
		octokit = new Octokit({
			auth: token,
		});
	},

};
