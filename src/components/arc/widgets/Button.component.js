'use strict';

import React from 'react';

import getStyles from './Button.styles.js';

/******************************************************************************/

export function ButtonStateless (props) {
  const {theme, state, disabled} = props;
  function handleClick () {
    if (props.action || props.id) {
      // E.bus.dispatch (this, this.props.action || this.props.id);
    }
  }
  const text   = state.get (); // E.getText (this);
  const styles = getStyles (theme);
  const style  = [styles.base, styles.cancel, disabled ? {color: theme.palette.disabledColor} : null];
  return (
    <div style={props.boxstyle}>
      <button
        style={style}
        disabled={disabled}
        onClick={handleClick}
      >
        {text}
      </button>
    </div>
  );
}

/******************************************************************************/

export default class Button extends React.Component {
  render () {
    const {theme, state, disabled} = this.props;
    const text  = state.get (); // E.getText (this);
    const style = this.styles.with (disabled && {color: theme.palette.disabledColor});
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

  handleClick () {
    if (this.props.action || this.props.id) {
      // E.bus.dispatch (this, this.props.action || this.props.id);
    }
  }
}

/******************************************************************************/
