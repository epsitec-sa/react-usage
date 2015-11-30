'use strict';

var Colors           = require ('./colors.js');
var Spacing          = require ('./spacing.js');
var ColorManipulator = require ('./color-manipulator.js');
var Transitions      = require ('./transitions.js');

var Theme = {
  spacing: Spacing,
  contentFontFamily: 'Roboto, sans-serif',
  shapes: {
    defaultBorderRadius: '2px'
  },
  palette: {
      primary1Color: Colors.grey900,
      primary2Color: Colors.grey600,
      primary3Color: Colors.grey500,
      accent1Color: Colors.blueGrey700,
      accent2Color: Colors.blueGrey800,
      accent3Color: Colors.blueGrey900,
      textColor: Colors.white,
      subTextColor: ColorManipulator.fade(Colors.white, 0.54),
      canvasColor: '#303030',
      paperColor: Colors.grey800,
      borderColor: Colors.grey300,
      disabledColor: ColorManipulator.fade(Colors.white, 0.3)
  },
  colors: Colors,
  transitions: Transitions
};

module.exports = Theme;
