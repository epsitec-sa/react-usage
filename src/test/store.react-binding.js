'use strict';

import {expect} from 'mai-chai';

import {Node, Store} from 'electrum-store';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import shallowCompare from 'react-addons-shallow-compare';

let log = '';

function pureRenderDecorator (component) {
  component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
    log = (log +
      '|' +
      this.props.node.generation +
      '>' + nextProps.node.generation +
      '=' +
      shallowCompare (this, nextProps, nextState));
    return shallowCompare (this, nextProps, nextState);
  };
}

const Content = React.createClass ({
  render: function () {
    log = log + '/Content';
    return <div>{Store.read (this.props, 'text')}</div>;
  }
});

const Author = React.createClass ({
  render: function () {
    log = log + '/Author';
    return <div>
      <img src={Store.read (this.props, 'imageUrl')} />
      <span>{Store.read (this.props, 'displayName')}</span>
    </div>;
  }
});

const Post = React.createClass ({
  render: function () {
    log = log + '/Post';
    return <div>
      <Content {...Store.link (this.props, 'content')} />
      <Author {...Store.link (this.props, 'author')} />
    </div>;
  }
});

pureRenderDecorator (Content);
pureRenderDecorator (Author);
pureRenderDecorator (Post);

describe ('Store React binding', () => {
  describe ('Store.link()', () => {
    it ('propagates nodes and values through component tree', () => {
      const store = Store.create ();
      const contentNode = Node.withValue (store.getNode ('post.content'), 'text', 'X');
      const authorNode = Node.withValues (store.getNode ('post.author'), 'imageUrl', 'http://ima.ge/x.png', 'displayName', 'John Doe');
      const postNode = store.getNode ('post');

      expect (contentNode.getValue ('text')).to.equal ('X');
      expect (contentNode.id).to.equal ('post.content');
      expect (authorNode.getValue ('displayName')).to.equal ('John Doe');
      expect (authorNode.getValue ('imageUrl')).to.equal ('http://ima.ge/x.png');

      const form = <Post node={postNode} />;
      const html = ReactDOMServer.renderToStaticMarkup (form);

      expect (html).to.equal (
        '<div>' +
        '<div>X</div>' +
        '<div><img src="http://ima.ge/x.png"/><span>John Doe</span></div>' +
        '</div>');
    });

    it ('works well with render() and shouldComponentUpdate()', () => {
      const store = Store.create ();

      Node.with (store.getNode ('post.content'), {values: {text: 'X'}});
      Node.with (store.getNode ('post.author'), {values: {imageUrl: 'http://ima.ge/x.png', displayName: 'John Doe'}});

      const mountNode = document.getElementById ('root');

      log = '';
      ReactDOM.render (<Post node={store.findNode ('post')} />, mountNode);
      expect (log).to.equal ('/Post/Content/Author');

      log = '';
      ReactDOM.render (<Post node={store.findNode ('post')} />, mountNode);
      expect (log).to.equal ('|4>4=false');

      log = '';
      Node.withValue (store.findNode ('post.content'), 'text', 'Y');
      ReactDOM.render (<Post node={store.findNode ('post')} />, mountNode);
      expect (log).to.equal ('|4>5=true/Post|2>5=true/Content|4>4=false');

      log = '';
      Node.withValue (store.findNode ('post.author'), 'displayName', 'John');
      ReactDOM.render (<Post node={store.findNode ('post')} />, mountNode);
      expect (log).to.equal ('|5>6=true/Post|5>5=false|4>6=true/Author');
    });
  });
});
