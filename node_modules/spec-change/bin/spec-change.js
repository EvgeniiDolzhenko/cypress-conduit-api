#!/usr/bin/env node

const arg = require('arg')
const debug = require('debug')('spec-change')
const path = require('path')
const fs = require('fs')
const { getDependsInFolder } = require('../src')

const args = arg({
  '--folder': String,
  '--mask': String,
  '--save-deps': String, // output filename
  '--time': Boolean,
  '--allowjs': Boolean,
  '--ts-config': String, // ts config filename
  // aliases
  '-f': '--folder',
  '-m': '--mask',
  '-t': '--time',
  '--allow-js': '--allowjs',
  '--allowJs': '--allowjs',
  '--allowJS': '--allowjs',
  '--tsconfig': '--ts-config',
})

debug('arguments %o', args)

if (!args['--folder']) {
  console.error('Missing --folder argument')
  process.exit(1)
}
if (!fs.existsSync(args['--folder'])) {
  console.error('Cannot find folder %s', args['--folder'])
  process.exit(1)
}

const folder = path.resolve(args['--folder'])
const fileMask = args['--mask'] || '**/*.{js,ts,jsx,tsx}'
const saveDepsFilename = args['--save-deps']
const time = args['--time']
const allowJs = args['--allowjs'] || false

let tsConfigFilename = args['--ts-config']
if (tsConfigFilename) {
  if (allowJs) {
    console.error('Cannot use both --allowjs and --ts-config')
    process.exit(1)
  }
}

if (!tsConfigFilename && fs.existsSync('tsconfig.json')) {
  tsConfigFilename = 'tsconfig.json'
  debug('found tsconfig file %s', tsConfigFilename)
}

const deps = getDependsInFolder({
  folder,
  fileMask,
  saveDepsFilename,
  time,
  allowJs,
  tsConfigFilename,
})
const depsStringified = JSON.stringify(deps, null, 2)
console.log(depsStringified + '\n')
