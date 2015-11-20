'use strict';

import Store from './store.js';

let activities = new Map ();

class Activity {

  static get (id) {
    const store = Activity.find (id);
    if (!store) {
      throw new Error ('Activity ' + id + ' does not exist');
    }
    return store;
  }

  static find (id) {
    return activities.get (id);
  }

  static create (id, component) {
    if (activities.has (id)) {
      throw new Error ('Activity ' + id + ' already exists');
    }
    const values = {$component: component};
    const store = Store.create (id, values);
    store._activityId = id;
    activities.set (id, store);
    return store;
  }

  static delete (id) {
    Activity.get (id); // make sure it exists
    activities.delete (id);
  }

  static clear () {
    activities.clear ();
  }
}

module.exports = Activity;
