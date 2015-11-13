'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';

import CheckboxWithLabel from '../components/CheckboxWithLabel.js';
import Hello from '../components/stateless/Hello.js';
import Title from '../components/Title.js';

const {createRenderer, isElement, isElementOfType, isDOMComponent,
  renderIntoDocument, findRenderedDOMComponentWithTag, Simulate} = ReactTestUtils;

describe ('ReactTestUtils', () => {
  it ('verifies isElement', () => {
    expect (isElement (<Hello id='x' name='Joe'/>)).to.be.true ();
    expect (isElement (<Title id='x' text='Welcome'/>)).to.be.true ();
    expect (isElement (<CheckboxWithLabel/>)).to.be.true ();
  });
  it ('verifies isElementOfType', () => {
    expect (isElementOfType (<CheckboxWithLabel/>, CheckboxWithLabel)).to.be.true ();
    expect (isElementOfType (<Hello/>, Hello)).to.be.true ();
  });
  it ('verifies isDOMComponent', () => {
    const mountNode = document.getElementById ('root');
    const componentA = ReactDOM.render (<Title id='x'/>, mountNode);
    const componentB = ReactDOM.render (<div id='y'/>, mountNode);
    expect (componentA).to.exist ();
    expect (componentB).to.exist ();
    expect (isDOMComponent (componentA)).to.be.false ();
    expect (isDOMComponent (componentB)).to.be.true ();
  });
  describe ('Simulate.change()', () => {
    it ('triggers a component update', () => {
      const checkbox = renderIntoDocument (
        <CheckboxWithLabel labelOn='On' labelOff='Off' />
      );

      const checkboxNode = ReactDOM.findDOMNode (checkbox);

      // Verify that it's Off by default
      expect (checkboxNode).to.have.property ('textContent', 'Off');

      // Simulate a click and verify that it is now On
      Simulate.change (
        findRenderedDOMComponentWithTag (checkbox, 'input')
      );
      expect (checkboxNode).to.have.property ('textContent', 'On');
    });
  });
});


describe ('React Component', () => {
  it ('renders DOM <div>', () => {
    const shallowRenderer = createRenderer ();
    const reactElement = <CheckboxWithLabel labelOn='A' labelOff='B'/>;
    shallowRenderer.render (reactElement);
    const reactComponent = shallowRenderer.getRenderOutput ();
    expect (reactComponent.type).to.equal ('label');
  });

  it ('produces DOM nodes', () => {
    const reactElement = <Title/>;
    const component = renderIntoDocument (reactElement);
    const div = findRenderedDOMComponentWithTag (component, 'div');
    // const divNode = findDOMNode (div);
    // expect (divNode).to.exist ();
  });
});
