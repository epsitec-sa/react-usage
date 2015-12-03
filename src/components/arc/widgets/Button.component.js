'use strict';

import React from 'react';
import getStyles from './Button.styles.js';

/******************************************************************************/

export default class Button extends React.Component {

  handleClick () {
    if (this.props.action || this.props.id) {
      // E.bus.dispatch (this, this.props.action || this.props.id);
    }
  }

  render () {
    const {theme, state, disabled} = this.props;
    const text     = state.get (); // E.getText (this);
    const styles = getStyles (theme);
    let style    = [styles.base, styles.cancel, disabled ? {color: theme.palette.disabledColor} : null]; // E.getStyle (this);
    return (
      <div style={this.props.boxstyle}>
        <button
          style={style}
          disabled={disabled}
          onClick={this.handleClick}
        >
          {text}
        </button>
      </div>
    );
  }
}

/******************************************************************************/
