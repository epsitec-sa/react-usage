'use strict';

import {expect, spy} from 'mai-chai';

import React from 'react';
import ReactDOM from 'react-dom';

class Component extends React.Component {
  constructor (props) {
    super (props);
    this.state = {counter: 0};
  }
  render () {
    return <div id={this.state.counter}/>;
  }
}

describe ('React.Component', () => {
  describe ('setState(function)', () => {
    it ('triggers state update', () => {
      const update = function (previousState) {
        return {counter: previousState.counter + 1};
      };
      const mountNode = document.getElementById ('root');
      const component = ReactDOM.render (<Component/>, mountNode);

      expect (component.state).to.have.property ('counter', 0);
      expect (mountNode.children[0]).to.have.property ('id', '0');
      component.setState (update);
      expect (component.state).to.have.property ('counter', 1);
      expect (mountNode.children[0]).to.have.property ('id', '1');
      component.setState (update);
      expect (component.state).to.have.property ('counter', 2);
      expect (mountNode.children[0]).to.have.property ('id', '2');
    });
  });
  describe ('name', () => {
    it ('matches name of class', () => {
      const mountNode = document.getElementById ('root');
      const component = ReactDOM.render (<Component/>, mountNode);
      expect (component.constructor.name).to.equal ('Component');
    });
  });

  describe ('creation', () => {
    describe ('using Foo = React.createClass()', () => {
      it ('calls getDefaultProps() and getIntialState()', () => {
        var getDefaultPropsCalled = 0;
        var getInitialStateCalled = 0;
        const Foo = React.createClass ({
          getDefaultProps: function () {
            getDefaultPropsCalled++;
            return {id: 'default'};
          },
          getInitialState: function () {
            getInitialStateCalled++;
            return {counter: 0};
          },
          render: function () {
            return <div id={this.state.counter}/>;
          }
        });

        const mountNode = document.getElementById ('root');
        const component = ReactDOM.render (<Foo/>, mountNode);

        expect (getDefaultPropsCalled).to.equal (1);
        expect (getInitialStateCalled).to.equal (1);

        expect (component.state).to.have.property ('counter', 0);
        expect (component.props).to.have.property ('id', 'default');
      });
    });
    describe ('using class Foo extends React.Component', () => {
      it ('initializes state and props with constructor', () => {
        class Foo extends React.Component {
          constructor (props) {
            super (props);
            this.state = {counter: 0};
          }
          render () {
            return <div />;
          }
        }
        Foo.defaultProps = {id: 'default'};
        Foo.propTypes = {id: React.PropTypes.string, num: React.PropTypes.number};

        const mountNode = document.getElementById ('root');
        const component = ReactDOM.render (<Foo/>, mountNode);

        expect (component.state).to.have.property ('counter', 0);
        expect (component.props).to.have.property ('id', 'default');
      });
    });
  });
});
