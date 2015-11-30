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
    primary1Color: Colors.lightBlue500,
    primary2Color: Colors.lightBlue700,
    primary3Color: Colors.lightBlue100,
    accent1Color: Colors.pinkA200,
    accent2Color: Colors.pinkA400,
    accent3Color: Colors.pinkA100,
    textColor: Colors.darkBlack,
    subTextColor: ColorManipulator.fade (Colors.darkBlack, 0.54),
    canvasColor: Colors.white,
    paperColor: Colors.white,
    borderColor: Colors.grey300,
    disabledColor: ColorManipulator.fade (Colors.darkBlack, 0.3)
  },
  colors: Colors,
  transitions: Transitions
};

module.exports = Theme;
