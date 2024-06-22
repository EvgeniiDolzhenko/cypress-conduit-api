// https://github.com/dependents/node-dependency-tree
const dependencyTree = require('dependency-tree')
const path = require('path')
const { lazyAss: la } = require('lazy-ass')
const debug = require('debug')('spec-change')
const globby = require('globby')
const fs = require('fs')
const deepEqual = require('deep-equal')

function isOutside(relativePath) {
  return relativePath.startsWith('..')
}

function convertKeysToRelative(tree, directory) {
  const result = {}
  const paths = Object.keys(tree)
  paths.forEach((absolutePath) => {
    const relativePath = path.relative(directory, absolutePath)
    // do not compute dependencies with the modules
    // outside the given folder
    if (!isOutside(relativePath)) {
      result[relativePath] = convertKeysToRelative(
        tree[absolutePath],
        directory,
      )
    }
  })
  return result
}

/**
 * Returns a tree of dependencies found starting from the filename.
 * All paths are relative to the given directory.
 */
function getFileDependencies(filename, directory, allowJs, tsConfigFilename) {
  const treeOptions = {
    filename,
    directory,
    tsConfig: tsConfigFilename,
  }

  if (!tsConfigFilename && allowJs) {
    treeOptions.tsConfig = {
      compilerOptions: {
        // JS files can import TS files
        // and vice versa
        allowJs: true,
      },
    }
  }
  const tree = dependencyTree(treeOptions)
  // debug({ filename, directory })
  // debug(tree)

  // convert absolute paths into relative
  const relativeTree = convertKeysToRelative(tree, directory)
  return relativeTree
}

/**
 * Returns an array of filenames (relative to the directory)
 * for all dependencies reachable from the given filename via "require" or "import"
 * statements.
 */
function getFlatFileDependencies(
  filename,
  directory,
  allowJs,
  tsConfigFilename,
) {
  const firstFileRelative = path.relative(directory, filename)
  const tree = getFileDependencies(
    filename,
    directory,
    allowJs,
    tsConfigFilename,
  )
  const set = new Set()

  const addPaths = (tr) => {
    const paths = Object.keys(tr)
    paths.forEach((relativePath) => {
      // do not add the top level file itself
      if (relativePath !== firstFileRelative) {
        if (!set.has(relativePath)) {
          set.add(relativePath)
        }
      }
      addPaths(tr[relativePath])
    })
  }

  addPaths(tree)

  return [...set].sort()
}

/**
 * Computes the list of files each spec in the filenames depends on.
 * All returned paths are relative to the given directory.
 */
function getFlatFilesDependencies(
  filenames,
  directory,
  allowJs,
  tsConfigFilename,
) {
  la(Array.isArray(filenames), 'expected a list of filenames', filenames)
  la(typeof directory === 'string', 'expected a directory', directory)

  const result = {}
  filenames.forEach((filename) => {
    const name = path.relative(directory, filename)
    const dependsOn = getFlatFileDependencies(
      filename,
      directory,
      allowJs,
      tsConfigFilename,
    )
    result[name] = dependsOn
  })

  return result
}

/**
 * Computes the dependencies for the given list of files.
 * Then reverses the output to produce an object. Each key
 * is a relative filename. The value is a list of _other_ files that depend on it
 * @param {string[]} filenames The absolute filenames to the source files
 * @param {string} directory The absolute path to the common directory
 * @param {boolean} allowJs Allow JS and TS specs to import each other
 * @param {string} tsConfigFilename Optional TS config filename
 * @see https://github.com/bahmutov/spec-change
 */
