'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import Activity from '../store/activity.js';
import Node from '../store/node.js';

import {ActivityView} from '../components/stateless/ActivityView.js';
import {Workspace} from '../components/stateless/Workspace.js';

const Hello = props => <span>{'Text:' + props.node.getValue ('text')}</span>;

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

      Node.withValue (act1.getNode ('activity'), 'text', 'Hello');
      Node.withValue (act2.getNode ('activity'), 'text', 'Bye');

      const html = ReactDOMServer.renderToStaticMarkup (doc);

      expect (html).to.equal ('<div><span>Text:Hello</span><span>Text:Bye</span></div>');
    });
  });
});
