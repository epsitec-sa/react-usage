'use strict';

import {expect} from 'mai-chai';

import React from 'react';
import ReactDOM from 'react-dom';

function getPath (pathName) {
  return {
    id: pathName || ''
  };
}

function propagate (props, subpath) {
  const {activity, path} = props;
  if (subpath) {
    return {activity: activity, path: {id: path.id + '.' + subpath}};
  } else {
    return {activity: activity, path: path};
  }
}

const ContentSpy = props => {
  return <div>{'A:' + props.activity.activityId + ', id:' + props.id + ', path:' + props.path.id}</div>;
};

const Frame = props => {
  return <ContentSpy {...propagate (props, 'x')}/>;
};

const RootFrame = props => {
  return (
    <div>
      <Frame {...propagate (props, 'frame1')}/>
      <Frame {...propagate (props, 'frame2')}/>
      <ContentSpy {...propagate (props)}/>
    </div>);
};


describe ('React props', () => {
  describe ('propagate()', () => {
    it ('one level deep, forwards activity and source path combined with subpath', () => {
      const mountNode = document.getElementById ('root');
      const activity = {activityId: 'a'};

      ReactDOM.render (<Frame activity={activity} path={getPath ('root')} id='frame' />, mountNode);

      const root = mountNode.children[0];

      expect (root).to.have.property ('id', '');
      expect (root).to.have.property ('localName', 'div');
      expect (root).to.have.property ('textContent', 'A:a, id:undefined, path:root.x');
    });

    it ('two level deep, forwards activity and source path combined with subpath', () => {
      const mountNode = document.getElementById ('root');
      const activity = {activityId: 'a'};

      ReactDOM.render (<RootFrame activity={activity} path={getPath ('root')} id='frame' />, mountNode);

      const root = mountNode.children[0];

      expect (root.children).to.have.length (3);
      expect (root.children[0]).to.have.property ('textContent', 'A:a, id:undefined, path:root.frame1.x');
      expect (root.children[1]).to.have.property ('textContent', 'A:a, id:undefined, path:root.frame2.x');
      expect (root.children[2]).to.have.property ('textContent', 'A:a, id:undefined, path:root');
    });
  });
});
