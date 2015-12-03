'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import {Activity} from 'electrum-store';

import {ActivityView} from '../components/stateless/ActivityView.js';
import {Workspace} from '../components/stateless/Workspace.js';

const Hello = props => <span>{'Text:' + props.state.get ('text')}</span>;

describe ('Activity components', () => {
  describe ('Workspace with ActivityView', () => {

    afterEach (() => {
      Activity.clear ();
    });

    it ('creates expected elements', () => {
      const act1 = Activity.create ('a', Hello);
      const act2 = Activity.create ('b', Hello);
      const doc =
        <Workspace>
          <ActivityView act={Activity.get ('a')}/>
          <ActivityView act={Activity.get ('b')}/>
        </Workspace>;

      act1.select ('activity').set ('text', 'Hello');
      act2.select ('activity').set ('text', 'Bye');

      const html = ReactDOMServer.renderToStaticMarkup (doc);

      expect (html).to.equal ('<div><span>Text:Hello</span><span>Text:Bye</span></div>');
    });
  });
});
