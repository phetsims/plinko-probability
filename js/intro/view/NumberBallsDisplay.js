// Copyright 2015, University of Colorado Boulder

/**
 * Panel Display of the number of balls that have landed in Plinko Probability Simulation Intro
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var EquationNode = require( 'PLINKO_PROBABILITY/common/view/EquationNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );

  // strings
  var nString = require( 'string!PLINKO_PROBABILITY/n' );

  /**
   *
   * @param {PlinkoProbabilityIntroModel} model
   * @param {Object} [options]
   * @constructor
   */
  function NumberBallsDisplay( model, options ) {

    options = _.extend( {
        minWidth: 200,
        align: 'left'
      },
      options );

    var optionsTitle = {
      leftHandSideFont: PlinkoConstants.TEXT_FONT_BOLD,
      leftHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR,
      rightHandSideFont: PlinkoConstants.TEXT_FONT_BOLD,
      rightHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR,
      maxSigFigs: 0
    };

    var numberLandedBallsText = new EquationNode( nString, 0, optionsTitle );

    model.histogram.on( 'statisticsUpdated', function() {
      numberLandedBallsText.setRightHandSideOfEquation( model.histogram.landedBallsNumber, { maxSigFigs: 0 } );
    } );

    Panel.call( this, numberLandedBallsText, options );

  }

  plinkoProbability.register( 'NumberBallsDisplay', NumberBallsDisplay );

  return inherit( Panel, NumberBallsDisplay, {
    reset: function() {
    }
  } );
} );