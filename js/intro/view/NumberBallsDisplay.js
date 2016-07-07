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
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );

  // strings
  var nString = require( 'string!PLINKO_PROBABILITY/n' );

  /**
   * Creates display for number of balls that have fallen
   * @param {Histogram} histogram
   * @param {Object} [options]
   * @constructor
   */

  function NumberBallsDisplay( histogram, options ) {

    options = _.extend( {
        minWidth: 214, // left border of panel is aligned with the left border of the play panel.
        align: 'left'
      },
      options );

    var optionsTitle = {
      leftHandSideFont: PlinkoConstants.TEXT_FONT_BOLD,
      leftHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR,
      rightHandSideFont: PlinkoConstants.TEXT_FONT_BOLD,
      rightHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR,
      maxDecimalPlaces: 0
    };


    var numberLandedBallsText = new EquationNode( nString, 0, optionsTitle );

    histogram.on( 'statisticsUpdated', function() {
      numberLandedBallsText.setRightHandSideOfEquation( histogram.landedBallsNumber );
    } );

    Panel.call( this, numberLandedBallsText, options );

  }

  plinkoProbability.register( 'NumberBallsDisplay', NumberBallsDisplay );

  return inherit( Panel, NumberBallsDisplay );
} );