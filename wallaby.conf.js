'use strict';

var babel = require ('babel-core');

module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'test/test_helper.js'},
      {pattern: 'test/components/**/*.js'}
    ],
    tests: [
      {pattern: 'test/**/*.spec.js'},
    ],
    compilers: {
      '**/*.js*': wallaby.compilers.babel ({
        babel: babel,
        presets: [
          'es2015',
          'react'
        ]
      })
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
      require ('./test/test_helper');
    },
    teardown: function () {
      console.log ('Teardown wallaby');
    }
  };
};
