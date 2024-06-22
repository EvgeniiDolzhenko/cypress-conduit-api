# require-and-forget

> Require Node module and immediately remove it from module cache to force loading again next time

[![NPM][npm-icon] ][npm-url]

[![Build status][ci-image] ][ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![js-standard-style][standard-image]][standard-url]

This module is useful for testing when you want to force reloading and re-evaluating the
NPM module.

## Install

Requires [Node](https://nodejs.org/en/) version 4 or above.

```sh
npm install --save require-and-forget
```

## Use

Whenever you want to get an exported value from a module, but not store it in
the Node's `require.cache`. Imagine we have a file that just exports a random value

```js
// random.js
module.exports = Math.random()
```

Ordinarily, every `require('./random')` will get the same value because it will be stored
cached in the Node's cache. The `./random.js` will not be evaluated every time you require it.
Instead you can load and "forget it" to force re-evaluation.

```js
const forget = require('require-and-forget')
const r1 = forget('./random')
const r2 = forget('./random')
// r1 and r2 will be different
// "random.js" will not be stored in the require.cache
```

## Related projects

* [unload-me](https://github.com/bahmutov/unload-me) - the module itself forces Node's cache
  to delete it after loading. Kind of `self-destruct`.
* [Playing havoc with Node module system](https://glebbahmutov.com/blog/playing-havoc-with-node-module-system/)
* [Hacking Node require](https://glebbahmutov.com/blog/hacking-node-require/)
* [Faster Node app require](https://glebbahmutov.com/blog/faster-node-app-require/)
* [node-hook](https://github.com/bahmutov/node-hook) - Run source transform function on node require call.

## Debug

Run code with `DEBUG=require-and-forget` environment variable

### Small print

Author: Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt; &copy; 2017

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](https://glebbahmutov.com)
* [blog](https://glebbahmutov.com/blog)

License: MIT - do anything with the code, but don't blame me if it does not work.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/require-and-forget/issues) on Github

## MIT License

Copyright (c) 2017 Gleb Bahmutov &lt;gleb.bahmutov@gmail.com&gt;

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[npm-icon]: https://nodei.co/npm/require-and-forget.svg?downloads=true
[npm-url]: https://npmjs.org/package/require-and-forget
[ci-image]: https://travis-ci.org/bahmutov/require-and-forget.svg?branch=master
[ci-url]: https://travis-ci.org/bahmutov/require-and-forget
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[standard-url]: http://standardjs.com/
