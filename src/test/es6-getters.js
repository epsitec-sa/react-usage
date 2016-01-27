'use strict';

import {expect} from 'mai-chai';

describe ('ES6 Getters', () => {
  describe ('lookup getter on object, with own property', () => {

    var obj = {
      func: function () {},
      get foo () {
        return 'x';
      }
    };

    it ('returns getter using deprecated __lokupGetter__', () => {
      const foo = obj.__lookupGetter__ ('foo');
      expect (typeof foo).to.equal ('function');
      expect (foo.name).to.equal ('foo');
    });

    it ('returns getter using standard-compliant way', () => {
      const foo = Object.getOwnPropertyDescriptor (obj, 'foo').get;
      expect (typeof foo).to.equal ('function');
      expect (foo.name).to.equal ('foo');
    });
  });

  describe ('lookup getter on class, with prototype property', () => {

    class Foo {
      bar () {}
      get foo () {
        return 'x';
      }
    }

    var obj = new Foo ();

    it ('returns getter using deprecated __lokupGetter__', () => {
      const foo = obj.__lookupGetter__ ('foo');
      expect (typeof foo).to.equal ('function');
      expect (foo.name).to.startWith ('get'); // should be 'get foo' but this is not possible in ES5
    });

    it ('returns getter using standard-compliant way', () => {
      const foo = Object.getOwnPropertyDescriptor (Object.getPrototypeOf (obj), 'foo').get;
      expect (typeof foo).to.equal ('function');
      expect (foo.name).to.startWith ('get'); // should be 'get foo' but this is not possible in ES5
    });
  });
});
