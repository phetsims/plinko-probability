// Copyright 2002-2015, University of Colorado Boulder

/**
 * View for the falling ball.
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
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  // var Shape = require( 'KITE/Shape' );


  // constants
  var BALL_RADIUS = 4; // radius of the Ball.
  var BALL_COLOR = 'red';


  /**
   * Constructor for the ChargedParticleNode which renders the charge as a scenery node.
   * @param {ball} model of the simulation
   * @param {ModelViewTransform2} modelViewTransform the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function BallNode( ball, modelViewTransform ) {

    var ballNode = this;
    this.ball = ball;
    this.modelViewTransform = modelViewTransform;

    Node.call( this, {renderer: 'svg', rendererOptions: {cssTransform: true}} );
    // Add the centered circle

    this.circle = new Circle( BALL_RADIUS, {
      stroke: 'black',
      fill: new RadialGradient( -BALL_RADIUS * 0.4, -BALL_RADIUS * 0.4, 0, -BALL_RADIUS * 0.4, -BALL_RADIUS * 0.4, BALL_RADIUS * 1.6 )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, BALL_COLOR ), centerX: 0, centerY: 0
    } );

    ballNode.addChild( this.circle );

    ball.positionProperty.link( function( position ) {
      ballNode.center = modelViewTransform.modelToViewPosition( position );
    } );


  }

  return inherit( Node, BallNode, {
    update: function() {
      this.circle.center = this.modelViewTransform.modelToViewPosition( this.ball.position );
    }
  } );
} );