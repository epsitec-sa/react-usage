'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOM from 'react-dom';

const StatelessHello = function (props) {
  StatelessHello.renderCount++;
  const {id} = props.s || {};
  return <div id={id}></div>;
};

describe ('React', () => {

  const mountNode = document.getElementById ('root');

  describe ('Stateless function component', () => {

    beforeEach (() => {
      StatelessHello.renderCount = 0;
    });

    afterEach (() =>  {
      ReactDOM.unmountComponentAtNode (mountNode);
    });

    it ('does not implement shouldComponentUpdate()', () => {
      expect (StatelessHello.prototype.shouldComponentUpdate).to.not.exist ();
    });

    it ('renders a simple div', () => {
      ReactDOM.render (<StatelessHello s={{id: 'x'}} />, mountNode);
      expect (mountNode.children).to.have.length (1);
      expect (mountNode.children[0]).to.have.property ('id', 'x');
      expect (mountNode.children[0]).to.have.property ('localName', 'div');
    });

    // React 0.14.2 does not handle stateless function components with
    // additional intelligence (I expected such a component to be treated
    // as being pure by default, but it is not the case).
    // See https://github.com/facebook/react/pull/4587#issuecomment-156719929

    it ('calls render() even if props do not change', () => {
      const settings = {id: 'x'};
      ReactDOM.render (<StatelessHello s={settings}/>, mountNode);
      expect (StatelessHello.renderCount).to.equal (1);
      ReactDOM.render (<StatelessHello s={settings}/>, mountNode);
      expect (StatelessHello.renderCount).to.equal (2);
    });
  });
});
