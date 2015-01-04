// Copyright 2002-2015, University of Colorado Boulder

/**
 * Control Panel for the sliders of the rows and binary Probability
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
  var Slider = require( 'PLINKO/plinko-probability/view/Slider' );


  // strings
  var rowsString = require( 'string!PLINKO/rows' );
  var binaryProbabilityString = require( 'string!PLINKO/binaryProbability' );

  /**
   *
   * @param {Property.<number>} rowsProperty
   * @param {Property.<number>} binaryProbabilityProperty
   * @constructor
   */
  function SliderControlPanel( rowsProperty, binaryProbabilityProperty ) {

    Node.call( this, {scale: 0.7} );

    var rowsSlider = new Slider( {
      buttonStep: 1,
      title: rowsString,
      property: rowsProperty,
      range: PlinkoConstants.ROWS_RANGE,
      rounding: 0,
      tick: {
        step: PlinkoConstants.ROWS_RANGE.getLength(),
        minText: PlinkoConstants.ROWS_RANGE.min,
        maxText: PlinkoConstants.ROWS_RANGE.max
      },
      trackSize: new Dimension2( 180, 4 ),
      patternValueUnit: '{0}'
    } );
    var binaryProbabilitySlider = new Slider( {
      buttonStep: 0.01,
      range: PlinkoConstants.BINARY_PROBABILITY_RANGE,
      rounding: 2,
      tick: {
        step: PlinkoConstants.BINARY_PROBABILITY_RANGE.getLength(),
        minText: PlinkoConstants.BINARY_PROBABILITY_RANGE.min,
        maxText: PlinkoConstants.BINARY_PROBABILITY_RANGE.max
      },
      title: binaryProbabilityString,
      property: binaryProbabilityProperty,
      trackSize: new Dimension2( 180, 4 ),
      patternValueUnit: '{0}'
    } );


    rowsSlider.x = 200;
    binaryProbabilitySlider.x = 200;
    rowsSlider.y = 10;
    binaryProbabilitySlider.y = 200;

    var panel = new Panel( new Node( {
      children: [rowsSlider, binaryProbabilitySlider]
    } ), {
      fill: 'white',
      xMargin: 10,
      yMargin: 5
    } );
    this.addChild( panel );
  }

  return inherit( Node, SliderControlPanel );
} );
