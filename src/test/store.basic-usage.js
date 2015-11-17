'use strict';

import {expect} from 'mai-chai';

// import React from 'react';

class Node {
  constructor (id) {
    this.id = id;
  }
}

class Store {
  constructor () {
    this.nodes = {};
    this.generation = 0;
  }

  setNode (node) {
    const currentNode = this.nodes[node.id];
    if (currentNode === node) {
      //  Happy path: nothing changed
      return;
    }
    this.nodes[node.id] = node;
    this.generation++;
  }

  getGeneration () {
    return this.generation;
  }

  getNodeCount () {
    return Object.keys (this.nodes).length;
  }

  static create () {
    return new Store ();
  }
}


describe ('Store', () => {
  describe ('basic operations', () => {

    describe ('Store.create()', () => {
      it ('creates an empty store', () => {
        const store = Store.create ();
        expect (store).to.exist ();
        expect (store.getNodeCount ()).to.equal (0);
        expect (store.getGeneration ()).to.equal (0);
      });
    });

    describe ('Store.setNode()', () => {
      it ('stores node and changes the generation', () => {
        const store = Store.create ();
        const node  = new Node ('a');
        store.setNode (node);
        expect (store.getNodeCount ()).to.equal (1);
        expect (store.getGeneration ()).to.equal (1);
      });
      it ('called twice with same node is idempotent', () => {
        const store = Store.create ();
        const node  = new Node ('a');
        store.setNode (node);
        expect (store.getNodeCount ()).to.equal (1);
        expect (store.getGeneration ()).to.equal (1);
        store.setNode (node);
        expect (store.getNodeCount ()).to.equal (1);
        expect (store.getGeneration ()).to.equal (1);
      });
    });
  });
});
