'use strict';

const emptyValues = {};
const secretKey = {};

class Node {
  constructor (key, id, store, generation, values) {
    if (key !== secretKey) {
      throw new Error ('Do not call Node constructor directly; use Node.create instead');
    }
    if ((typeof id !== 'string') ||
        (!store && (id.length === 0)) ||
        (store && store._rootNode && (id.length === 0))) {
      throw new Error ('Node expects a valid id');
    }
    if (typeof generation !== 'number') {
      throw new Error ('Node expects a valid generation');
    }
    if (typeof values !== 'object') {
      throw new Error ('Node expects valid initial values');
    }

    this._id = id;
    this._store = store;
    this._generation = generation;
    this._values = values;
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

  static create (id) {
    return new Node (secretKey, id, null, 0, emptyValues);
  }

  static createRootNode (store, values) {
    return new Node (secretKey, '', store, 0, values || emptyValues);
  }

  static join (...args) {
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

  static withValues (node, ...args) {
    if (args.length === 0) {
      return node;
    }
    if (args.length % 2 !== 0) {
      throw new Error ('Invalid number of arguments');
    }

    var values;

    for (let i = 0; i < args.length; i += 2) {
      const id = args[i + 0];
      const value = args[i + 1];
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
      node = new Node (secretKey, node._id, store, generation, values);
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
