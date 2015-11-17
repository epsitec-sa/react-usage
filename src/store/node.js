'use strict';

class Node {
  constructor (id, store, generation) {
    if ((typeof id !== 'string') || (id.length === 0)) {
      throw new Error ('Node expects a valid id');
    }
    this._id = id;
    this._store = store;
    this._generation = generation || 0;
  }

  get id () {
    return this._id;
  }

  get store () {
    return this._store;
  }

  get generation () {
    return this._generation;
  }

  static getParentId (id) {
    const pos = id.lastIndexOf ('.');
    if (pos < 0) {
      return null;
    } else {
      return id.substring (0, pos);
    }
  }

  static with (node, mutation) {
    const generation = mutation.generation || node.generation;
    const store = mutation.store || node.store;
    if ((node.generation === generation) &&
        (node.store === store)) {
      return node;
    } else {
      return new Node (node._id, store, generation);
    }
  }
}

module.exports = Node;
