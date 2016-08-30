// Copyright 2015, University of Colorado Boulder

/**
 * Panel Display of the number of balls that have landed in Plinko Probability Simulation Intro
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var EquationNode = require( 'PLINKO_PROBABILITY/common/view/EquationNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );

  // strings
  var nString = require( 'string!PLINKO_PROBABILITY/n' );

  /**
   * @param {Histogram} histogram
   * @param {Object} [options]
   * @constructor
   */
  function NumberBallsDisplay( histogram, options ) {

    options = _.extend( {
      minWidth: 214, // left border of panel is aligned with the left border of the play panel.
      align: 'left'
    }, options );

    var optionsTitle = {
      leftHandSideFont: PlinkoProbabilityConstants.TEXT_FONT_BOLD,
      leftHandSideFill: PlinkoProbabilityConstants.SAMPLE_FONT_COLOR,
      rightHandSideFont: PlinkoProbabilityConstants.TEXT_FONT_BOLD,
      rightHandSideFill: PlinkoProbabilityConstants.SAMPLE_FONT_COLOR,
      maxDecimalPlaces: 0
    };

    var numberLandedBallsText = new EquationNode( nString, 0, optionsTitle );

    histogram.histogramUpdatedEmitter.addListener( function() {
      numberLandedBallsText.setRightHandSideOfEquation( histogram.landedBallsNumber );
    } );

    Panel.call( this, numberLandedBallsText, options );
  }

  plinkoProbability.register( 'NumberBallsDisplay', NumberBallsDisplay );

  return inherit( Panel, NumberBallsDisplay );
} );