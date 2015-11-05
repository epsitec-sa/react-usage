'use strict';

// Provide document and window as globals, so that React can be
// tested outside of a browser environment.

import jsdom from 'jsdom';

var doc = jsdom.jsdom ('<!doctype html><html><body><div id="root"/></body></html>');
var win = doc.defaultView;

/* global global */
global.document = doc;
global.window = win;

Object.keys (win).forEach ((key) => {
  if (!(key in global)) {
    global[key] = win[key];
  }
});
