'use strict';

import {expect} from 'mai-chai';
import Activity from '../store/activity.js';
import Store from '../store/store.js';

describe ('Store Activity', () => {

  afterEach (() => {
    Activity.clear ();
  });

  describe ('get()', () => {
    it ('returns an existing activity', () => {
      const activity = Activity.create ('a');
      expect (Activity.get ('a')).to.exist ();
      expect (Activity.get ('a')).to.equal (activity);
    });

    it ('throws if activity does not exist', () => {
      expect (() => Activity.get ('a')).to.throw (Error);
    });

    it ('returns an activity, which is a store', () => {
      const activity = Activity.create ('a');
      expect (activity.id).to.equal ('a');
      expect (activity instanceof Store).to.be.true ();
    });
  });

  describe ('find()', () => {
    it ('returns an existing activity', () => {
      const activity = Activity.create ('a');
      expect (Activity.find ('a')).to.exist ();
      expect (Activity.find ('a')).to.equal (activity);
    });

    it ('returns undefined if activity does not exist', () => {
      expect (Activity.find ('a')).to.be.undefined ();
    });
  });

  describe ('create() and delete()', () => {
    it ('creates and deletes Activity', () => {
      const activity1 = Activity.create ('a');
      const activity2 = Activity.create ('b');
      expect (Activity.find ('a')).to.equal (activity1);
      expect (Activity.find ('b')).to.equal (activity2);
      Activity.delete ('b');
      expect (Activity.find ('b')).to.be.undefined ();
      expect (Activity.find ('a')).to.equal (activity1);
      Activity.clear ();
      expect (Activity.find ('a')).to.be.undefined ();
    });
  });

  describe ('create()', () => {
    it ('throws if activity already exists', () => {
      const activity1 = Activity.create ('a');
      expect (Activity.find ('a')).to.equal (activity1);
      expect (() => Activity.create ('a')).to.throw (Error);
    });
  });

  describe ('delete()', () => {
    it ('throws if activity does not exist', () => {
      const activity1 = Activity.create ('a');
      expect (Activity.find ('a')).to.equal (activity1);
      Activity.delete ('a');
      expect (Activity.find ('a')).to.be.undefined ();
      expect (() => Activity.delete ('a')).to.throw (Error);
    });
  });
});
