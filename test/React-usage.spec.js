'use strict';

import {expect} from 'mai-chai';

import React from 'react';

import Hello from './components/stateless/Hello.js';
import Title from './components/Title.js';


describe ('React', () => {
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
    it ('verifies stateless Component Element', () => {
      const compElement = <Hello id='x'/>;
      expect (compElement.type).to.equal (Hello);
      expect (compElement.props).to.have.property ('id', 'x');
      expect (compElement).to.have.property ('key', null);
      expect (compElement).to.have.property ('ref', null);
    });
  });
});
