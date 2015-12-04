'use strict';

import {expect} from 'mai-chai';

let fooCalled = 0;
let fooClassBefore;
let fooClassAfter;

function foo (x) {
  fooCalled++;
  class Bar extends x {
    bar () {
      return 'bar';
    }
  };
  fooClassBefore = x;
  fooClassAfter = Bar;
  return Bar;
}

@foo
class Foo {
  bar () {
    return 'foo';
  }
}

describe ('Babel 6 and ES7 decorators', () => {
  describe ('@foo class Foo', () => {
    it ('invokes decorator', () => {
      expect (fooCalled).to.equal (1);
    });

    it ('produces a new class', () => {
      const foo = new Foo ();
      expect (Foo).to.equal (fooClassAfter);
      expect (Foo).to.not.equal (fooClassBefore);
      expect (foo).to.have.property ('bar');
      expect (foo.bar ()).to.equal ('bar');
    });

    it ('does not alter original class', () => {
      const foo = new fooClassBefore (); // jscs:disable
      expect (foo).to.have.property ('bar');
      expect (foo.bar ()).to.equal ('foo');
    });
  });
});
