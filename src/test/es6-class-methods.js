'use strict';

import {expect} from 'mai-chai';

function getMethodNames (instance) {
  let names = [];
  for (let name of Object.getOwnPropertyNames (Object.getPrototypeOf (instance))) {
    let method = instance[name];
    if (method instanceof Function && name !== 'constructor') {
      names.push (name);
    }
  }
  return names;
}

function inject (client, instance) {
  for (let name of getMethodNames (instance)) {
    client[name] = instance[name].bind (instance);
  }
}

class Foo {
  constructor (name) {
    this._name = name;
  }
  get name () {
    return this._name;
  }
  foo () {
    return `foo/${this.name}`;
  }
  bar (x) {
    return `bar/${x}/${this.name}`;
  }
}

describe ('ES6 class and methods', () => {
  describe ('getMethodNames()', () => {
    it ('finds all instance methods', () => {
      const foo = new Foo ('a');
      const names = getMethodNames (foo);
      expect (names).to.deep.equal (['foo', 'bar']);
    });
  });
  describe ('inject()', () => {
    it ('injects methods as functions', () => {
      let proxy = {};
      let instance = new Foo ('a');
      inject (proxy, instance);
      expect (proxy).to.have.property ('foo');
      expect (proxy).to.have.property ('bar');
      expect (proxy.foo ()).to.equal ('foo/a');
      expect (proxy.bar ('x')).to.equal ('bar/x/a');
    });
  });
});
