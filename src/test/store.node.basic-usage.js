'use strict';

import {expect} from 'mai-chai';

import {State} from 'electrum-store';

describe ('State', () => {
  describe ('new State()', () => {
    it ('requires valid id string', () => {
      expect (() => State.create ()).to.throw (Error);
      expect (() => State.create (123)).to.throw (Error);
      expect (() => State.create ('')).to.throw (Error);
      expect (() => State.create ('a')).to.not.throw (Error);
    });

    it ('creates an empty state', () => {
      const state = State.create ('a');
      expect (state.id).to.equal ('a');
      expect (state.generation).to.equal (0);
    });
  });

  describe ('has a default value', () => {
    const state1 = State.create ('a');
    const state2 = State.with (state1, {values: {'': 1}});

    expect (state1.value).to.be.undefined ();
    expect (state2.value).to.equal (1);
    expect (state2.get ('')).to.equal (1);
  });

  describe ('getParentId()', () => {
    it ('returns undefined if there is no parent (id="")', () => {
      expect (State.getParentId ('a')).to.be.equal ('');
      expect (State.getParentId ('')).to.be.undefined ();
    });

    it ('returns empty name for id=".a"', () => {
      expect (State.getParentId ('.a')).to.equal ('');
    });

    it ('returns parent name for id="a.b.c"', () => {
      expect (State.getParentId ('a.b.c')).to.equal ('a.b');
    });
  });

  describe ('with()', () => {
    it ('returns new instance of state on change', () => {
      const state1 = State.create ('a');
      const state2 = State.with (state1, {generation: 1});
      expect (state1.generation).to.equal (0);
      expect (state2.generation).to.equal (1);
    });

    it ('returns same instance of state on no-op', () => {
      const state1 = State.create ('a');
      const state2 = State.with (state1, {generation: 0});
      expect (state1 === state2).to.be.true ();
    });

    it ('returns same instance of state on empty update', () => {
      const state1 = State.create ('a');
      const state2 = State.with (state1, {});
      expect (state1 === state2);
    });
  });

  describe ('State.withValue()', () => {
    it ('produces a new state when value changes', () => {
      const state1 = State.create ('a');
      const state2 = State.withValue (state1, 'x', 1);
      const state3 = State.withValue (state2, 'x', 2);
      const state4 = State.withValue (state3, 'x', 2);
      const state5 = State.withValue (state4, 'x', 1);
      expect (state1.get ('x')).to.be.undefined ();
      expect (state2.get ('x')).to.equal (1);
      expect (state3.get ('x')).to.equal (2);
      expect (state4.get ('x')).to.equal (2);
      expect (state5.get ('x')).to.equal (1);
      expect (state1).to.not.equal (state2);
      expect (state2).to.not.equal (state3);
      expect (state3).to.equal (state4);
      expect (state4).to.not.equal (state5);
      expect (state1).to.not.equal (state5);
    });
  });

  describe ('State.withValues()', () => {
    it ('works with no values', () => {
      const state1 = State.create ('a');
      const state2 = State.withValues (state1);
      expect (state1).to.equal (state2);
    });

    it ('works with multiple values', () => {
      const state1 = State.create ('a');
      const state2 = State.withValues (state1, 'x', 1, 'y', 2);
      const state3 = State.withValues (state2, 'x', 1, 'y', 2);
      expect (state1).to.not.equal (state2);
      expect (state2.get ('x')).to.equal (1);
      expect (state2.get ('y')).to.equal (2);
      expect (state2).to.equal (state3);
    });

    it ('updates values and keeps previous unchanged', () => {
      const state1 = State.create ('a');
      const state2 = State.withValues (state1, 'x', 1, 'y', 2);
      const state3 = State.withValues (state2, 'y', 0, 'z', 3);
      expect (state3.get ('x')).to.equal (1);
      expect (state3.get ('y')).to.equal (0);
      expect (state3.get ('z')).to.equal (3);
    });

    it ('throws on wrong argument count', () => {
      const state1 = State.create ('a');
      expect (() => State.withValues (state1, 'x')).to.throw (Error);
      expect (() => State.withValues (state1, 'x', 1, 'y')).to.throw (Error);
    });
  });

  describe ('State.join()', () => {
    it ('joins multiple ids', () => {
      expect (State.join ('a', 'b', 'c')).to.equal ('a.b.c');
    });

    it ('joins multiple ids provided as a spread', () => {
      expect (State.join (...['a', 'b', 'c'])).to.equal ('a.b.c');
      expect (State.join (...[])).to.equal ('');
    });

    it ('validates ids', () => {
      expect (() => State.join ('x', '')).to.throw (Error);
      expect (() => State.join ('x', 1)).to.throw (Error);
      expect (() => State.join (...['x', ''])).to.throw (Error);
      expect (() => State.join (...['x', 1])).to.throw (Error);
    });
  });
});
