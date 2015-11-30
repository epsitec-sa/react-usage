'use strict';

import {E} from 'electrum';
import Theme from './default-theme.js';

/*****************************************************************************/

// Lydia.getElectrumApi = () => require ('./implementations/api.js');
// Lydia.getElectrumBus = () => require ('./implementations/bus.js');

/*****************************************************************************/
E.typo = {
  font: Theme.contentFontFamily
};
E.palette = Theme.palette;
E.colors = Theme.colors;
E.transitions = Theme.transitions;
E.spacing = Theme.spacing;
E.shapes  = Theme.shapes;
E.paperDebugColor = 'none';

module.exports = E;

/*****************************************************************************/
