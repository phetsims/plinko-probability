// Copyright 2014-2015, University of Colorado Boulder

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
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );

  /**
   *
   * @param {number} probability - number ranging from 0 to 1
   * @param {number} numberOfRows - an integer
   * @param {Array.<Object>} bins
   * @constructor
   */
  function LabBall( probability, numberOfRows, bins ) {

    Ball.call( this, probability, numberOfRows, bins );

    var bounds = PlinkoProbabilityConstants.HISTOGRAM_BOUNDS;

    //describes the minimum y position the ball will take
    var yMin = bounds.maxY - 6 * this.ballRadius; // let the ball fall a small distance below the top of the histogram.

    // describes final vertical position offset (measure from the bottom of the galton board) of ball within a bin {number}
    this.finalBinVerticalOffset = yMin;

    // describes final horizontal offset (measured from the middle position) of ball within a bin {number}
    this.finalBinHorizontalOffset = 0;
  }

  plinkoProbability.register( 'LabBall', LabBall );

  return inherit( Ball, LabBall );

} );

