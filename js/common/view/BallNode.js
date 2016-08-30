// Copyright 2015-2016, University of Colorado Boulder

/**
 * Scenery node that represents a ball.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );

  /**
   * @param {number} radius - in view coordinates
   * @constructor
   */
  function BallNode( radius ) {

    // gives the ball a specular highlight
    var gradient = new RadialGradient(
      -radius * 0.4, -radius * 0.4, 0,  // x0, y0, r0
      radius * 0.1, -radius * 0.3, radius * 0.6 ) // x1, y1, r1
      .addColorStop( 0, PlinkoProbabilityConstants.BALL_HIGHLIGHT_COLOR )
      .addColorStop( 1, PlinkoProbabilityConstants.BALL_COLOR );

    Circle.call( this, radius, {
      stroke: PlinkoProbabilityConstants.BALL_COLOR,
      lineWidth: 0.1 * radius,
      fill: gradient
    } );
  }

  plinkoProbability.register( 'BallNode', BallNode );

  return inherit( Circle, BallNode );
} );