// Copyright 2014-2015, University of Colorado Boulder

/**
 * Control panel rows and binary probability.
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
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
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
   * @param {Property.<number>} binaryProbabilityProperty
   * @param {Object} [options]
   * @constructor
   */
  function SliderControlPanel( rowsProperty, binaryProbabilityProperty, options ) {

    options = _.extend( {
      align: 'center',
      fill: 'white',
      xMargin: 10,
      yMargin: 8,
      resize: false // prevent sliders from causing a resize when thumb is at min or max
    }, options );


    // major tick labels for slider that controls number of rows
    assert && assert( Util.isInteger( PlinkoConstants.ROWS_RANGE.min ), 'integer required: ' + PlinkoConstants.ROWS_RANGE.min );
    assert && assert( Util.isInteger( PlinkoConstants.ROWS_RANGE.max ), 'integer required: ' + PlinkoConstants.ROWS_RANGE.max );
    var tickLabelOptions = {
      font: PlinkoConstants.MAJOR_TICK_FONT
    };
    var rowsMajorTicks = [ {
      value: PlinkoConstants.ROWS_RANGE.min,
      label: new Text( PlinkoConstants.ROWS_RANGE.min, tickLabelOptions )
    }, {
      value: PlinkoConstants.ROWS_RANGE.max,
      label: new Text( PlinkoConstants.ROWS_RANGE.max, tickLabelOptions )
    }
    ];

    // control for number of rows
    var rowsControl = new NumberControl( rowsString, rowsProperty, PlinkoConstants.ROWS_RANGE, {
      layoutFunction: NumberControl.createLayoutFunction3(),
      titleFont: PlinkoConstants.PANEL_FONT,
      titleMaxWidth: SLIDER_TRACK_SIZE.width,
      valueFont: PlinkoConstants.PANEL_READOUT_FONT,
      decimalPlaces: 0,
      delta: 1,
      trackSize: SLIDER_TRACK_SIZE,
      majorTicks: rowsMajorTicks
    } );

    // major tick labels for slider that controls binary probability
    assert && assert( Util.isInteger( PlinkoConstants.BINARY_PROBABILITY_RANGE.min ), 'integer required: ' + PlinkoConstants.BINARY_PROBABILITY_RANGE.min );
    assert && assert( Util.isInteger( PlinkoConstants.BINARY_PROBABILITY_RANGE.max ), 'integer required: ' + PlinkoConstants.BINARY_PROBABILITY_RANGE.max );
    var binaryProbabilityMajorTicks = [ {
      value: PlinkoConstants.BINARY_PROBABILITY_RANGE.min,
      label: new Text( PlinkoConstants.BINARY_PROBABILITY_RANGE.min, tickLabelOptions )
    }, {
      value: PlinkoConstants.ROWS_RANGE.max,
      label: new Text( PlinkoConstants.BINARY_PROBABILITY_RANGE.max, tickLabelOptions )
    }
    ];

    // control for the binary probability
    var binaryProbabilityControl = new NumberControl( binaryProbabilityString, binaryProbabilityProperty, PlinkoConstants.BINARY_PROBABILITY_RANGE, {
      layoutFunction: NumberControl.createLayoutFunction3(),
      titleFont: PlinkoConstants.PANEL_FONT,
      titleMaxWidth: SLIDER_TRACK_SIZE.width,
      valueFont: PlinkoConstants.PANEL_READOUT_FONT,
      decimalPlaces: 2,
      delta: 0.01,
      trackSize: SLIDER_TRACK_SIZE,
      majorTicks: binaryProbabilityMajorTicks
    } );

    var contentNode = new VBox( {
      resize: false, // prevent sliders from causing a resize when thumb is at min or max
      align: 'center',
      spacing: 25,
      children: [ rowsControl, binaryProbabilityControl ]
    } );

    Panel.call( this, contentNode, options );
  }

  plinkoProbability.register( 'SliderControlPanel', SliderControlPanel );

  return inherit( Panel, SliderControlPanel );
} );
