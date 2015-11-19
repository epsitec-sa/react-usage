'use strict';

import {expect} from 'mai-chai';

import Node from '../store/node.js';

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

  describe ('has a default value', () => {
    const node1 = new Node ('a');
    const node2 = Node.with (node1, {values: {'': 1}});

    expect (node1.value).to.be.undefined ();
    expect (node2.value).to.equal (1);
    expect (node2.getValue ('')).to.equal (1);
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
      const node1 = new Node ('a', null, 10);
      const node2 = Node.with (node1, {generation: 10});
      expect (node1 === node2).to.be.true ();
    });

    it ('returns same instance of node on empty update', () => {
      const node1 = new Node ('a', 10);
      const node2 = Node.with (node1, {});
      expect (node1 === node2);
    });
  });

  describe ('Node.withValue()', () => {
    it ('produces a new node when value changes', () => {
      const node1 = new Node ('a');
      const node2 = Node.withValue (node1, 'x', 1);
      const node3 = Node.withValue (node2, 'x', 2);
      const node4 = Node.withValue (node3, 'x', 2);
      const node5 = Node.withValue (node4, 'x', 1);
      expect (node1.getValue ('x')).to.be.undefined ();
      expect (node2.getValue ('x')).to.equal (1);
      expect (node3.getValue ('x')).to.equal (2);
      expect (node4.getValue ('x')).to.equal (2);
      expect (node5.getValue ('x')).to.equal (1);
      expect (node1).to.not.equal (node2);
      expect (node2).to.not.equal (node3);
      expect (node3).to.equal (node4);
      expect (node4).to.not.equal (node5);
      expect (node1).to.not.equal (node5);
    });
  });

  describe ('Node.withValues()', () => {
    it ('works with no values', () => {
      const node1 = new Node ('a');
      const node2 = Node.withValues (node1);
      expect (node1).to.equal (node2);
    });

    it ('works with multiple values', () => {
      const node1 = new Node ('a');
      const node2 = Node.withValues (node1, 'x', 1, 'y', 2);
      expect (node1).to.not.equal (node2);
      expect (node2.getValue ('x')).to.equal (1);
      expect (node2.getValue ('y')).to.equal (2);
    });
  });
});
