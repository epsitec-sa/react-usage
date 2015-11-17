'use strict';

class Node {
  constructor (id, generation) {
    if ((typeof id === 'string') &&
        (id.length > 0)) {
      this._id = id;
      this._generation = generation || 0;
    } else {
      throw new Error ('Node expects a valid id');
    }
  }

  get id () {
    return this._id;
  }

  get generation () {
    return this._generation;
  }

  getParentId () {
    const pos = this._id.lastIndexOf ('.');
    if (pos < 0) {
      return null;
    } else {
      return this._id.substring (0, pos);
    }
  }

  static withGeneration (node, generation) {
    return new Node (node._id, generation);
  }
}

module.exports = Node;
