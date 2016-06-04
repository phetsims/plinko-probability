// Copyright 2014-2015, University of Colorado Boulder

/**
 * Control Panel for two sliders: rows slider  and binary Probability slider
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var SliderWithReadout = require( 'PLINKO_PROBABILITY/lab/view/SliderWithReadout' );
  var Util = require( 'DOT/Util' );

  // strings
  var rowsString = require( 'string!PLINKO_PROBABILITY/rows' );
  var binaryProbabilityString = require( 'string!PLINKO_PROBABILITY/binaryProbability' );

  /**
   * Constructor for a control panel with two sliders
   * @param {Property.<number>} rowsProperty
   * @param {Property.<number>} binaryProbabilityProperty
   * @param {Object} [options]
   * @constructor
   */
  function SliderControlPanel( rowsProperty, binaryProbabilityProperty, options ) {

    Node.call( this );
    options = _.extend( {
        fill: 'white',
        xMargin: 0,
        yMargin: 8,
        minWidth: 200
      },
      options );

    // tracksize for the slider
    var trackSize = new Dimension2( 170, 2 );

    // create the slider for the rows
    var rowsSlider = new SliderWithReadout( {
      buttonStep: 1,
      title: rowsString,
      titleFont: PlinkoConstants.PANEL_FONT,
      displayFont: PlinkoConstants.PANEL_READOUT_FONT, // font for the numerical display
      titleMaxWidth: options.minWidth,
      property: rowsProperty,
      range: PlinkoConstants.ROWS_RANGE,
      decimalPlaces: 0,
      slider: {
        trackSize: trackSize,
        tick: {
          step: PlinkoConstants.ROWS_RANGE.getLength(),
          minText: Util.toFixed( PlinkoConstants.ROWS_RANGE.min, 0 ),
          maxText: Util.toFixed( PlinkoConstants.ROWS_RANGE.max, 0 )
        }
      }
    } );

    // create the slider for the binary probability
    var binaryProbabilitySlider = new SliderWithReadout( {
      buttonStep: 0.01,
      title: binaryProbabilityString,
      titleFont: PlinkoConstants.PANEL_FONT,
      displayFont: PlinkoConstants.PANEL_READOUT_FONT, // font for the numerical display
      titleMaxWidth: options.minWidth,
      property: binaryProbabilityProperty,
      range: PlinkoConstants.BINARY_PROBABILITY_RANGE,
      decimalPlaces: 2,
      slider: {
        trackSize: trackSize,
        tick: {
          step: PlinkoConstants.BINARY_PROBABILITY_RANGE.getLength(),
          minText: Util.toFixed( PlinkoConstants.BINARY_PROBABILITY_RANGE.min, 0 ),
          maxText: Util.toFixed( PlinkoConstants.BINARY_PROBABILITY_RANGE.max, 0 )
        }
      }
    } );

    // layout the two sliders
    binaryProbabilitySlider.centerX = rowsSlider.centerX;
    binaryProbabilitySlider.top = rowsSlider.bottom + 25;

    // create and add the panel that contains the two sliders
    var contentPanel = new Node( {
      children: [ rowsSlider, binaryProbabilitySlider ]
    } );
    var panel = new Panel( contentPanel, options );
    this.addChild( panel );

  }

  plinkoProbability.register( 'SliderControlPanel', SliderControlPanel );

  return inherit( Node, SliderControlPanel );
} );
