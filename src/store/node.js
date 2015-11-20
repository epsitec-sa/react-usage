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

  getChild (id) {
    if (this._id.length === 0) {
      return this._store.getNode (id);
    } else {
      return this._store.getNode (Node.join (this._id, id));
    }
  }

  static join (ids) {
    let args;
    if (Array.isArray (ids)) {
      args = ids;
    } else {
      args = new Array (arguments.length);
      for (let i = 0; i < args.length; ++i) {
        args[i] = arguments[i];
      }
    }

    for (let i = 0; i < args.length; ++i) {
      const arg = args[i];
      if ((typeof arg !== 'string') || arg.length === 0) {
        throw new Error ('Node.join expects non-empty string ids');
      }
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

  static withValue (node, id, value) {
    if (node._values[id] === value) {
      return node;
    } else {
      return Node.withValues (node, id, value);
    }
  }

  static withValues (node) {
    if (arguments.length === 1) {
      return node;
    }
    if (arguments.length % 2 !== 1) {
      throw new Error ('Invalid number of arguments');
    }

    var values;

    for (let i = 1; i < arguments.length; i += 2) {
      const id = arguments[i + 0];
      const value = arguments[i + 1];
      if (node._values[id] !== value) {
        if (!values) {
          values = {};
          Object.assign (values, node._values);
        }
        values[id] = value;
      }
    }

    if (!values) {
      return node;
    } else {
      return Node.with (node, {values: values});
    }
  }

  static with (node, mutation) {
    if (node.id.length === 0) {
      throw new Error ('Root node cannot be mutated');
    }
    const generation = mutation.generation || node._generation;
    const store = mutation.store || node._store;
    const values = mutation.values || node._values;

    if ((node._generation === generation) &&
        (node._store === store) &&
        (node._values === values)) {
      return node;
    } else {
      node = new Node (node._id, store, generation, values);
      // If the node was already attached to a store, we have to update the
      // store so that the new node will be used from now on...
      if (node._store) {
        // ...however, if the mutation includes a store specification, then
        // this means that the store is actually calling us, because it is
        // already updating this very node. If so, don't notify the store.
        if (!mutation.store) {
          return node._store.setNode (node);
        }
      }
      return node;
    }
  }
}

module.exports = Node;
