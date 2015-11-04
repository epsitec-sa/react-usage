'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import ReactTestUtils from 'react-addons-test-utils';

import CheckboxWithLabel from './components/CheckboxWithLabel.js';

const {isElement, isElementOfType, isDOMComponent,
  renderIntoDocument,
  findRenderedDOMComponentWithTag,
  Simulate} = ReactTestUtils;


const Hello = function (props) {
  return <div id={props.id}>Hello {props.name}</div>;
};

const Title = React.createClass ({
  getText: function getText () {
    return 'Text:' + this.props.text;
  },
  render: function render () {
    return <div id={this.props.id}>{this.props.text}</div>;
  }
});


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
  });
});

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
});

describe ('ReactElement keys and values', () => {
  it ('verifies DOM Element', () => {
    const domElement = <div id='x'/>;
    expect (domElement.type).to.equal ('div');
    expect (domElement.props.id).to.equal ('x');
    expect (domElement.key).to.be.null ();
    expect (domElement.ref).to.be.null ();
  });
  it ('verifies Component Element', () => {
    const compElement = <Title id='x'/>;
    expect (compElement.type).to.equal (Title);
    expect (compElement.props).to.have.property ('id', 'x');
    expect (compElement).to.have.property ('key', null);
    expect (compElement).to.have.property ('ref', null);
  });
});

describe ('CheckboxWithLabel', () => {
  it ('changes the text after click', () => {
    // Render a checkbox with label in the document
    const checkbox = renderIntoDocument (
      <CheckboxWithLabel labelOn='On' labelOff='Off' />
    );

    const checkboxNode = ReactDOM.findDOMNode (checkbox);

    // Verify that it's Off by default
    expect (checkboxNode.textContent).to.equal ('Off');

    // Simulate a click and verify that it is now On
    Simulate.change (
      findRenderedDOMComponentWithTag (checkbox, 'input')
    );
    expect (checkboxNode.textContent).to.equal ('On');
  });
});


const {createRenderer} = ReactTestUtils;

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
