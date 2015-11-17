'use strict';

import Node from './node.js';

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

    this.generation++;
    this.nodes[node.id] = Node.withGeneration (node, this.generation);

    let parentId = node.getParentId ();

    while (parentId) {
      if (this.nodes[parentId]) {
        this.nodes[parentId] = Node.withGeneration (this.nodes[parentId], this.generation);
      } else {
        this.nodes[parentId] = new Node (parentId, this.generation);
      }
      parentId = this.nodes[parentId].getParentId ();
    }

    return this.nodes[node.id];
  }

  getNode (id) {
    return this.nodes[id];
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

module.exports = Store;
