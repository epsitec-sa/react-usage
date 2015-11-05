'use strict';

import React from 'react';

class Title extends React.Component {
  getText () {
    return 'Text:' + this.props.text;
  }
  render () {
    return <div id={this.props.id}>{this.props.text}</div>;
  }
}

export default Title;
