'use strict';

import Store from './store.js';

let activities = new Map ();

class Activities {

  static get (id) {
    const store = activities.get (id);
    if (!store) {
      throw new Error ('Activity ' + id + ' does not exist');
    }
    return store;
  }

  static createActivity (id) {
    if (activities.has (id)) {
      throw new Error ('Activity ' + id + ' already exists');
    }
    const store = new Store ();
    store._activityId = id;
    activities.set (id, store);
    return store;
  }

  static deleteActivity (id) {
    Activities.get (id); // make sure it exists
    activities.delete (id);
  }
}
