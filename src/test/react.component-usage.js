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

  // See http://babeljs.io/docs/plugins/transform-react-display-name/
  describe ('displayName', () => {
    it ('gets added by Babel plugin on React.createClass', () => {
      const Foo = React.createClass ({
        render: function () {
          return <div/>;
        }
      });

      expect (Foo.displayName).to.equal ('Foo');

      const mountNode = document.getElementById ('root');
      const component = ReactDOM.render (<Foo/>, mountNode);

      expect (component.constructor.displayName).to.equal ('Foo');
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

      it ('warns if properties don\'t match the expected type', () => {
        class Foo extends React.Component {
          render () {
            return <div/>;
          }
        }
        Foo.propTypes = {a: React.PropTypes.string, b: React.PropTypes.number};

        const spyConsoleError = spy.on (console, 'error');
        const mountNode = document.getElementById ('root');
        ReactDOM.render (<Foo a={1} b='x' c='y'/>, mountNode);
        expect (spyConsoleError).to.be.called (2);
      });

      it ('passes props to constructor', () => {
        class Foo extends React.Component {
          constructor (props) {
            super (props);
            expect (props).to.have.property ('a', 1);
            expect (props).to.have.property ('b', 'x');
            expect (props).to.have.property ('c', 'y');
          }
          render () {
            return <div/>;
          }
        }
        const mountNode = document.getElementById ('root');
        ReactDOM.render (<Foo a={1} b='x' c='y'/>, mountNode);
      });
    });
  });

  describe ('lifecycle methods', () => {
    var actions = '';

    class Foo extends React.Component {
      constructor (props) {
        super (props);
        this.state = {x: '-'};
      }
      componentWillMount () {
        actions += 'will-mount/';
      }
      componentDidMount () {
        actions += 'did-mount/';
      }
      componentWillReceiveProps (nextProps) {
        actions += `will-rcv-props:${nextProps.name}/`;
      }
      shouldComponentUpdate (nextProps, nextState) {
        actions += `should-update:${nextProps.name}:${nextState.x}/`;
        return true;
      }
      componentWillUpdate (nextProps, nextState) {
        actions += `will-update:${nextProps.name}:${nextState.x}/`;
      }
      componentDidUpdate (prevProps, prevState) {
        actions += `did-update:${prevProps.name}:${prevState.x}/`;
      }
      componentWillUnmount () {
        actions += 'will-unmount/';
      }
      render () {
        actions += 'render/';
        return <div/>;
      }
    }

    it ('ReactDOM.render calls componentWillMount/render/DidMount()', () => {
      actions = '';
      const mountNode = document.getElementById ('root');
      ReactDOM.render (<Foo name='foo'/>, mountNode);
      expect (actions).to.equal ('will-mount/render/did-mount/');
      ReactDOM.unmountComponentAtNode (mountNode);
    });

    it ('component.SetState calls componentShouldUpdate/WillUpdate/render/DidUpdate()', () => {
      const mountNode = document.getElementById ('root');
      const component = ReactDOM.render (<Foo name='foo'/>, mountNode);
      actions = '';
      component.setState ({x: 'a'});
      expect (actions).to.equal ('should-update:foo:a/will-update:foo:a/render/did-update:foo:-/');
      actions = '';
      ReactDOM.render (<Foo name='bar'/>, mountNode);
      expect (actions).to.equal ('will-rcv-props:bar/should-update:bar:a/will-update:bar:a/render/did-update:foo:a/');
      actions = '';
      ReactDOM.unmountComponentAtNode (mountNode);
      expect (actions).to.equal ('will-unmount/');
      ReactDOM.unmountComponentAtNode (mountNode);
    });

    it ('ReactDOM.render/2 calls componentWillReceiveProps/ShouldUpdate/WillUpdate/render/DidUpdate()', () => {
      const mountNode = document.getElementById ('root');
      ReactDOM.render (<Foo name='foo'/>, mountNode);
      actions = '';
      ReactDOM.render (<Foo name='bar'/>, mountNode);
      expect (actions).to.equal ('will-rcv-props:bar/should-update:bar:-/will-update:bar:-/render/did-update:foo:-/');
      actions = '';
      ReactDOM.unmountComponentAtNode (mountNode);
      expect (actions).to.equal ('will-unmount/');
      ReactDOM.unmountComponentAtNode (mountNode);
    });

    it ('ReactDOM.unmountComponentAtNode calls componentWillUnmount()', () => {
      const mountNode = document.getElementById ('root');
      ReactDOM.render (<Foo name='foo'/>, mountNode);
      actions = '';
      ReactDOM.unmountComponentAtNode (mountNode);
      expect (actions).to.equal ('will-unmount/');
    });
  });
});
