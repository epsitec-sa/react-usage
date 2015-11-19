'use strict';

import Node from './node.js';
import Activities from './activities.js';

/******************************************************************************/

function patchNode (store, node) {
  store._nodes[node.id] = node;
  return node;
}

function changeGeneration (store) {
  return ++store._generation;
}

function updateTree (store, node, mutation) {
  const parentId = Node.getParentId (node.id);
  if (parentId) {
    const parentNode = store.findNode (parentId) || new Node (parentId);
    updateTree (store, parentNode, mutation);
  }
  return patchNode (store, Node.with (node, mutation));
}

/******************************************************************************/

class Store {
  constructor () {
    this._nodes = {};
    this._generation = 0;
    this._rootNode = new Node ('', this);
  }

  getNode (id) {
    return this.findNode (id) || this.setNode (new Node (id));
  }

  setNode (node) {
    if (typeof node === 'string') {
      node = new Node (node);
    }
    if (!node || !node.id || !(node instanceof Node)) {
      throw new Error ('Invalid node');
    }

    if (node === this.findNode (node.id)) { // No mutation
      return node;
    } else {
      const mutation = {
        store: this,
        generation: changeGeneration (this)
      };
      return updateTree (this, node, mutation);
    }
  }

  findNode (id) {
    if (typeof id !== 'string') {
      throw new Error ('Invalid node id');
    }
    if (id.length === 0) {
      return this._rootNode;
    } else {
      return this._nodes[id];
    }
  }

  get generation () {
    return this._generation;
  }

  get root () {
    return this._rootNode;
  }

  get nodeCount () {
    return Object.keys (this._nodes).length;
  }

/* static methods */

  static create () {
    return new Store ();
  }

  static link (props, id) {
    const {node} = props;
    return {
      node: node.getChild (id)
    };
  }

  static read (props, id) {
    const {node} = props;
    return node.getValue (id);
  }

  static activity (id) {
    return Activities.get (id);
  }
}

module.exports = Store;
