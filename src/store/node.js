'use strict';

class Node {
  constructor (id, store, generation, values) {
    if ((typeof id !== 'string') || (id.length === 0)) {
      throw new Error ('Node expects a valid id');
    }
    this._id = id;
    this._store = store;
    this._generation = generation || 0;
    this._values = values || {};
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

  getValue (id) {
    console.log (id);
    console.log (this._values[id]);
    return this._values[id];
  }

  setValue (id, value) {
    if (this._values[id] === value) {
      return this;
    } else {
      const mutation = {values: {...this._values} };
      mutation.values[id] = value;
      console.log (mutation);
      const node = Node.with (this, mutation);
      if (this._store) {
        return this._store.setNode (node);
      } else {
        return node;
      }
    }
  }

  getChild (id) {
    return this._store.getNode (Node.getChildId (this._id, id));
  }

  static getChildId (parentId, id) {
    if (parentId) {
      return parentId + '.' + id;
    } else {
      return id;
    }
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
    const generation = mutation.generation || node._generation;
    const store = mutation.store || node._store;
    const values = mutation.values || node._values;
    if ((node._generation === generation) &&
        (node._store === store) &&
        (node._values === values)) {
      return node;
    } else {
      return new Node (node._id, store, generation, values);
    }
  }
}

module.exports = Node;
