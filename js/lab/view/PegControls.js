// Copyright 2014-2016, University of Colorado Boulder

/**
 * Controls that affect the pegs in the Galton board.
 *
 * @author Martin Veillette (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var NumberControl = require( 'SCENERY_PHET/NumberControl' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var rowsString = require( 'string!PLINKO_PROBABILITY/rows' );
  var binaryProbabilityString = require( 'string!PLINKO_PROBABILITY/binaryProbability' );

  // constants
  var SLIDER_TRACK_SIZE = new Dimension2( 170, 2 );

  /**
   * @param {Property.<number>} rowsProperty
   * @param {Property.<number>} probabilityProperty
   * @param {Object} [options]
   * @constructor
   */
  function PegControls( rowsProperty, probabilityProperty, options ) {

    options = _.extend( {
      align: 'center',
      fill: 'white',
      xMargin: 10,
      yMargin: 8,
      resize: false // prevent sliders from causing a resize when thumb is at min or max
    }, options );

    // major tick labels for slider that controls number of rows
    assert && assert( Util.isInteger( PlinkoProbabilityConstants.ROWS_RANGE.min ), 'integer required: ' + PlinkoProbabilityConstants.ROWS_RANGE.min );
    assert && assert( Util.isInteger( PlinkoProbabilityConstants.ROWS_RANGE.max ), 'integer required: ' + PlinkoProbabilityConstants.ROWS_RANGE.max );
    var tickLabelOptions = {
      font: PlinkoProbabilityConstants.MAJOR_TICK_FONT
    };
    var rowsMajorTicks = [ {
      value: PlinkoProbabilityConstants.ROWS_RANGE.min,
      label: new Text( PlinkoProbabilityConstants.ROWS_RANGE.min, tickLabelOptions )
    }, {
      value: PlinkoProbabilityConstants.ROWS_RANGE.max,
      label: new Text( PlinkoProbabilityConstants.ROWS_RANGE.max, tickLabelOptions )
    } ];

    // control for number of rows
    var rowsControl = new NumberControl( rowsString, rowsProperty, PlinkoProbabilityConstants.ROWS_RANGE, {
      layoutFunction: NumberControl.createLayoutFunction3( {
        ySpacing: 3
      } ),
      titleFont: PlinkoProbabilityConstants.PANEL_FONT,
      titleMaxWidth: SLIDER_TRACK_SIZE.width,
      valueFont: PlinkoProbabilityConstants.PANEL_READOUT_FONT,
      decimalPlaces: 0,
      delta: 1,
      trackSize: SLIDER_TRACK_SIZE,
      majorTicks: rowsMajorTicks,
      tickLabelSpacing: 2
    } );

    // major tick labels for slider that controls binary probability
    assert && assert( Util.isInteger( PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.min ), 'integer required: ' + PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.min );
    assert && assert( Util.isInteger( PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.max ), 'integer required: ' + PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.max );
    var probabilityMajorTicks = [ {
      value: PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.min,
      label: new Text( PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.min, tickLabelOptions )
    }, {
      value: PlinkoProbabilityConstants.ROWS_RANGE.max,
      label: new Text( PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.max, tickLabelOptions )
    } ];

    // control for the binary probability
    var probabilityControl = new NumberControl( binaryProbabilityString, probabilityProperty, PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE, {
      layoutFunction: NumberControl.createLayoutFunction3(),
      titleFont: PlinkoProbabilityConstants.PANEL_FONT,
      titleMaxWidth: SLIDER_TRACK_SIZE.width,
      valueFont: PlinkoProbabilityConstants.PANEL_READOUT_FONT,
      decimalPlaces: 2,
      delta: 0.01,
      trackSize: SLIDER_TRACK_SIZE,
      majorTicks: probabilityMajorTicks
    } );

    var contentNode = new VBox( {
      resize: false, // prevent sliders from causing a resize when thumb is at min or max
      align: 'center',
      spacing: 20,
      children: [ rowsControl, probabilityControl ]
    } );

    Panel.call( this, contentNode, options );
  }

  plinkoProbability.register( 'PegControls', PegControls );

  return inherit( Panel, PegControls );
} );

