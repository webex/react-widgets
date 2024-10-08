# Contributing

We'd love for you to contribute to our source code and to make **Webex React Widgets** even better than it is today!
If you would like to contribute to this repository by adding features, enhancements or bug fixes, you must follow our process:

  1. Let core members know about your proposal by posting a message in the [contributor's Webex space](https://eurl.io/#Bk9WGfRcB)
  2. A core member will review your proposal and if necessary may suggest to have a meeting to better understand your approach
  3. If your proposal is approved you should start coding at this point
  4. We recommend opening a draft PR to receive feedback before finalizing your solution
      - When opening a draft PR, specify with PR comments where in the code you would like to get feedback
  5. Before opening a PR ensure **all** [PR guidelines](#submitting-a-pull-request) are followed
  6. Let core members know about your PR by posting a message in the [contributor's Webex space](https://eurl.io/#Bk9WGfRcB)
  7. Core members will review the pull request and provide feedback when necessary
      - If a PR is too large, you may be asked to break it down into multiple smaller-scoped PRs
  8. Once the PR is approved by a core member, it will be merged
  9. Celebrate! Your code is released 🎈🎉🍻

## Table of Contents

- [Contributing](#contributing)
  - [Reporting Issues](#reporting-issues)
  - [Contributing Code](#contributing-code)
    - [Build Dependencies](#build-dependencies)
    - [Git Commit Guidelines](#git-commit-guidelines)
      - [Commit Message Format](#commit-message-format)
      - [Revert](#revert)
      - [Type](#type)
      - [Scope](#scope)
      - [Subject](#subject)
      - [Body](#body)
      - [Footer](#footer)
    - [Running the tests](#running-the-tests)
      - [Static Analysis (e.g. linting)](#static-analysis)
    - [Submitting a Pull Request](#submitting-a-pull-request)

## Reporting Issues

Please reach out to our developer support team for any issues you may be experiencings with the SDK.

- <https://developer.webex.com/support>
- <devsupport@webex.com>

## Contributing Code

### Build Dependencies

Before you can build the Cisco Webex React Widgets, you will need the following dependencies:

- [Node.js](https://nodejs.org/) (LTS)
  - We recommend using [nvm](https://github.com/creationix/nvm) (or [nvm-windows](https://github.com/coreybutler/nvm-windows))
    to easily switch between Node.js versions.
  - Run `nvm use` to set your node version to the one this package expects.  If it is not installed, this program will tell you the command needed to install the required version.
  - Install the latest npm to enable security audits using `npm install npm@latest -g`
- [Git](https://git-scm.com/)

### Git Commit Guidelines

As part of the build process, commits are run through [conventional changelog](https://github.com/conventional-changelog/conventional-changelog) to generate the changelog. Please adhere to the following guidelines when formatting your commit messages.

#### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special format that includes a **type**, a **scope** and a **subject**:

``` text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the scope of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier to read on GitHub as well as in various git tools.

#### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>`., where the hash is the SHA of the commit being reverted.

#### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

#### Scope

The scope should indicate what is being changed. Generally, these should match package names. For example, `widget-space`, `widget-recents`, `avatar`, etc. Other than package names, `tooling` tends to be the most common.

#### Subject

The subject contains succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize first letter
- no dot (.) at the end

#### Body

Just as in the **subject** the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

#### Footer

The footer should contain any information about **Breaking changes** and is also the place to reference GitHub issues that this commit **closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

### Running the tests

Install dependencies:

``` bash
# Install top-level dependencies
npm install
```

You'll need to create a file called `.env` that defines, at a minimum:

- `WEBEX_CLIENT_ID`
- `WEBEX_CLIENT_SECRET`
- `WEBEX_REDIRECT_URI`
- `WEBEX_SCOPE`
- `WEBEX_ACCESS_TOKEN`

You can get these values by registering a new integration on [Cisco Webex for Developers](https://developer.webex.com/my-apps/new/integration).

Finally, to run all tests:

```bash
npm test
```

And to run the tests for a specific package:

```bash
npm run jest -- packages/@webex/PACKAGE_NAME
```

#### Static Analysis

We use eslint as a part of our static analysis step. Before contributing any code, please be sure to install eslint and be sure to following the instructions to correctly install peerDependnencies  <https://www.npmjs.com/package/@webex/eslint-config-react>

### Submitting a Pull Request

Prior to developing a new feature, be sure to search the [Pull Requests](https://github.com/webex/react-widgets/pulls) for your idea to ensure you're not creating a duplicate change. Then, create a development branch in your forked repository for your idea and start coding!

When you're ready to submit your change, first check that new commits haven't been made in the upstream's `master` branch. If there are new commits, rebase your development branch to ensure a fast-forward merge when your Pull Request is approved:

```bash
# Fetch upstream master and update your local master branch
git fetch upstream
git checkout master
git merge upstream/master

# Rebase your development branch
git checkout feature
git rebase master
```

Finally, open a [new Pull Request](https://github.com/webex/react-widgets/compare) with your changes. Be sure to mention the issues this request addresses in the body of the request. Once your request is opened, a developer will review, comment, and, when approved, merge your changes!
