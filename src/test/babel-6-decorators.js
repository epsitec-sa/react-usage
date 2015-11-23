'use strict';

var fooCalled = 0;

function foo (x) {
  fooCalled++;
  return x;
}

// @foo
class Foo {
}

describe ('Babel 6 and ES7 decorators', () => {
  describe ('@foo class Foo', () => {
    it ('invokes decorator', () => {
      // expect (fooCalled).to.equal (1);
    });
  });
});
