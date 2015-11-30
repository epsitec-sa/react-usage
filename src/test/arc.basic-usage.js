'use strict';

import {E} from '../themes/e.js';
import {all} from 'electrum-arc/lib/all-components.js';

console.log ('E initialized: ' + E);

import Arc from 'electrum-arc';

describe ('Arc', () => {
  describe ('import', () => {
    it ('gives access to all components', () => {
      console.log (Arc);
    });
  });
});
