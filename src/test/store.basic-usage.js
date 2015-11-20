'use strict';

import {expect} from 'mai-chai';

import Node from '../store/node.js';
import Store from '../store/store.js';

describe ('Store', () => {
  describe ('basic operations', () => {

    describe ('constructor()', () => {
      it ('cannot be called directly', () => {
        expect (() => new Store ()).to.throw (Error);
        expect (() => new Store ('x')).to.throw (Error);
        expect (() => new Store ('x', {})).to.throw (Error);
      });
    });

    describe ('Store.create()', () => {
      it ('creates an empty store', () => {
        const store = Store.create ('x');
        expect (store).to.exist ();
        expect (store.nodeCount).to.equal (0);
        expect (store.generation).to.equal (0);
        expect (store.id).to.equal ('x');
      });

      it ('creates a store with an empty root node', () => {
        const store = Store.create ();
        expect (store.root).to.exist ();
        expect (store.root.store).to.equal (store);
        expect (store.root.id).to.equal ('');
        expect (store.root).to.equal (store.getNode (''));
        expect (store.root).to.equal (store.findNode (''));
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
        const node2 = store.findNode ('a');
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
        expect (store.findNode ('a').generation).to.equal (1);
        expect (store.findNode ('a.b')).to.not.exist ();
        store.setNode (node2);
        expect (store.findNode ('a').generation).to.equal (2);
        expect (store.findNode ('a.b').generation).to.equal (2);
        store.setNode (node3);
        expect (store.findNode ('a').generation).to.equal (3);
        expect (store.findNode ('a.b').generation).to.equal (2);
        expect (store.findNode ('a.c').generation).to.equal (3);
      });

      it ('produces new parent nodes: existing nodes are not mutated, they are replaced', () => {
        const store = Store.create ();
        const node1 = new Node ('a');
        const node2 = new Node ('a.b');
        const node3 = new Node ('a.c');

        const nodeA1 = store.setNode (node1);
        const nodeA2 = store.findNode ('a');

        expect (nodeA1 === nodeA2);
        expect (nodeA1 !== node1);
        expect (nodeA2.generation).to.equal (1);

        store.setNode (node2);

        const nodeA3 = store.findNode ('a');

        expect (nodeA1 === nodeA2);
        expect (nodeA1 !== nodeA3);
        expect (nodeA2.generation).to.equal (1);
        expect (nodeA3.generation).to.equal (2);

        store.setNode (node3);

        const nodeA4 = store.findNode ('a');

        expect (nodeA2.generation).to.equal (1);
        expect (nodeA3.generation).to.equal (2);
        expect (nodeA4.generation).to.equal (3);
      });
    });

    describe ('findNode()', () => {
      it ('throws for invalid node ids', () => {
        const store = Store.create ();
        expect (() => store.findNode ()).to.throw (Error);
        expect (() => store.findNode (1)).to.throw (Error);
      });

      it ('returns undefined for missing nodes', () => {
        const store = Store.create ();
        expect (store.findNode ('x')).to.be.undefined ();
      });
    });

    describe ('getNode()', () => {
      it ('throws for invalid node ids', () => {
        const store = Store.create ();
        expect (() => store.getNode ()).to.throw (Error);
        expect (() => store.getNode (1)).to.throw (Error);
      });

      it ('creates missing node', () => {
        const store = Store.create ();
        expect (store.getNode ('x')).to.exist ();
        expect (store.findNode ('x')).to.exist ();
      });

      it ('creates missing nodes up to root', () => {
        const store = Store.create ();
        expect (store.getNode ('a.b.c')).to.exist ();
        expect (store.findNode ('a')).to.exist ();
        expect (store.findNode ('a.b')).to.exist ();
        expect (store.findNode ('a.b.c')).to.exist ();
      });
    });

    describe ('node.getChild()', () => {
      it ('creates missing child node', () => {
        const store = Store.create ();
        const node1 = store.getNode ('a');
        const node2 = node1.getChild ('b');
        expect (store.findNode ('a')).to.exist ();
        expect (store.findNode ('a.b')).to.exist ();
        expect (store.findNode ('a')).to.not.equal (node1);
        expect (store.findNode ('a.b')).to.equal (node2);
      });

      it ('returns existing child node', () => {
        const store = Store.create ();
        const node1 = store.getNode ('a.b');
        const node2 = store.getNode ('a');
        expect (node2.getChild ('b')).to.equal (node1);
      });

      it ('works from root node', () => {
        const store = Store.create ();
        expect (store.root).to.exist ();
        expect (store.root.getChild ('a')).to.exist ();
        expect (store.findNode ('a')).to.exist ();
      });
    });
  });
});
