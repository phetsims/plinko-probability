// Copyright 2014-2016, University of Colorado Boulder

/**
 * Ball model for Intro screen of Plinko Probability
 * This model inherits from the common ball and adds the information needed
 * to place the ball correctly in the cylinder
 * The ball determines its position based on the position and direction in the cylinder
 * of the last ball
 * it also calculates the height it should fall so that we get the a natural stack look.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Ball = require( 'PLINKO_PROBABILITY/common/model/Ball' );
  var inherit = require( 'PHET_CORE/inherit' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );

  /**
   * @param {number} probability - number ranging from 0 to 1
   * @param {number} numberOfRows - an integer
   * @param {Array.<Object>} bins
   * @param {Object} cylinderInfo - information about the cylinder: height, width, offset, ellipseHeight
   * @constructor
   */
  function IntroBall( probability, numberOfRows, bins, cylinderInfo ) {

    Ball.call( this, probability, numberOfRows, bins );

    // let's find the ball horizontal orientation of the top ball within a cylinder
    var lastBallBinOrientation = bins[ this.binIndex ].orientation;

    // @public (read-only) the ball's orientation within the bin
    // Values are: -1 (left), 0 (center), 1 (right) or null (no ball are present)
    this.binOrientation = 0;
    switch ( this.binCount % 3 ) {

      // a multiple of three, Ball makes decision to be centered
      case 0:
        this.binOrientation = 0; // @public (read-only)
        break;

      // Ball makes probabilistic decision whether to end in left or right horizontal position in the bin
      case 1:
        this.binOrientation = ( phet.joist.random.nextBoolean() ? 1 : -1 );
        break;

      // the ball must take the opposite orientation than the last ball
      case 2:
        this.binOrientation = -lastBallBinOrientation;
        break;

      default:
        throw new Error( 'invalid binOrientation: ' + this.binOrientation );
    }

    // {number} describes number of rows in the ball stack within a bin, starting at 1
    var binStackLevel = 2 * Math.floor( this.binCount / 3 ) + ( ( this.binCount % 3 === 0 ) ? 0 : 1 ); // number of balls per stack goes as (2,1,2,1,2...

    // {number} describes lowest point of cylinder that a ball will reach (bottom of the cylinder)
    var yMinimum = cylinderInfo.top - cylinderInfo.verticalOffset - cylinderInfo.ellipseHeight - cylinderInfo.height;

    // {number} describes the height difference between two balls in two adjacent rows in a ball stack
    var deltaY = this.ballRadius + Math.sqrt( Math.pow( 2 * this.ballRadius, 2 ) - Math.pow( ( cylinderInfo.cylinderWidth / 2 ) - this.ballRadius, 2 ) );

    // @public {number} describes final vertical offset of ball within a bin {number}
    // This field is owned by the supertype, but set here because it depends on other things computed in Ball.
    this.finalBinVerticalOffset = yMinimum + ( ( binStackLevel - 1 ) * deltaY ) - this.ballRadius;

    // @public {number} describes final horizontal offset of the ball within a bin {number}
    // This field is owned by the supertype, but set here because it depends on other things computed in Ball.
    this.finalBinHorizontalOffset = ( this.binOrientation * ( ( cylinderInfo.cylinderWidth / 2 ) - this.ballRadius ) );
  }

  plinkoProbability.register( 'IntroBall', IntroBall );

  return inherit( Ball, IntroBall );
} );

