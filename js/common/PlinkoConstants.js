// Copyright 2002-2014, University of Colorado Boulder

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
  //var Range = require( 'DOT/Range' );

  var PlinkoConstants = {

    RESET_ALL_BUTTON_SCALE: 0.75,

    // font sizes and weight
    TEXT_FONT: new PhetFont( {size: 16} ), // default font for text
    TEXT_FONT_BOLD: new PhetFont( {size: 16, weight: 'bold'} ), // default font for bold font
    CHECK_BOX_TEXT_FONT: new PhetFont( {size: 14} ),
    MAJOR_TICK_FONT: new PhetFont( {size: 14} ),

    // panels
    CONTROL_PANEL_CORNER_RADIUS: 10,
    SMALL_PANEL_CORNER_RADIUS: 5,
    CONTROL_PANEL_BACKGROUND_COLOR: 'rgb(255, 245, 238)'

  };

  return PlinkoConstants;
} );
