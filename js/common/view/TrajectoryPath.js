// Copyright 2015, University of Colorado Boulder

/**
 * Scenery view for the path line  followed by a ball on the Galton board.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor for trajectory path of a ball falling through the galton board
   * @param {Ball} ball - model of the ball
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function TrajectoryPath( ball, modelViewTransform ) {

    var pathOptions = {
      stroke: PlinkoConstants.BALL_COLOR,
      lineWidth: 2
    };

    // create the shape of the trajectory
    var shape = new Shape();

    // create a vector representing an up vector with a length given by half of the separation between two rows.
    var verticalVector = new Vector2( 0, ball.pegSeparation/2 );

    // starting point of the shape is above the first peg plus some vertical offset.
    shape.moveToPoint( ball.pegHistory[ 0 ].position.plus( verticalVector.times( 2 ) ) );

    // add linear segments to the shape.
    ball.pegHistory.forEach( function( peg ) {
      // in order to minimize vector allocations, we used the peg position as a mutable object.
      shape.lineToPoint( peg.position.add( verticalVector ) );
    } );

    Path.call( this, modelViewTransform.modelToViewShape( shape ), pathOptions );

  }

  plinkoProbability.register( 'TrajectoryPath', TrajectoryPath );

  return inherit( Path, TrajectoryPath );
} );