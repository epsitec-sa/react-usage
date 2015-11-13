'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOM from 'react-dom';

import Hello from '../components/stateless/Hello.js';
import Title from '../components/Title.js';
import reactElementToJSXString from 'react-element-to-jsx-string';


describe ('React', () => {
  describe ('ReactElement', () => {
    it ('contains type/id/key/ref properties for DOM element', () => {
      const domElement = <div id='x'/>;
      expect (domElement.type).to.equal ('div');
      expect (domElement.props).to.have.property ('id', 'x');
      expect (domElement).to.have.property ('key', null);
      expect (domElement).to.have.property ('ref', null);
      expect (domElement).to.equalJSX (<div id='x'/>);
      expect (reactElementToJSXString (domElement)).to.equal ('<div id="x" />');
    });

    it ('contains type/id/key/ref properties for Component element', () => {
      const compElement = <Title id='x'/>;
      expect (compElement.type).to.equal (Title);
      expect (compElement.props).to.have.property ('id', 'x');
      expect (compElement).to.have.property ('key', null);
      expect (compElement).to.have.property ('ref', null);
      expect (compElement).to.equalJSX (<Title id='x'/>);
      expect (reactElementToJSXString (compElement)).to.equal ('<Title id="x" />');
    });

    it ('contains type/id/key/ref properties for stateless Component element', () => {
      const compElement = <Hello id='x'/>;
      expect (compElement.type).to.equal (Hello);
      expect (compElement.props).to.have.property ('id', 'x');
      expect (compElement).to.have.property ('key', null);
      expect (compElement).to.have.property ('ref', null);
      expect (compElement).to.equalJSX (<Hello id='x'/>);
      expect (reactElementToJSXString (compElement)).to.equal ('<Hello id="x" />');
    });

    describe ('isValidElement()', () => {
      it ('succeeds for DOM element', () => {
        const domElement = <div id='x'/>;
        expect (React.isValidElement (domElement)).to.be.true ();
      });

      it ('succeeds for Component element', () => {
        const domElement = <Title id='x'/>;
        expect (React.isValidElement (domElement)).to.be.true ();
      });

      it ('succeeds for stateless Component element', () => {
        const domElement = <Hello id='x'/>;
        expect (React.isValidElement (domElement)).to.be.true ();
      });
    });
  });

  describe ('Children', () => {
    describe ('map()', () => {
      it ('traverses the children list', () => {
        class Foo extends React.Component {
          render () {
            const array = React.Children.map (this.props.children, x => x.props.id);
            expect (React.Children.count (this.props.children)).to.equal (2);
            expect (array).to.have.length (2);
            expect (array[0]).to.equal ('x');
            expect (array[1]).to.equal ('y');
            return <div/>;
          }
        }

        const mountNode = document.getElementById ('root');
        ReactDOM.render (<Foo><div id='x'/><div id='y'/></Foo>, mountNode);
      });

      it ('is idempotent for null or undefined children list', () => {
        expect (React.Children.map (undefined)).to.be.undefined ();
        expect (React.Children.map (null)).to.be.null ();
      });
    });
  });
});
