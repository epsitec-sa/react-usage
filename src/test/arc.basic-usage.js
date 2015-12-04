'use strict';

import {expect} from 'mai-chai';
import {Store} from 'electrum-store';
import {Theme} from 'electrum-theme';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import {Button as Button} from '../components/arc/all.js';

describe ('Arc', () => {
  describe ('Button', () => {
    it ('exists', () => {
      expect (Button).to.exist ();
    });

    it ('is wrapped by Radium, default output', () => {
      const store = Store.create ();
      const theme = Theme.create ('default');
      store.select ('b').set ('', 'Cancel');
      const button = <Button state={store.select ('b')} theme={theme} kind='cancel'/>;
      const html = ReactDOMServer.renderToStaticMarkup (button);
      const expectedHtml =
        '<div>' +
          '<button style="display:inline-block;font-size:18px;font-family:Roboto, sans-serif;font-weight:400;' +
                         'text-transform:uppercase;cursor:pointer;outline:none;margin-top:3px;min-width:128px;' +
                         'border:none;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;' +
                         'color:rgba(0,0,0,0.87);' +
                         'background-color:#03a9f4;' +
                         'border-radius:2px;font-style:italic;-webkit-user-select:none;">' +
            'Cancel' +
          '</button>' +
        '</div>';

      expect (html).to.equal (expectedHtml);
    });

    it ('is wrapped by Radium, disabled output', () => {
      const store = Store.create ();
      const theme = Theme.create ('default');
      store.select ('b').set ('', 'Cancel');
      const button = <Button state={store.select ('b')} theme={theme} kind='cancel' disabled/>;
      const html = ReactDOMServer.renderToStaticMarkup (button);
      const expectedHtml =
        '<div>' +
          '<button style="display:inline-block;font-size:18px;font-family:Roboto, sans-serif;font-weight:400;' +
                         'text-transform:uppercase;cursor:pointer;outline:none;margin-top:3px;min-width:128px;' +
                         'border:none;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;' +
                         'color:rgba(0,0,0,0.3);' +
                         'background-color:#03a9f4;' +
                         'border-radius:2px;font-style:italic;-webkit-user-select:none;" disabled="">' +
            'Cancel' +
          '</button>' +
        '</div>';

      expect (html).to.equal (expectedHtml);
    });

    it ('renders to the DOM', () => {
      const mountNode = document.getElementById ('root');
      const store = Store.create ();
      const theme = Theme.create ('default');
      store.select ('b').set ('', 'Cancel');
      ReactDOM.render (<Button state={store.select ('b')} theme={theme}/>, mountNode);
      expect (mountNode.children).to.have.length (1);
      expect (mountNode.children[0]).to.have.property ('localName', 'div');
      expect (mountNode.children[0].children[0]).to.have.property ('localName', 'button');
    });
  });
});
