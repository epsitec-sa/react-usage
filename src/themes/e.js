'use strict';

import E from 'electrum';
import {Theme} from 'electrum-theme';

/*****************************************************************************/

// Lydia.getElectrumApi = () => require ('./implementations/api.js');
// Lydia.getElectrumBus = () => require ('./implementations/bus.js');

/*****************************************************************************/

const theme = Theme.create ('default');

E.typo = theme.typo;
E.palette = theme.palette;
E.colors = theme.colors;
E.transitions = theme.transitions;
E.spacing = theme.spacing;
E.shapes  = theme.shapes;
E.paperDebugColor = 'none';

module.exports = E;

/*****************************************************************************/
