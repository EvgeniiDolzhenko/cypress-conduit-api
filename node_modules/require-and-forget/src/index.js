'use strict'

const debug = require('debug')('require-and-forget')
const path = require('path')

function relativeResolve (parent, name) {
  const fullPath = path.join(path.dirname(parent.filename), name)
  const resolvedPath = require.resolve(fullPath)
  return resolvedPath
}

function requireAndForget (name) {
  const parent = module.parent
  if (!parent) {
    throw new Error('Cannot load without a parent module')
  }
  if (!name) {
    throw new Error('Missing module path or name')
  }

  debug('parent', parent)
  debug('needs', name)

  const resolvedPath = path.isAbsolute(name)
    ? require.resolve(name)
    : relativeResolve(parent, name)
  debug('its resolved path', resolvedPath)
  const value = require(resolvedPath)
  delete require.cache[resolvedPath]
  return value
}
module.exports = requireAndForget
