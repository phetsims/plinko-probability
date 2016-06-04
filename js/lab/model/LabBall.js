// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for Ball in Plinko Probability
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Ball = require( 'PLINKO_PROBABILITY/common/model/Ball' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );

  /**
   *
   * @param {number} probability - number ranging from 0 to 1
   * @param {number} numberOfRows - an integer
   * @param {Array.<Object>} bins
   * @constructor
   */
  function LabBall( probability, numberOfRows, bins ) {
    Ball.call( this, probability, numberOfRows, bins );
    var bounds = PlinkoConstants.HISTOGRAM_BOUNDS;
    // @private
    //describes the minimumYposition the ball will take
    var minimumYposition = bounds.maxY - (bounds.height * .74); // the bottom of the cylinder
    // @public
    // describes final vertical position of ball within a bin {number}
    this.finalBinVerticalPosition = minimumYposition;

    // @public
    // describes final horizontal position of ball within a bin {number}
    this.finalBinHorizontalPosition = 0;

  }

  plinkoProbability.register( 'LabBall', LabBall );

  return inherit( Ball, LabBall );

} );