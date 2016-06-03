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

    // the trajectory path should not be on the pegs itself but shifted up by a vertical offset.
    // the vertical offset should be a fraction of the pegSeparation (less than 1)
    var verticalOffset = (1/2)*ball.pegSeparation ;

    // starting point of the shape is above the first peg plus some vertical offset.
    shape.moveTo( ball.pegHistory[ 0 ].positionX, ball.pegHistory[ 0 ].positionY +  ball.pegSeparation );

    // add linear segments to the shape.
    ball.pegHistory.forEach( function( peg ) {
      shape.lineTo( peg.positionX, peg.positionY + verticalOffset );
    } );

    Path.call( this, modelViewTransform.modelToViewShape( shape ), pathOptions );

  }

  plinkoProbability.register( 'TrajectoryPath', TrajectoryPath );

  return inherit( Path, TrajectoryPath );
} );