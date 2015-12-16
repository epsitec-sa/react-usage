'use strict';

import React from 'react';
import shallowCompare from 'react-addons-shallow-compare';

let titleConstructors = [];
let titleRenders = [];

class Title extends React.Component {
  constructor (props) {
    super (props);
    titleConstructors.push ({obj: this, props: this.props});
  }
  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare (this, nextProps, nextState);
  }
  componentWillReceiveProps (nextProps) {
    // console.log (nextProps);
  }
  getText () {
    return 'Text:' + this.props.text;
  }
  render () {
    titleRenders.push ({obj: this, props: this.props});
    return <div id={this.props.id}>{this.props.text}</div>;
  }

  static clear () {
    titleConstructors = [];
    titleRenders = [];
  }

  static getConstructorCount () {
    return titleConstructors.length;
  }

  static getConstructorTitles () {
    return titleConstructors;
  }

  static getRenderCount () {
    return titleRenders.length;
  }

  static getRenderTitles () {
    return titleRenders;
  }
}

export default Title;
