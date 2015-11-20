'use strict';

import React from 'react';

export function ActivityView (props) {
  const {act} = props;
  const node = act.root;
  const root = act.getNode ('activity');
  const component = node.getValue ('$component');
  return React.createElement (component, {node: root});
}
