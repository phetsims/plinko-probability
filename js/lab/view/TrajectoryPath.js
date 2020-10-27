// Copyright 2015-2020, University of Colorado Boulder

/**
 * Scenery view for the path line followed by a ball on the Galton board.
 *
 * @author Martin Veillette (Berea College)
 */

import Shape from '../../../../kite/js/Shape.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import PlinkoProbabilityConstants from '../../common/PlinkoProbabilityConstants.js';
import plinkoProbability from '../../plinkoProbability.js';

class TrajectoryPath extends Path {
  /**
   * Constructor for trajectory path of a ball falling through the galton board
   * @param {Ball} ball - model of the ball
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   */
  constructor( ball, modelViewTransform ) {

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
    ball.pegHistory.forEach( peg => {
      shape.lineTo( peg.positionX, peg.positionY + verticalOffset );
    } );

    super( modelViewTransform.modelToViewShape( shape ), pathOptions );
  }
}

plinkoProbability.register( 'TrajectoryPath', TrajectoryPath );

export default TrajectoryPath;