'use strict';

import 'babel-polyfill';
import {expect} from 'mai-chai';

/******************************************************************************/

function * numbers (n) {
  for (let i = 0; i < n; i++) {
    yield i;
  }
}

/******************************************************************************/
/* See https://github.com/mvolkmann/star-it                                   */

function * take (iterable, n) {
  const iterator = iterable[Symbol.iterator] ();
  while (n > 0) {
    yield iterator.next ().value;
    n--;
  }
}

function * skip (iterable, n) {
  const iterator = iterable[Symbol.iterator] ();
  let result;

  // Skip the first n values.
  for (let i = 0; i <= n; i++) {
    result = iterator.next ();
    if (result.done) {
      return;
    }
  }

  // Yield the rest of the values.
  while (!result.done) {
    yield result.value;
    result = iterator.next ();
  }
}

/******************************************************************************/

describe ('Babel 6 and generators', () => {
  describe ('finite generator', () => {
    it ('for-of produces expected sequence', () => {
      let arr = [];
      for (let x of numbers (10)) {
        arr.push (x);
      }
      expect (arr).to.have.length (10);
      expect (arr).to.deep.equal ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it ('spread operator (...) produces expected sequence', () => {
      let arr = [...numbers (10)];
      expect (arr).to.have.length (10);
      expect (arr).to.deep.equal ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe ('take()', () => {
    it ('limits the number of samples produces by a generator', () => {
      let arr = [...take (numbers (10), 3)];
      expect (arr).to.have.length (3);
      expect (arr).to.deep.equal ([0, 1, 2]);
    });
    it ('limits the number of samples from an array', () => {
      let arr = [...take ([2, 4, 6, 8], 2)];
      expect (arr).to.have.length (2);
      expect (arr).to.deep.equal ([2, 4]);
    });
  });

  describe ('skip()', () => {
    it ('skips the number of samples produces by a generator', () => {
      let arr1 = [...skip (numbers (10), 7)];
      let arr2 = [...skip (numbers (3), 0)];
      expect (arr1).to.have.length (3);
      expect (arr1).to.deep.equal ([7, 8, 9]);
      expect (arr2).to.have.length (3);
      expect (arr2).to.deep.equal ([0, 1, 2]);
    });
  });
});

/******************************************************************************/
