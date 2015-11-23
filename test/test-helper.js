'use strict';

// Provide document and window as globals, so that React can be
// tested outside of a browser environment.

import jsdom from 'jsdom';

const doc = jsdom.jsdom ('<!doctype html><html><body><div id="root"/></body></html>');
const win = doc.defaultView;

// const MSIE11 = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
const Chrome49 =
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)' +
  ' Chrome/49.0.2454.85 Safari/537.36';

/* global global */
global.document  = doc;
global.window    = win;
global.navigator = {userAgent: Chrome49};

if (console.debug === undefined) {
  // Setting the userAgent to Chrome triggers a warning in React, which we
  // suppress in our custom implementation of console.debug() as it only adds
  // noise and is not pertinent in a testing environment.
  console.debug = function (...args) {
    if (args[0].includes ('https://fb.me/react-devtools')) {
      return;
    }
    console.log (...args);
  };
}

Object.keys (win).forEach (key => {
  if (!(key in global)) {
    global[key] = win[key];
  }
});
