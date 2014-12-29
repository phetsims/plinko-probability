// Copyright 2002-2014, University of Colorado Boulder

/**
 * Control Panel for the sliders of the rows and binary Probability
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Slider = require( 'PLINKO/plinko-probability/view/Slider' );
  var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );

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

    Node.call( this, {x: 5, scale: 0.7} );

    var rowsSlider = new Slider( {
      type: 'button',
      buttonStep: 0.1,
      title: rowsString,
      property: rowsProperty,
      rounding: 2,
      range: PlinkoConstants.ROWS_RANGE
    } );
    var binaryProbabilitySlider = new Slider( {
      type: 'button',
      buttonStep: 0.01,
      title: binaryProbabilityString,
      property: binaryProbabilityProperty,
      rounding: 2,
      range: PlinkoConstants.BINARY_PROBABILITY_RANGE
    } );

    rowsSlider.x = 200;
    binaryProbabilitySlider.x = 200;

    binaryProbabilitySlider.y = 10;
    rowsSlider.y = 200;
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
