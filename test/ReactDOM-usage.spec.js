'use strict';

import {expect, spy} from 'mai-chai';

import React from 'react';
import ReactDOM from 'react-dom';

import Hello from './components/stateless/Hello.js';
import Title from './components/Title.js';
import TitleWithShouldUpdate from './components/TitleWithShouldUpdate.js';

describe ('ReactDOM', () => {
  describe ('render()', () => {
    it ('inserts DOM node', () => {
      const mountNode = document.getElementById ('root');
      ReactDOM.render (<Hello id='x' name='Joe'/>, mountNode);
      expect (mountNode.children).to.have.length (1);
      expect (mountNode.children[0]).to.have.property ('id', 'x');
      expect (mountNode.children[0]).to.have.property ('localName', 'div');
      expect (mountNode.children[0]).to.have.property ('textContent', 'Hello Joe');
    });
    it ('returns null for stateless component', () => {
      const mountNode = document.getElementById ('root');
      const component = ReactDOM.render (<Hello id='x' name='Joe'/>, mountNode);
      expect (component).to.be.null ();
    });
    it ('returns component for statefull component', () => {
      const mountNode = document.getElementById ('root');
      const component = ReactDOM.render (<Title id='x' text='Welcome'/>, mountNode);
      expect (component).to.exist ();
      expect (component.props).to.have.property ('id', 'x');
      expect (component.props).to.have.property ('text', 'Welcome');
    });
    it ('returns component that can be accessed, for statefull component', () => {
      const mountNode = document.getElementById ('root');
      const component = ReactDOM.render (<Title id='x' text='Welcome'/>, mountNode);
      expect (component.getText).to.exist ();
      expect (component.getText ()).to.equal ('Text:Welcome');
    });
    it ('reuses same component', () => {
      const mountNode = document.getElementById ('root');
      const componentA = ReactDOM.render (<Title id='x' text='Welcome'/>, mountNode);
      const componentB = ReactDOM.render (<Title id='y' text='Bonjour'/>, mountNode);
      expect (componentA === componentB).to.be.true ();
    });
    it ('calls shouldComponentUpdate and on false does not update the DOM', () => {
      const mountNode = document.getElementById ('root');
      const componentA = ReactDOM.render (<TitleWithShouldUpdate id='x' immutable={true}/>, mountNode);
      const spyUpdate = spy.on (componentA, 'shouldComponentUpdate');
      const componentB = ReactDOM.render (<TitleWithShouldUpdate id='y'/>, mountNode);
      expect (componentA === componentB).to.be.true ();
      expect (spyUpdate).to.have.been.called.once ();
      expect (mountNode.children[0]).to.have.property ('id', 'x');
    });
    it ('calls shouldComponentUpdate and on true updates the DOM', () => {
      const mountNode = document.getElementById ('root');
      const componentA = ReactDOM.render (<TitleWithShouldUpdate id='x' immutable={false}/>, mountNode);
      const spyUpdate = spy.on (componentA, 'shouldComponentUpdate');
      const componentB = ReactDOM.render (<TitleWithShouldUpdate id='y'/>, mountNode);
      expect (componentA === componentB).to.be.true ();
      expect (spyUpdate).to.have.been.called.once ();
      expect (mountNode.children[0]).to.have.property ('id', 'y');
    });
    it ('does not reuse same component when switching components', () => {
      const mountNode = document.getElementById ('root');
      const componentA = ReactDOM.render (<Title id='x' text='Welcome'/>, mountNode);
      ReactDOM.render (<div>Other component</div>, mountNode);
      const componentB = ReactDOM.render (<Title id='y' text='Bonjour'/>, mountNode);
      expect (componentA === componentB).to.be.false ();
    });
    it ('does not reuse same component after unmount', () => {
      const mountNode = document.getElementById ('root');
      const componentA = ReactDOM.render (<Title id='x' text='Welcome'/>, mountNode);
      ReactDOM.unmountComponentAtNode (mountNode);
      const componentB = ReactDOM.render (<Title id='y' text='Bonjour'/>, mountNode);
      expect (componentA === componentB).to.be.false ();
    });
  });
  describe ('unmountComponentAtNode()', () => {
    it ('removes mounted component', () => {
      const mountNode = document.getElementById ('root');
      ReactDOM.render (<Title id='x' text='Welcome'/>, mountNode);
      expect (mountNode.children).to.have.length (1);
      ReactDOM.unmountComponentAtNode (mountNode);
      expect (mountNode.children).to.have.length (0);
    });
  });
  describe ('findDOMNode()', () => {
    it ('returns DOM element', () => {
      const mountNode = document.getElementById ('root');
      const component = ReactDOM.render (<Title id='x' text='Welcome'/>, mountNode);
      const domElement = ReactDOM.findDOMNode (component);
      expect (mountNode.children).to.have.length (1);
      expect (mountNode.children[0] === domElement).to.be.true ();
    });
  });
});