function getDependentFiles(filenames, directory, allowJs, tsConfigFilename) {
  la(Array.isArray(filenames), 'expected a list of filenames', filenames)
  la(typeof directory === 'string', 'expected a directory', directory)
  const flatDeps = getFlatFilesDependencies(
    filenames,
    directory,
    allowJs,
    tsConfigFilename,
  )

  const allImportedFilesSet = new Set()
  Object.values(flatDeps).forEach((deps) => {
    deps.forEach((file) => {
      if (!allImportedFilesSet.has(file)) {
        allImportedFilesSet.add(file)
      }
    })
  })

  const result = {}
  allImportedFilesSet.forEach((file) => {
    result[file] = []
    // find all top level files that depend on this file
    Object.keys(flatDeps).forEach((f) => {
      if (flatDeps[f].includes(file)) {
        result[file].push(f)
      }
    })
  })
  // also include the top level files - each file at least depends on itself
  filenames.forEach((filename) => {
    const relative = path.relative(directory, filename)
    if (!result[relative]) {
      result[relative] = [relative]
    }
    // TODO: handle dependencies between the given files
  })

  return result
}

/**
 * Give the folder name and optional file mask, finds dependencies between all files.
 * The returned object can have _other_ files, if they are imported or required
 * from the source files.
 */
function getDependsInFolder(options) {
  debug('options %o', options)
  const { folder, allowJs, tsConfigFilename } = options
  let { saveDepsFilename } = options
  const fileMask = options.fileMask || '**/*.{js,jsx,ts,tsx}'

  la(path.isAbsolute(folder), 'expected an absolute folder path', folder)
  la(typeof fileMask === 'string', 'expected a file mask', fileMask)

  debug('absolute folder: %s', folder)
  debug('file mask: %s allow JS %o', fileMask, allowJs)
  if (tsConfigFilename) {
    debug('ts-config filename %s', tsConfigFilename)
  }

  const started = +new Date()
  const files = globby.sync(fileMask, {
    cwd: folder,
    absolute: true,
  })
  debug('found %d files %o', files.length, files)

  const deps = getDependentFiles(files, folder, allowJs, tsConfigFilename)

  if (saveDepsFilename) {
    // use relative folder
    const relativeFolder = path.relative(process.cwd(), folder)

    if (fs.existsSync(saveDepsFilename)) {
      const oldDeps = JSON.parse(fs.readFileSync(saveDepsFilename, 'utf8'))
      const sameFolder = oldDeps.folder === relativeFolder
      const sameMask = oldDeps.fileMask === fileMask
      const sameDependencies = deepEqual(oldDeps.deps, deps)
      debug({ sameFolder, sameMask, sameDependencies })
      if (sameFolder && sameMask && sameDependencies) {
        saveDepsFilename = false
      }
    }

    if (saveDepsFilename) {
      debug('saving updated json file with dependencies %s', saveDepsFilename)

      const fullInfo = {
        warning:
          'This is a machine-generated file, do not modify it manually. Use https://github.com/bahmutov/spec-change',
        generatedAt: new Date().toISOString(),
        folder: relativeFolder,
        fileMask,
        deps,
      }
      const s = JSON.stringify(fullInfo, null, 2) + '\n\n'
      fs.writeFileSync(saveDepsFilename, s, 'utf8')
      console.log('saved updated dependencies file %s', saveDepsFilename)
    } else {
      console.log('skipping saving dependencies file')
    }
  }
  const finished = +new Date()
  if (options.time) {
    console.error('spec-change took %dms', finished - started)
  }

  return deps
}

/**
 * Given the computed dependencies object and a list of files,
 * returns a list of files that are affected by the changes.
 * Useful when the files are computed using source control changes
 * and now we want to verify _all_ potentially affected source files.
 * @see `getDependsInFolder`
 * @param {Object} deps Source file dependencies computed using `getDependentFiles` or `getDependsInFolder`
 * @param {string[]} filenames List of filenames (relative) that have changed
 * @returns {string[]}
 */
function affectedFiles(deps, filenames) {
  const affected = new Set()
  filenames.forEach((filename) => {
    if (deps[filename]) {
      const filesAffectedByThisChangedFile = deps[filename]
      filesAffectedByThisChangedFile.forEach((name) => {
        affected.add(name)
      })
    }
  })

  return [...affected].sort()
}

module.exports = {
  getFileDependencies,
  getFlatFileDependencies,
  getFlatFilesDependencies,
  getDependentFiles,
  getDependsInFolder,
  affectedFiles,
}
