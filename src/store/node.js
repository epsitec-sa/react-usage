'use strict';

const emptyValues = {};

class Node {
  constructor (id, store, generation, values) {
    if ((typeof id !== 'string') ||
        (!store && (id.length === 0)) ||
        (store && store._rootNode && (id.length === 0))) {
      throw new Error ('Node expects a valid id');
    }
    this._id = id;
    this._store = store;
    this._generation = generation || 0;
    this._values = values || emptyValues;
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

  get value () {
    return this.getValue ('');
  }

  getValue (id) {
    return this._values[id];
  }

  setValue (id, value) {
    if (this._values[id] === value) {
      return this;
    } else {
      const node = Node.with (this, this.getValueMutation (id, value));
      if (this._store) {
        return this._store.setNode (node);
      } else {
        return node;
      }
    }
  }

  getValueMutation (id, value) {
    const copy = {};
    Object.assign (copy, this._values);
    copy[id] = value;
    return {values: copy};
  }

  getChild (id) {
    return this._store.getNode (Node.join (this._id, id));
  }

  static join (ids) {
    if (Array.isArray (ids)) {
      return ids.join ('.');
    }
    const args = new Array (arguments.length);
    for (var i = 0; i < args.length; ++i) {
      args[i] = arguments[i];
    }
    return args.join ('.');
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
