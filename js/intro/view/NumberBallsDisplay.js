// Copyright 2015-2016, University of Colorado Boulder

/**
 * Panel Display of the number of balls that have landed in Plinko Probability Simulation Intro
 *
 * @author Martin Veillette (Berea College)
 */

define( require => {
  'use strict';

  // modules
  const EquationNode = require( 'PLINKO_PROBABILITY/common/view/EquationNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Panel = require( 'SUN/Panel' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );

  // strings
  const nString = require( 'string!PLINKO_PROBABILITY/n' );

  /**
   * @param {Histogram} histogram
   * @param {Object} [options]
   * @constructor
   */
  function NumberBallsDisplay( histogram, options ) {

    options = _.extend( {
      minWidth: 214, // left border of panel is aligned with the left border of the play panel.
      align: 'left',
      yMargin: 7.5
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