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
  //var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var Range = require( 'DOT/Range' );

  var PlinkoConstants = {

    BACKGROUND_COLOR: 'rgb(186,231,249)',

    RESET_ALL_BUTTON_SCALE: 0.75,

    // font sizes and weight (for statistics diaplay node)
    TEXT_FONT: new PhetFont( { size: 18 } ), // default font for text
    TEXT_FONT_BOLD: new PhetFont( { size: 22, weight: 'bold' } ), // default font for bold font (N=)


    CHECK_BOX_TEXT_FONT: new PhetFont( { size: 16 } ),
    MAJOR_TICK_FONT: new PhetFont( { size: 16 } ),

    // panels
    CONTROL_PANEL_CORNER_RADIUS: 10,
    SMALL_PANEL_CORNER_RADIUS: 5,
    CONTROL_PANEL_BACKGROUND_COLOR: 'rgb(255, 245, 238)',

    PANEL_FONT: new PhetFont( 18 ),
    PANEL_READOUT_FONT: new PhetFont( { size: 14} ),

    PANEL_BACKGROUND_COLOR: 'white',
    SAMPLE_FONT_COLOR: 'rgb(237,28,36)',
    THEORETICAL_FONT_COLOR: 'blue',

    BINARY_PROBABILITY_RANGE: new Range( 0, 1 ),
    ROWS_RANGE: new Range( 5, 26 ),

    // constants
    // TODO the radii are not constant
    BALL_RADIUS: 4, // radius of the Ball.
    BALL_COLOR: 'rgb(237,28,36)',
    BALL_HIGHLIGHT_COLOR: 'white',
    PEG_RADIUS: 3, // radius of the peg.
    PEG_COLOR: 'rgb(115,99,87)', //brown

    PEG_HEIGHT_FRACTION_OFFSET :0.8, // ranges between zero and 1

    // histogram
    HISTOGRAM_BAR_COLOR_FILL: 'rgb(237,28,36)', // red
    HISTOGRAM_BAR_COLOR_STROKE: 'rgb(193,39,45)', // darker shade of red
    BINOMIAL_DISTRIBUTION_BAR_COLOR_STROKE: 'blue'

  };

  return PlinkoConstants;
} );
