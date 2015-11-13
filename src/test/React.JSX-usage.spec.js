'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

describe ('React JSX', () => {
  // See https://facebook.github.io/react/docs/jsx-in-depth.html#namespaced-components
  describe ('Namespaced components', () => {
    it ('can be used', () => {
      class Form extends React.Component {
        render () {
          return <div id={this.props.id}>{this.props.children}</div>;
        }
      }
      Form.Head = props => <div><b>{props.title}</b></div>;
      Form.Row = props => <div>{props.children}</div>;
      Form.Label = props => <label>{props.caption}</label>;
      Form.Input = props => <span id={props.id}>input</span>;

      const form = (
        <Form id='demo'>
          <Form.Head title='Demo'/>
          <Form.Row>
            <Form.Label caption='Name'/>
            <Form.Input id='name'/>
          </Form.Row>
        </Form>);

      const mountNode = document.getElementById ('root');
      const component = ReactDOM.render (form, mountNode);

      expect (component.props).to.have.property ('id', 'demo');

      const html = ReactDOMServer.renderToStaticMarkup (form);

      expect (html).to.equal (
        '<div id="demo">' +
        '<div><b>Demo</b></div>' +
        '<div><label>Name</label><span id="name">input</span></div>' +
        '</div>');
    });
  });

  // See https://facebook.github.io/react/docs/jsx-in-depth.html#boolean-attributes
  describe ('Boolean attributes', () => {
    it ('are mapped accordingly, based on the attribute type', () => {
      class Foo extends React.Component {
        render () {
          switch (this.props.mode) {
            case 'on':
              return <input type='button' disabled={false} aria-hidden={false}/>;
            case 'off':
              return <input type='button' disabled={true} aria-hidden={true}/>;
            default:
              return <input type='button'/>;
          }
        }
      }

      const html1 = ReactDOMServer.renderToStaticMarkup (<Foo mode='*'/>);
      const html2 = ReactDOMServer.renderToStaticMarkup (<Foo mode='on'/>);
      const html3 = ReactDOMServer.renderToStaticMarkup (<Foo mode='off'/>);

      expect (html1).to.equal ('<input type="button"/>');
      expect (html2).to.equal ('<input type="button" aria-hidden="false"/>');
      expect (html3).to.equal ('<input type="button" disabled="" aria-hidden="true"/>');
    });
  });

  // See https://facebook.github.io/react/tips/dangerously-set-inner-html.html
  describe ('Dangerously Set innerHTML', () => {
    it ('injects raw HTML', () => {
      class Foo extends React.Component {
        render () {
          return <div {...this.props}/>;
        }
      }

      function createMarkup () {
        return {__html: 'x &rarr; y'};
      }

      const html = ReactDOMServer.renderToStaticMarkup (<Foo dangerouslySetInnerHTML={createMarkup ()}/>);

      expect (html).to.equal ('<div>x &rarr; y</div>');
    });
  });
});
