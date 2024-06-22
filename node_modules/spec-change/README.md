# spec-change

> Computes specs to re-run when files change

## Use

### CLI

```
$ npx spec-change --folder "path to folder with specs"
```

Prints a JSON object with the list of JavaScript files. For each file prints the list of dependent files. For example, if `spec.js` imports or requires `utils.js` file, then it will print something like:

```json
{
  "spec.js": ["spec.js"],
  "utils.js": ["spec.js"]
}
```

You can specify the file mask

```
# start the search from TS files only
$ npx spec-change --folder "path to folder" --mask '**/*.ts'
```

You can save detected dependencies into a JSON file

```
$ npx spec-change --folder "path to folder" --mask '**/*.ts' --save-deps my-deps.json
```

The saved file will be something like:

```json
{
  "generatedAt": "2024-01-20T03:38:50.803Z",
  "folder": "relative path to folder",
  "fileMask": "**/*.ts",
  "deps": {
    "utils/sub/misc.js": ["spec-b.ts"],
    "spec-b.ts": ["spec-b.ts"]
  }
}
```

**Note:** the file will NOT be written if the folder, file mask, and the dependencies tree is the same.

You can check how long finding files and dependencies takes by adding `--time` boolean flag. Note: the info is printed to `STDERR` stream

```
$ npx spec-change --folder "path to folder" --mask '**/*.ts' --time
spec-change took 25ms
```

If you have JS and TS files in the same project, you should use the flag `--allowjs` to make sure TS imports from JS files are detected.

```
$ npx spec-change --folder "path to folder" --allowjs
```

#### TS config path

You can pass path to `tsconfig.json` to use to discover dependencies, even when using import path aliases.

```
$ npx spec-change --folder "path to folder" --ts-config tsconfig.json
```

If there is `tsconfig.json` file in the current folder, it will be used automatically. You can only specify the `--ts-config` option or `allowJs`.

### NPM module

All files are found using the `import` and `require` directives.

#### getDependentFiles

```js
const { getDependentFiles } = require('spec-change')
// the input paths should be absolute
const deps = getDependentFiles([
  'path/to/spec1.js',
  'path/to/spec2.js',
  ...
], 'path/to/common/directory')
```

The output will be an object with all files (the initial plus all files they import or require). Each key will be a relative filename to the directory. The values will be arrays, with relative filenames of files dependent on the key file.

```js
{
  // input files at least dependent on selves
  'path/to/spec1.js': ['path/to/spec1.js'],
  'path/to/spec2.js': ['path/to/spec2.js'],
  ...
  // the specs spec2 and spec3 imports something from utils
  'path/to/utils.js': ['path/to/spec2.js', 'path/to/spec3.js'],
  ...
}
```

#### getDependsInFolder

Finds the source files in the given folder and returns the dependencies object (just like above)

```js
const { getDependsInFolder } = require('spec-change')
// see the "bin/spec-change.js" for example
const deps = getDependsInFolder({
  folder: '/absolute/path/to/folder',
  fileMask: '**/*.{js,ts,jsx,tsx}',
  allowJs: true,
})
```

#### affectedFiles

Takes the dependencies computed using `getDependsInFolder` or `getDependentFiles` and a list of source files and produces a list of potentially affected files.

```js
const { getDependsInFolder, affectedFiles } = require('spec-change')
const deps = getDependsInFolder(directory)
const changedFiles = ['utils/sub/misc.js']
const affected = affectedFiles(deps, changedFiles)
// a list of files that depend on the misc file
```

## Debugging

Run this code with environment variable `DEBUG=spec-change`

## Examples

Used to [run affected Cypress specs first on CI](https://glebbahmutov.com/blog/trace-changed-specs/)

## Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2022

- [@bahmutov](https://twitter.com/bahmutov)
- [glebbahmutov.com](https://glebbahmutov.com)
- [blog](https://glebbahmutov.com/blog)
- [videos](https://www.youtube.com/glebbahmutov)
- [presentations](https://slides.com/bahmutov)
- [cypress.tips](https://cypress.tips)
- [Cypress Tips & Tricks Newsletter](https://cypresstips.substack.com/)
- [my Cypress courses](https://cypress.tips/courses)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/spec-change/issues) on Github
