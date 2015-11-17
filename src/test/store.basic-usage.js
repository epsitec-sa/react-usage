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
      expect (Node.getParentId ('a')).to.be.null ();
    });

    it ('returns empty name for id=".a"', () => {
      expect (Node.getParentId ('.a')).to.equal ('');
    });

    it ('returns parent name for id="a.b.c"', () => {
      expect (Node.getParentId ('a.b.c')).to.equal ('a.b');
    });
  });

  describe ('with()', () => {
    it ('returns new instance of node on change', () => {
      const node1 = new Node ('a', null, 10);
      const node2 = Node.with (node1, {generation: 20});
      expect (node1.generation).to.equal (10);
      expect (node2.generation).to.equal (20);
    });
    it ('returns same instance of node on no-op', () => {
      const node1 = new Node ('a', 10);
      const node2 = Node.with (node1, {generation: 10});
      expect (node1 === node2);
    });
    it ('returns same instance of node on empty update', () => {
      const node1 = new Node ('a', 10);
      const node2 = Node.with (node1, {});
      expect (node1 === node2);
    });
  });
});

describe ('Store', () => {
  describe ('basic operations', () => {

    describe ('Store.create()', () => {
      it ('creates an empty store', () => {
        const store = Store.create ();
        expect (store).to.exist ();
        expect (store.nodeCount).to.equal (0);
        expect (store.generation).to.equal (0);
      });
    });

    describe ('Store.setNode()', () => {
      it ('stores node and changes the generation', () => {
        const store = Store.create ();
        const node1 = new Node ('a');
        const node2 = store.setNode (node1);
        expect (store.nodeCount).to.equal (1);
        expect (store.generation).to.equal (1);
        expect (node2.store).to.equal (store);
        expect (node2.generation).to.equal (1);
      });

      it ('checks its argument', () =>  {
        const store = Store.create ();
        expect (() => store.setNode ()).to.throw (Error);
        expect (() => store.setNode (null)).to.throw (Error);
        expect (() => store.setNode (123)).to.throw (Error);
        expect (() => store.setNode ('')).to.throw (Error);
      });

      it ('converts node id to node', () => {
        const store = Store.create ();
        const node1 = store.setNode ('a');
        const node2 = store.getNode ('a');
        expect (node1 === node2);
        expect (node1).to.have.property ('id', 'a');
      });

      it ('returns node as stored', () => {
        const store = Store.create ();
        const node1 = new Node ('a');
        const node2 = store.setNode (node1);
        expect (node1 !== node2);
        expect (node1.generation).to.equal (0);
        expect (node2.generation).to.equal (1);
        expect (node2.id).to.equal ('a');
      });

      it ('returns deep node as stored', () => {
        const store = Store.create ();
        const node1 = new Node ('a.b.c');
        const node2 = store.setNode (node1);
        expect (node1 !== node2);
        expect (node1.generation).to.equal (0);
        expect (node2.generation).to.equal (1);
        expect (node2.id).to.equal ('a.b.c');
      });

      it ('called twice with same node is idempotent', () => {
        const store = Store.create ();
        const node1 = new Node ('a');
        const node2 = store.setNode (node1);
        expect (store.nodeCount).to.equal (1);
        expect (store.generation).to.equal (1);
        expect (node1.generation).to.equal (0);
        expect (node2.generation).to.equal (1);
        store.setNode (node2);
        expect (store.nodeCount).to.equal (1);
        expect (store.generation).to.equal (1);
      });

      it ('creates missing nodes', () => {
        const store = Store.create ();
        const node  = new Node ('a.b.c');
        store.setNode (node);
        expect (store.nodeCount).to.equal (3);
      });

      it ('shares parent nodes', () => {
        const store = Store.create ();
        const node1 = new Node ('a.b.c');
        const node2 = new Node ('a.b.d');
        store.setNode (node1);
        store.setNode (node2);
        expect (store.nodeCount).to.equal (4);
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
