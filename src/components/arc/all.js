'use strict';
import Electrum from 'electrum';
import _Button, {ButtonStateless as _ButtonStateless} from './widgets/Button.component.js';
import _Button$styles from './widgets/Button.styles.js';
export const Button = Electrum.wrap ('Button', _Button, {styles: _Button$styles});
export const ButtonStateless = Electrum.wrap ('Button', _ButtonStateless, {styles: _Button$styles});
