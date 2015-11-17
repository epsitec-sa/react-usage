'use strict';

import {expect} from 'mai-chai';

import Node from '../store/node.js';
import Store from '../store/store.js';

// import React from 'react';

describe ('Node', () => {
  describe ('new Node()', () => {
    it ('requires valid id string', () => {
      expect (() => new Node ()).to.throw (Error);
      expect (() => new Node (123)).to.throw (Error);
      expect (() => new Node ('')).to.throw (Error);
      expect (() => new Node ('a')).to.not.throw (Error);
    });

    it ('creates an empty node', () => {
      const node = new Node ('a');
      expect (node.id).to.equal ('a');
      expect (node.generation).to.equal (0);
    });
  });

  describe ('getParentId()', () => {
    it ('returns null if there is no parent (id="a")', () => {
      const node = new Node ('a');
      expect (node.getParentId ()).to.be.null ();
    });

    it ('returns empty name for id=".a"', () => {
      const node = new Node ('.a');
      expect (node.getParentId ()).to.equal ('');
    });

    it ('returns parent name for id="a.b.c"', () => {
      const node = new Node ('a.b.c');
      expect (node.getParentId ()).to.equal ('a.b');
    });
  });

  describe ('withGeneration()', () => {
    it ('returns new instance of node', () => {
      const node1 = new Node ('a', 10);
      const node2 = Node.withGeneration (node1, 20);
      expect (node1.generation).to.equal (10);
      expect (node2.generation).to.equal (20);
    });
  });
});

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
        const node1 = new Node ('a');
        const node2 = store.setNode (node1);
        expect (store.getNodeCount ()).to.equal (1);
        expect (store.getGeneration ()).to.equal (1);
        expect (node1.generation).to.equal (0);
        expect (node2.generation).to.equal (1);
        store.setNode (node2);
        expect (store.getNodeCount ()).to.equal (1);
        expect (store.getGeneration ()).to.equal (1);
      });

      it ('creates missing nodes', () => {
        const store = Store.create ();
        const node  = new Node ('a.b.c');
        store.setNode (node);
        expect (store.getNodeCount ()).to.equal (3);
      });

      it ('shares parent nodes', () => {
        const store = Store.create ();
        const node1 = new Node ('a.b.c');
        const node2 = new Node ('a.b.d');
        store.setNode (node1);
        store.setNode (node2);
        expect (store.getNodeCount ()).to.equal (4);
      });

      it ('updates generation of parent nodes', () => {
        const store = Store.create ();
        const node1 = new Node ('a');
        const node2 = new Node ('a.b');
        const node3 = new Node ('a.c');
        store.setNode (node1);
        expect (store.getNode ('a').generation).to.equal (1);
        expect (store.getNode ('a.b')).to.not.exist ();
        store.setNode (node2);
        expect (store.getNode ('a').generation).to.equal (2);
        expect (store.getNode ('a.b').generation).to.equal (2);
        store.setNode (node3);
        expect (store.getNode ('a').generation).to.equal (3);
        expect (store.getNode ('a.b').generation).to.equal (2);
        expect (store.getNode ('a.c').generation).to.equal (3);
      });
    });

    it ('produces new parent nodes: existing nodes are not mutated, they are replaced', () => {
      const store = Store.create ();
      const node1 = new Node ('a');
      const node2 = new Node ('a.b');
      const node3 = new Node ('a.c');

      const nodeA1 = store.setNode (node1);
      const nodeA2 = store.getNode ('a');

      expect (nodeA1 === nodeA2);
      expect (nodeA1 !== node1);
      expect (nodeA2.generation).to.equal (1);

      store.setNode (node2);

      const nodeA3 = store.getNode ('a');

      expect (nodeA1 === nodeA2);
      expect (nodeA1 !== nodeA3);
      expect (nodeA2.generation).to.equal (1);
      expect (nodeA3.generation).to.equal (2);

      store.setNode (node3);

      const nodeA4 = store.getNode ('a');

      expect (nodeA2.generation).to.equal (1);
      expect (nodeA3.generation).to.equal (2);
      expect (nodeA4.generation).to.equal (3);
    });

  });
});
