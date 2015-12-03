'use strict';

import React from 'react';

export function ActivityView (props) {
  const {act} = props;
  const state = act.root;
  const root = act.select ('activity');
  const component = state.get ('$component');
  return React.createElement (component, {state: root});
}
