'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOM from 'react-dom';
import shallowCompare from 'react-addons-shallow-compare';

import Title from '../components/Title.js';

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

    it ('calls constructor() once if props do not change', () => {
      Title.clear ();
      ReactDOM.render (<Title text='a'/>, mountNode);
      expect (Title.getConstructorCount ()).to.equal (1);
      ReactDOM.render (<Title text='a'/>, mountNode);
      expect (Title.getConstructorCount ()).to.equal (1);
    });

    it ('calls constructor() once if props change', () => {
      Title.clear ();
      ReactDOM.render (<Title text='a'/>, mountNode);
      expect (Title.getConstructorCount ()).to.equal (1);
      ReactDOM.render (<Title text='b'/>, mountNode);
      expect (Title.getConstructorCount ()).to.equal (1);
    });

    it ('calls render() once if props do not change', () => {
      Title.clear ();
      ReactDOM.render (<Title text='a'/>, mountNode);
      expect (Title.getRenderCount ()).to.equal (1);
      ReactDOM.render (<Title text='a'/>, mountNode);
      expect (Title.getRenderCount ()).to.equal (1);
    });

    it ('calls render() twice if props change', () => {
      Title.clear ();
      ReactDOM.render (<Title text='a'/>, mountNode);
      expect (Title.getRenderCount ()).to.equal (1);
      ReactDOM.render (<Title text='b'/>, mountNode);
      expect (Title.getRenderCount ()).to.equal (2);
    });

    it ('changes Title\'s instance props if props change, but keeps same Title instance', () => {
      Title.clear ();
      ReactDOM.render (<Title text='a'/>, mountNode);
      ReactDOM.render (<Title text='b'/>, mountNode);
      const constrs = Title.getConstructorTitles ();
      const renders = Title.getRenderTitles ();
      // Same component instance:
      expect (constrs[0].obj).to.equal (renders[0].obj);
      expect (constrs[0].obj).to.equal (renders[1].obj);
      // Initial props passed to constructor match first render props:
      expect (constrs[0].props).to.equal (renders[0].props);
      // Current props changed after second render:
      expect (constrs[0].props).to.not.equal (renders[1].props);
      expect (constrs[0].obj.props).to.equal (renders[1].props);
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
