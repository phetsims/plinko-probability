// Copyright 2002-2021, University of Colorado Boulder

/**
 * Canvas Node that renders all the scenery balls
 *
 * @author Martin Veillette (Berea College)
 */

import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import plinkoProbability from '../../plinkoProbability.js';
import BallPhase from '../model/BallPhase.js';
import GaltonBoard from '../model/GaltonBoard.js';
import PlinkoProbabilityConstants from '../PlinkoProbabilityConstants.js';
import BallNode from './BallNode.js';

class BallsNode extends CanvasNode {
  /**
   * @param {Ball[]} balls - an array of model Ball
   * @param {Property.<number>} numberOfRowsProperty - number of rows
   * @param {Property.<string>} histogramModeProperty - see PlinkoProbabilityCommonView
   * @param {ModelViewTransform2} modelViewTransform - model to view transform
   * @param {Object} config - must contain a canvasBounds attribute of type Bounds2
   */
  constructor( balls, numberOfRowsProperty, histogramModeProperty, modelViewTransform, config ) {
    config = merge( {

      // {Bounds2}
      canvasBounds: required( config.canvasBounds )
    }, config );

    super( config );


    // @private
    this.balls = balls;
    this.numberOfRowsProperty = numberOfRowsProperty;
    this.histogramModeProperty = histogramModeProperty;
    this.modelViewTransform = modelViewTransform;

    // set the default ball radius using the largest possible radius, that is the minimum number of rows.
    const defaultBallRadius = modelViewTransform.modelToViewDeltaX(
      GaltonBoard.getPegSpacing( PlinkoProbabilityConstants.ROWS_RANGE.min ) * PlinkoProbabilityConstants.BALL_SIZE_FRACTION );

    // Renders the ball to a canvas, used for rendering all balls.
    const ballNode = new BallNode( defaultBallRadius );
    ballNode.toCanvas( ( canvas, x, y, width, height ) => {
      this.ballCanvas = canvas; // @private
      this.invalidatePaint(); // calls paintCanvas
    } );

    // calls paintCanvas
    this.invalidatePaint();
  }


  /**
   * @param {CanvasRenderingContext2D} context
   * @override
   * @private
   */
  paintCanvas( context ) {

    // image is created asynchronously by toImage, so it may not be available yet
    if ( !this.ballCanvas ) { return; }

    // Adjust size of the balls based on the number of rows in the Galton board.
    // scale ball radius to be inversely proportional to (number of bins )

    let scaleFactor = ( PlinkoProbabilityConstants.ROWS_RANGE.min + 1 ) / ( this.numberOfRowsProperty.get() + 1 );

    let verticalOffset = 0;
    const stopScalingRowNumber = 3;
    // when the number of rows is less than 3, scaling up the ball radius
    // differently
    if ( this.numberOfRowsProperty.get() <= stopScalingRowNumber ) {

      // some ad hoc fudge factor to suppress even more the size of the
      // ball when the number of rows is low
      // (3/4 when row =1, 4/5 when row =2 and 5/6 when row =3)
      const fudgeFactor = ( ( this.numberOfRowsProperty.get() - 1 ) + 3 ) /
                          ( ( this.numberOfRowsProperty.get() - 1 ) + 4 );
      scaleFactor = scaleFactor * fudgeFactor;

      // offset vertically the ball trajectory down such that they still give
      // the impression to hit the pegs
      verticalOffset = ( 1 - fudgeFactor ) * this.ballCanvas.height / 2;
    }

    this.balls.forEach( ball => {

      // don't draw balls in bins (cylinders) when the bins aren't visible
      if ( this.histogramModeProperty.get() === 'cylinder' || ball.phase !== BallPhase.COLLECTED ) {

        const ballViewPositionX = this.modelViewTransform.modelToViewX( ball.position.x );
        const ballViewPositionY = this.modelViewTransform.modelToViewY( ball.position.y );

        context.drawImage( this.ballCanvas,
          ballViewPositionX - this.ballCanvas.width * scaleFactor / 2,
          ballViewPositionY - this.ballCanvas.height * scaleFactor / 2 + verticalOffset,
          this.ballCanvas.width * scaleFactor,
          this.ballCanvas.height * scaleFactor );
      }
    } );
  }
}

plinkoProbability.register( 'BallsNode', BallsNode );

export default BallsNode;