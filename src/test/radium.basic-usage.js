'use strict';

import {expect} from 'mai-chai';

import Radium from 'radium';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

const styles = {base: {fontSize: 16, background: 'blue'}};

class ButtonAsClass extends React.Component {
  shouldComponentUpdate () {
    return false;
  }
  render () {
    return (
      <button id='x' style={[styles.base]}>
        {this.foo ()}
      </button>
    );
  }
  foo () {
    return this.props.t;
  }
}

const RadiumButtonAsClass = Radium (ButtonAsClass);

function ButtonAsFunc () {
  return <div/>;
}

const RadiumButtonAsFunc = Radium (ButtonAsFunc);

describe ('Radium', () => {
  describe ('Radium(Component)', () => {
    it ('adds displayName property', () => {
      expect (RadiumButtonAsClass.displayName).to.equal ('ButtonAsClass');
    });

    it ('alters render() method', () => {
      expect (ButtonAsClass.prototype.render !==
        RadiumButtonAsClass.prototype.render).to.be.true ();
    });

    it ('adds componentWillUnmount() method', () => {
      expect (ButtonAsClass.prototype.componentWillUnmount).to.not.exist ();
      expect (RadiumButtonAsClass.prototype.componentWillUnmount).to.exist ();
    });

    it ('does not alter shouldComponentUpdate() method', () => {
      expect (ButtonAsClass.prototype.shouldComponentUpdate ===
        RadiumButtonAsClass.prototype.shouldComponentUpdate).to.be.true ();
    });

    it ('does not alter other methods', () => {
      expect (ButtonAsClass.prototype.foo ===
        RadiumButtonAsClass.prototype.foo).to.be.true ();
    });
  });

  describe ('using style prop', () => {
    it ('does not expand styles on normal component', () => {
      const mountNode = document.getElementById ('root');
      ReactDOM.render (<ButtonAsClass t='foo'/>, mountNode);
      expect (mountNode.children[0]._style._values).to.deep.equal ({});
      expect (mountNode.children[0].textContent).to.equal ('foo');
      ReactDOM.render (<ButtonAsClass t='bar'/>, mountNode);
      expect (mountNode.children[0].textContent).to.equal ('foo');
    });

    it ('expands styles on wrapped component', () => {
      const mountNode = document.getElementById ('root');
      ReactDOM.render (<RadiumButtonAsClass t='foo'/>, mountNode);
      const expectedStyle = {
        'font-size': '16px',
        'background-color': 'blue',
        background: 'blue'
      };
      const expectedHtml = '<button id="x" style="font-size:16px;background:blue;">foo</button>';
      expect (mountNode.children[0]._style._values).to.deep.equal (expectedStyle);
      expect (ReactDOMServer.renderToStaticMarkup (<RadiumButtonAsClass t='foo'/>)).to.equal (expectedHtml);
    });
  });
  describe ('Radium(function)', () => {
    it ('adds displayName property', () => {
      expect (RadiumButtonAsFunc.displayName).to.equal ('ButtonAsFunc');
    });

    it ('adds render() method', () => {
      expect (ButtonAsFunc.prototype.render).to.not.exist ();
      expect (RadiumButtonAsFunc.prototype.render).to.exist ();
    });
  });
});
