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
  var inherit = require( 'PHET_CORE/inherit' );
  var Ball = require( 'PLINKO_PROBABILITY/common/model/Ball' );

  /**
   *
   * @param {number} probability - number ranging from 0 to 1
   * @param {number} numberOfRows - an integer
   * @param {Array.<Object>} bins
   * @param {Object} cylinderInfo - information about the cylinder: height, width, offset, ellipseHeight
   * @constructor
   */
  function IntroBall( probability, numberOfRows, bins, cylinderInfo ) {
    Ball.call( this, probability, numberOfRows, bins );
    
    // let's find the ball horizontal orientation of the top ball within a cylinder
    // binOrientation {number||null} takes values -1 (left), 0 (center), 1 (right) or null (no ball are present)
     var lastBallBinOrientation = bins[ this.binIndex ].orientation;
    
    // determine the ball orientation within the bin
    switch( this.binCount % 3 ) {
      case 0:     // a multiple of three, Ball makes decision to be centered
        this.binOrientation = 0;
        break;
      case 1:     // Ball makes probabilistic decision whether to end in left or right horizontal position in the bin
        this.binOrientation = (Math.random() < 0.5) ? 1 : -1;
        break;
      case 2:     // the ball must take the opposite orientation than the last ball 
        this.binOrientation = -lastBallBinOrientation;
        break;
      default:
        throw new Error( 'Unhandled bin direction' );
    }
    
    // @public
    // {number} describes number of rows in the ball stack within a bin starting at 1
    this.binStackLevel = 2 * Math.floor( this.binCount / 3 ) + ((this.binCount % 3 === 0) ? 0 : 1);
    var minimumYposition = cylinderInfo.top - cylinderInfo.verticalOffset - cylinderInfo.ellipseHeight - cylinderInfo.height; // the bottom of the cylinder
    var delta = this.ballRadius + Math.sqrt( Math.pow( 2 * this.ballRadius, 2 ) - Math.pow( (cylinderInfo.cylinderWidth / 2) - this.ballRadius, 2 ) ); // the height separation
    // @public
    // describes final vertical position of ball within a bin {number}
    this.finalBinVerticalPosition = minimumYposition + ((this.binStackLevel - 1) * delta) - this.ballRadius;

    // @public
    // describes final horizontal position of ball within a bin {number}
    this.finalBinHorizontalPosition = (this.binOrientation * ((cylinderInfo.cylinderWidth / 2) - this.ballRadius));

  }

  plinkoProbability.register( 'IntroBall', IntroBall );

  return inherit( Ball, IntroBall );

} );