// Copyright 2016-2017, University of Colorado Boulder

/**
 * Ball model for lab tab in Plinko Probability
 * This ball inherits from the common ball model
 * This sets the vertical location in which the ball should disappear
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Ball = require( 'PLINKO_PROBABILITY/common/model/Ball' );
  var inherit = require( 'PHET_CORE/inherit' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );

  /**
   * @param {number} probability - number ranging from 0 to 1
   * @param {number} numberOfRows - an integer
   * @param {Object[]} bins
   * @constructor
   */
  function LabBall( probability, numberOfRows, bins ) {

    Ball.call( this, probability, numberOfRows, bins );

    // @public Describes the final vertical offset (measured from the bottom of the galton board) of ball within a bin.
    // The value is a small distance below the top of the histogram.
    // This field is owned by the supertype, but set here because it depends on other things computed in Ball.
    this.finalBinVerticalOffset = PlinkoProbabilityConstants.HISTOGRAM_BOUNDS.maxY - 6 * this.ballRadius;
  }

  plinkoProbability.register( 'LabBall', LabBall );

  return inherit( Ball, LabBall );

} );

