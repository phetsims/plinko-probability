// Copyright 2015, University of Colorado Boulder

/**
 * Scenery view for the path line followed by a ball on the Galton board.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var Shape = require( 'KITE/Shape' );

  /**
   * Constructor for trajectory path of a ball falling through the galton board
   * @param {Ball} ball - model of the ball
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function TrajectoryPath( ball, modelViewTransform ) {

    var pathOptions = {
      stroke: PlinkoProbabilityConstants.BALL_COLOR,
      lineWidth: 2
    };

    // The trajectory path will be some vertical distance above the pegs.
    // create a vertical offset that is a fraction of the peg separation.
    var verticalOffset = ball.pegSeparation / 2;

    // create the shape of the trajectory
    var shape = new Shape();

    // starting point of the shape is above the first peg plus some vertical offset.
    shape.moveTo(
      ball.pegHistory[ 0 ].positionX,
      ball.pegHistory[ 0 ].positionY + ball.pegSeparation );

    // add linear segments to the shape.
    ball.pegHistory.forEach( function( peg ) {
      shape.lineTo( peg.positionX, peg.positionY + verticalOffset );
    } );

    Path.call( this, modelViewTransform.modelToViewShape( shape ), pathOptions );
  }

  plinkoProbability.register( 'TrajectoryPath', TrajectoryPath );

  return inherit( Path, TrajectoryPath );
} );

