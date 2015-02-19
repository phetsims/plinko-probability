// Copyright 2002-2015, University of Colorado Boulder

/**
 * Scenery node for ball falling through the Galton board.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules

  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
//  var Path = require( 'SCENERY/nodes/Path' );
  var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  // var Shape = require( 'KITE/Shape' );

  /**
   * Constructor for the which renders the charge as a scenery node.
   * @param {Ball} ball - model of the ball
   * @param {PlinkoProbabilityModel} model
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function BallNode( ball, model, modelViewTransform ) {

    var ballNode = this;

    Node.call( this );

    //  create the representation for a ball
    var ballRepresentation = new Circle( PlinkoConstants.BALL_RADIUS, {
      stroke: PlinkoConstants.BALL_COLOR,
      lineWidth: 2,
      fill: new RadialGradient( -PlinkoConstants.BALL_RADIUS * 0.4,
        -PlinkoConstants.BALL_RADIUS * 0.4,
        0,
        PlinkoConstants.BALL_RADIUS * 0.1,
        -PlinkoConstants.BALL_RADIUS * 0.3,
        PlinkoConstants.BALL_RADIUS * 0.6 )
        .addColorStop( 0, PlinkoConstants.BALL_HIGHLIGHT_COLOR )
        .addColorStop( 1, PlinkoConstants.BALL_COLOR )
    } );

    ballNode.addChild( ballRepresentation );

    ball.positionProperty.link( function( position ) {
      ballNode.center = modelViewTransform.modelToViewPosition(
        position.componentTimes( {
          x: 2 / (model.numberOfRowsProperty.value + 1),
          y: -1 / (model.numberOfRowsProperty.value)
        } ) );
    } );

    model.numberOfRowsProperty.link( function( numberOfRows ) {
      ballNode.setScaleMagnitude( 26 / numberOfRows );
    } );

  }

  return inherit( Node, BallNode );
} );