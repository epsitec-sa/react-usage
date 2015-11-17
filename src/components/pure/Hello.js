'use strict';

import React from 'react';

import shallowCompare from 'react-addons-shallow-compare';

function pureRenderDecorator (component) {
  component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    return shallowCompare (this, nextProps, nextState);
  };
}

export class Hello extends React.Component {
  render () {
    Hello.incCounter ();
    const {id} = this.props.s || {};
    return <div id={id}></div>;
  }
  static incCounter () {
     this.counter = this.getCounter () + 1;
   }
  static getCounter () {
     return this.counter || 0;
   }
 }

pureRenderDecorator (Hello);
