'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Hello from '../components/stateless/Hello.js';

describe ('ReactDOMServer', () => {
  describe ('renderToString()', () => {
    it ('produces HTML output', () => {
      const output = ReactDOMServer.renderToString (<Hello id='x' name='Joe'/>);
      expect (output).to.startWith ('<div id="x" data-reactid=');
      expect (output).to.contain ('>Hello </span>');
      expect (output).to.contain ('>Joe</span>');
      expect (output).to.endWith ('</div>');
    });
  });

  describe ('renderToStaticMarkup()', () => {
    it ('produces HTML output', () => {
      const output = ReactDOMServer.renderToStaticMarkup (<Hello id='x' name='Joe'/>);
      expect (output).to.equal ('<div id="x">Hello Joe</div>');
    });

    it ('produces HTML output on React.createElement', () => {
      const element = React.createElement ('img', {src: 'avatar.png', className: 'profile'});
      const output  = ReactDOMServer.renderToStaticMarkup (element);
      expect (output).to.equal ('<img src="avatar.png" class="profile"/>');
    });

    it ('produces HTML output on React.createElement, custom component', () => {
      const element = React.createElement (Hello, {id: 'x', name: 'Joe'});
      const output  = ReactDOMServer.renderToStaticMarkup (element);
      expect (output).to.equal ('<div id="x">Hello Joe</div>');
    });

    it ('produces HTML output on React.createElement, custom component - unresolved', () => {
      const element = React.createElement ('Hello', {id: 'x', name: 'Joe'});
      const output  = ReactDOMServer.renderToStaticMarkup (element);
      expect (output).to.equal ('<Hello id="x" name="Joe"></Hello>');
    });
  });
});
