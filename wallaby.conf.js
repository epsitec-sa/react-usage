/*globals __dirname */
'use strict';

var babel = require ('babel-core');
var fs = require ('fs');
var path = require ('path');

var babelConfig = JSON.parse (fs.readFileSync (path.join (__dirname, '.babelrc')));

babelConfig.babel = babel;

module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'test/test-helper.js'},
      {pattern: 'src/store/**/*.js'},
      {pattern: 'src/components/**/*.js'}
    ],
    tests: [
      {pattern: 'src/test/**/*.js'},
    ],
    compilers: {
      '**/*.js*': wallaby.compilers.babel (babelConfig)
    },
    debug: true,
    env: {
      type: 'node',
      runner: 'node'
    },
    bootstrap: function () {
      // See http://wallabyjs.com/docs/config/bootstrap.html
      console.log ('Setup wallaby');

      var sep = require ('path').sep;

      // Remove react from the require.cache, or else some code might not get
      // executed when editing the source code.
      // See https://github.com/wallabyjs/public/issues/321

      Object.keys (require.cache)
        .forEach (function (k) {
          if (k.indexOf (sep + 'react' + sep) > -1) {
            delete require.cache[k];
          }
        });

      // Include the test helper, which sets up the document and window objects
      // as globals:
      require ('./test/test-helper');
    },
    teardown: function () {
      console.log ('Teardown wallaby');
    }
  };
};
