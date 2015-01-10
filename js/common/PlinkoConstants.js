// Copyright 2002-2015, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  //var Bounds2 = require( 'DOT/Bounds2' );
  //var Dimension2 = require( 'DOT/Dimension2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Range = require( 'DOT/Range' );

  var PlinkoConstants = {

    BACKGROUND_COLOR: 'rgb(170,220,255)',

    RESET_ALL_BUTTON_SCALE: 0.75,

    // font sizes and weight
    TEXT_FONT: new PhetFont( {size: 18} ), // default font for text
    TEXT_FONT_BOLD: new PhetFont( {size: 18, weight: 'bold'} ), // default font for bold font
    CHECK_BOX_TEXT_FONT: new PhetFont( {size: 16} ),
    MAJOR_TICK_FONT: new PhetFont( {size: 16} ),

    // panels
    CONTROL_PANEL_CORNER_RADIUS: 10,
    SMALL_PANEL_CORNER_RADIUS: 5,
    CONTROL_PANEL_BACKGROUND_COLOR: 'rgb(255, 245, 238)',

    PANEL_FONT: new PhetFont( 16 ),
    PANEL_FONT_BOLD: new PhetFont( {size: 18, weight: 'bold'} ),

    PANEL_BACKGROUND_COLOR: 'white',
    SAMPLE_FONT_COLOR: 'red',
    THEORETICAL_FONT_COLOR: 'blue',

    BINARY_PROBABILITY_RANGE: new Range( 0, 1 ),
    ROWS_RANGE: new Range( 5, 26 ),

    // constants
    BALL_RADIUS: 6, // radius of the Ball.
    BALL_COLOR: 'red',
    BALL_HIGHLIGHT_COLOR: 'white',

    PEG_RADIUS: 5, // radius of the peg.
    PEG_COLOR: 'rgb(139,125,107)' //brown

  };

  return PlinkoConstants;
} );
