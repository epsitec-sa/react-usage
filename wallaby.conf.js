'use strict';
var babel = require ('babel-core');

module.exports = function (wallaby) {
  return {
    files: [
      {pattern: 'test/**/*.js'}
    ],
    tests: [
      {pattern: 'test/**/*.spec.jsx'},
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
      require ('./test/test_helper');
    },
    teardown: function () {
      console.log ('Teardown wallaby');
    }
  };
};
