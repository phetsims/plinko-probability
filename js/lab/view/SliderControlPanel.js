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
  var SliderWithReadout = require( 'PLINKO/lab/view/SliderWithReadout' );
  var Util = require( 'DOT/Util' );

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

    Node.call( this );

    var rowsSlider = new SliderWithReadout( {
      buttonStep: 1,
      title: rowsString,
      titleFont: PlinkoConstants.PANEL_FONT_BOLD,
      displayFont: PlinkoConstants.PANEL_FONT, // font for the numerical display

      property: rowsProperty,
      range: PlinkoConstants.ROWS_RANGE,
      decimalPlaces: 0,
      slider: {
        trackSize: new Dimension2( 170, 2 ),
        tick: {
          step: PlinkoConstants.ROWS_RANGE.getLength(),
          minText: Util.toFixed( PlinkoConstants.ROWS_RANGE.min, 0 ),
          maxText: Util.toFixed( PlinkoConstants.ROWS_RANGE.max, 0 )
        }
      }
    } );
    var binaryProbabilitySlider = new SliderWithReadout( {
      buttonStep: 0.01,
      range: PlinkoConstants.BINARY_PROBABILITY_RANGE,
      decimalPlaces: 2,

      title: binaryProbabilityString,
      property: binaryProbabilityProperty,
      slider: {
        trackSize: new Dimension2( 170, 2 ),
        tick: {
          step: PlinkoConstants.BINARY_PROBABILITY_RANGE.getLength(),
          minText: Util.toFixed( PlinkoConstants.BINARY_PROBABILITY_RANGE.min, 0 ),
          maxText: Util.toFixed( PlinkoConstants.BINARY_PROBABILITY_RANGE.max, 0 )
        }
      }
    } );

    rowsSlider.x = 200;
    binaryProbabilitySlider.centerX = rowsSlider.centerX;
    binaryProbabilitySlider.top = rowsSlider.bottom + 30;

    var contentPanel = new Node( {
      children: [ rowsSlider, binaryProbabilitySlider ]
    } );
    var panel = new Panel( contentPanel, {
      fill: 'white',
      xMargin: 10,
      yMargin: 10
    } );
    this.addChild( panel );
  }

  return inherit( Node, SliderControlPanel );
} );
