# Scripts

## Serve

### `npm run serve:package`

Starts a webpack dev server with the [config](./scripts/webpack/webpack.dev.babel.js) for the given widget.

### `npm run serve:samples`

Serves the [samples](./samples) folder, an easy to use component demo.

## Build - build.js

See [build.js](./scripts/utils/build.js) for implementation.

### `buildCommonJS`

Build a package to CommonJS using babel.

### `buildES`

Uses [rollup](https://rollupjs.org) to bundle the modules in a [ES Module](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/) compatible output.

### `webpackBuild`

Builds a component with webpack and outputs to the `dist` folder.

This command does a webpack build by first `cd` into the package directory.
It then executes the following command:

```bash
webpack --config `(path to webpack.prod.babel.js)` --env.package=`(package name)`
```

### `transpile`

Runs the [buildES](#buildES) and [buildCommonJS](#buildCommonJS) commands to build a package to ES Modules and CommonJS.

## Build - npm run

### `npm run build:components`

Builds all component and module packages. Components are defined as not starting with "widget", nor are they private modules.

The components are "transpiled" with babel and have commonJS and ES5 outputs.

Executes [`webpackBuild`](#webpackBuild) command.

### `npm run build:esm [all]`

Builds one or all components for ES Modules.

Executes [`buildES`](#buildES) command.

### `npm run build:package`

Bundles the package into a single distributable "dist" subfolder.

It executes the [dist.js](./scripts/build/commands/dist.js) command on the given package.

Which executes the [`webpackBuild`](#webpackBuild) command.

### `npm run build:packagejson`

Builds the dependency chain for each module by utilizing the [detective-es6](https://github.com/dependents/node-detective-es6) tool.

[Implementation in the deps.js file.](./scripts/utils/deps.js)

### `npm run build:widgets`

Runs a webpack build and transpile on all packages that start with '@webex/widget'.

* Executes [`webpackBuild`](#webpackBuild) command.
* Executes [`transpile`](#transpile) command.

### `npm run es5-check:dist`
Verifies that the bundles are es5 compatible.

### `npm run es6-check:esm`
Verifies that the ES modules are es6 compatible.
## Publish

Publishing the different packages to NPM.

### `npm run publish:components`

Runs the commands necessary to publish all of the widgets and components to NPM

* `build:components`
* `build:widgets`
* `build:packagejson`
* `es6-check:esm`
* `publish components`

### `npm run publish components`

Not to be confused with `publish:components`, `publish components` does the actual npm publishing.

It looks through all the packages, excludes demos and private packages, and issues the following command for each of them:

```bash
npm publish --access public
```

Implemented in [scripts/utils/publish.js](./scripts/utils/publish.js)
