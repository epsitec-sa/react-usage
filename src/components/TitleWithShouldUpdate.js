'use strict';

import React from 'react';

class TitleWithShouldUpdate extends React.Component {
  shouldComponentUpdate () {
    return this.props.immutable ? false : true;
  }
  getText () {
    return 'Text:' + this.props.text;
  }
  render () {
    return <div id={this.props.id}>{this.props.text}</div>;
  }
}

export default TitleWithShouldUpdate;
