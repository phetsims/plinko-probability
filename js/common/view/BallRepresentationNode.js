// Copyright 2002-2015, University of Colorado Boulder

/**
 * Scenery node for the representation of a ball falling through the Galton board.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );

  /**
   * Constructor for the which renders the ball as a scenery node.
   * @param {number} radius - in view coordinates
   * @constructor
   */
  function BallRepresentationNode( radius ) {

    Node.call( this );

    //  create the representation for a ball
    var ballRepresentation = new Circle( radius, {
      stroke: PlinkoConstants.BALL_COLOR,
      lineWidth: 0.1 * radius,
      fill: new RadialGradient( -radius * 0.4,
        -radius * 0.4,
        0,
        radius * 0.1,
        -radius * 0.3,
        radius * 0.6 )
        .addColorStop( 0, PlinkoConstants.BALL_HIGHLIGHT_COLOR )
        .addColorStop( 1, PlinkoConstants.BALL_COLOR )
    } );

    this.addChild( ballRepresentation );

  }

  return inherit( Node, BallRepresentationNode );
} );