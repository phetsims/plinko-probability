// Copyright 2015-2016, University of Colorado Boulder

/**
 * Scenery view for the path line followed by a ball on the Galton board.
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Path = require( 'SCENERY/nodes/Path' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  const Shape = require( 'KITE/Shape' );

  /**
   * Constructor for trajectory path of a ball falling through the galton board
   * @param {Ball} ball - model of the ball
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function TrajectoryPath( ball, modelViewTransform ) {

    const pathOptions = {
      stroke: PlinkoProbabilityConstants.BALL_COLOR,
      lineWidth: 2
    };

    // The trajectory path will be some vertical distance above the pegs.
    // create a vertical offset that is a fraction of the peg separation.
    const verticalOffset = ball.pegSeparation / 2;

    // create the shape of the trajectory
    const shape = new Shape();

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

