'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOM from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';

function pureRenderDecorator (component) {
  component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    return shallowCompare (this, nextProps, nextState);
  };
}

class SimpleHello extends React.Component {
  render () {
    SimpleHello.renderCount++;
    const {id} = this.props.s || {};
    return <div id={id}></div>;
  }
}

pureRenderDecorator (SimpleHello);

describe ('React', () => {

  const mountNode = document.getElementById ('root');

  describe ('Simple pure component', () => {

    beforeEach (() => {
      SimpleHello.renderCount = 0;
    });

    afterEach (() =>  {
      ReactDOM.unmountComponentAtNode (mountNode);
    });

    it ('implements shouldComponentUpdate()', () => {
      expect (SimpleHello.prototype.shouldComponentUpdate).to.exist ();
    });

    it ('renders a simple div without props', () => {
      ReactDOM.render (<SimpleHello />, mountNode);
      expect (mountNode.children).to.have.length (1);
      expect (mountNode.children[0]).to.have.property ('id', '');
      expect (mountNode.children[0]).to.have.property ('localName', 'div');
    });

    it ('renders a simple div with props', () => {
      ReactDOM.render (<SimpleHello s={{id: 'x'}} />, mountNode);
      expect (mountNode.children).to.have.length (1);
      expect (mountNode.children[0]).to.have.property ('id', 'x');
      expect (mountNode.children[0]).to.have.property ('localName', 'div');
    });

    it ('calls render() once if props do not change', () => {
      const settings = {id: 'x'};
      ReactDOM.render (<SimpleHello s={settings}/>, mountNode);
      expect (SimpleHello.renderCount).to.equal (1);
      ReactDOM.render (<SimpleHello s={settings}/>, mountNode);
      expect (SimpleHello.renderCount).to.equal (1);
    });

    it ('calls render() twice if props do change', () => {
      const settings1 = {id: 'x'};
      const settings2 = {id: 'y'};
      ReactDOM.render (<SimpleHello s={settings1}/>, mountNode);
      expect (SimpleHello.renderCount).to.equal (1);
      expect (mountNode.children[0]).to.have.property ('id', 'x');
      ReactDOM.render (<SimpleHello s={settings2}/>, mountNode);
      expect (SimpleHello.renderCount).to.equal (2);
      expect (mountNode.children[0]).to.have.property ('id', 'y');
    });

    it ('calls render() twice if props have same contents, but other instance', () => {
      const settings1 = {id: 'x'};
      const settings2 = {id: 'x'};
      ReactDOM.render (<SimpleHello s={settings1}/>, mountNode);
      expect (SimpleHello.renderCount).to.equal (1);
      expect (mountNode.children[0]).to.have.property ('id', 'x');
      ReactDOM.render (<SimpleHello s={settings2}/>, mountNode);
      expect (SimpleHello.renderCount).to.equal (2);
      expect (mountNode.children[0]).to.have.property ('id', 'x');
    });
  });
});
