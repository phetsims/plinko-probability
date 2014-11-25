// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the ball.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules

  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Shape = require( 'KITE/Shape' );


  // constants
  var BALL_RADIUS = 10; // radius of the Ball.
  var BALL_COLOR = 'red';


  /**
   * Constructor for the ChargedParticleNode which renders the charge as a scenery node.
   * @param {model} model of the simulation
   * @param {ChargedParticle} chargedParticle : the model of the charged particle
   * @param {ModelViewTransform2} modelViewTransform the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function BallNode( model, ball, modelViewTransform ) {

    var ballNode = this;

    Node.call( this, {renderer: 'svg', rendererOptions: {cssTransform: true}} );
    // Add the centered circle

    var circle = new Circle( BALL_RADIUS, {
      stroke: 'black',
      fill: new RadialGradient( -BALL_RADIUS * 0.4, -BALL_RADIUS * 0.4, 0, -BALL_RADIUS * 0.4, -BALL_RADIUS * 0.4, BALL_RADIUS * 1.6 )
        .addColorStop( 0, 'white' )
        .addColorStop( 1, BALL_COLOR ), centerX: 0, centerY: 0
    } );

    ballNode.addChild( circle );

  }

  return inherit( Node, BallNode );
} );