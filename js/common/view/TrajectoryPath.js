// Copyright 2015, University of Colorado Boulder

/**
 * Scenery view for the path through the Galton board.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor for the which renders the charge as a scenery node.
   * @param {Ball} ball - model of the ball
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function TrajectoryPath( ball, modelViewTransform ) {

    //  create the representation for a ball
    var pathOptions = {
      stroke: PlinkoConstants.BALL_COLOR,
      lineWidth: 2
    };

    var shape = new Shape();

    shape.moveToPoint( ball.pegHistory[ 0 ].position.plus( new Vector2( 0, ball.pegSeparation ) ) );

    ball.pegHistory.forEach( function( peg ) {
      shape.lineToPoint( peg.position.plus( new Vector2( 0, ball.pegSeparation * 0.5 ) ) );
    } );

    Path.call( this, modelViewTransform.modelToViewShape( shape ), pathOptions );

  }

  return inherit( Path, TrajectoryPath );
} );