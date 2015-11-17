'use strict';

import Node from './node.js';

class Store {
  constructor () {
    this._nodes = {};
    this._generation = 0;
  }

  setNode (node) {
    if (typeof node === 'string') {
      node = new Node (node);
    }
    if (!node || !node.id || !(node instanceof Node)) {
      throw new Error ('Invalid node');
    }

    if (node === this.getNode (node.id)) { // No mutation
      return node;
    } else {
      return this.updateTree (node, {store: this, generation: this.changeGeneration ()});
    }
  }

  getNode (id) {
    return this._nodes[id];
  }

  changeGeneration () {
    return ++this._generation;
  }

  get generation () {
    return this._generation;
  }

  get nodeCount () {
    return Object.keys (this._nodes).length;
  }

/* private methods */

  updateTree (node, mutation) {
    const parentId = Node.getParentId (node.id);
    if (parentId) {
      const parentNode = this.getNode (parentId) || new Node (parentId);
      this.updateTree (parentNode, mutation);
    }
    return this.patchNode (Node.with (node, mutation));
  }

  patchNode (node) {
    this._nodes[node.id] = node;
    return node;
  }

/* static methods */

  static create () {
    return new Store ();
  }
}

module.exports = Store;
