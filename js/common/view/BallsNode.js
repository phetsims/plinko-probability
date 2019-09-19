// Copyright 2002-2019, University of Colorado Boulder

/**
 * Canvas Node that renders all the scenery balls
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const BallNode = require( 'PLINKO_PROBABILITY/common/view/BallNode' );
  const BallPhase = require( 'PLINKO_PROBABILITY/common/model/BallPhase' );
  const CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  const GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
  const inherit = require( 'PHET_CORE/inherit' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );

  /**
   * @param {Ball[]} balls - an array of model Ball
   * @param {Property.<number>} numberOfRowsProperty - number of rows
   * @param {Property.<string>} histogramModeProperty - see PlinkoProbabilityCommonView
   * @param {ModelViewTransform2} modelViewTransform - model to view transform
   * @param {Object} options - must contain a canvasBounds attribute of type Bounds2
   * @constructor
   */
  function BallsNode( balls, numberOfRowsProperty, histogramModeProperty, modelViewTransform, options ) {

    assert && assert( options && options.hasOwnProperty( 'canvasBounds' ), 'No canvasBounds specified.' );

    CanvasNode.call( this, options );

    const self = this;

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
    ballNode.toCanvas( function( canvas, x, y, width, height ) {
      self.ballCanvas = canvas; // @private
      self.invalidatePaint(); // calls paintCanvas
    } );

    // calls paintCanvas
    this.invalidatePaint();
  }

  plinkoProbability.register( 'BallsNode', BallsNode );

  return inherit( CanvasNode, BallsNode, {

    /**
     * @param {CanvasRenderingContext2D} context
     * @override
     * @private
     */
    paintCanvas: function( context ) {

      // image is created asynchronously by toImage, so it may not be available yet
      if ( !this.ballCanvas ) { return; }

      // Adjust size of the balls based on the number of rows in the Galton board.
      // scale ball radius to be inversely proportional to (number of bins )

      let scaleFactor = (PlinkoProbabilityConstants.ROWS_RANGE.min + 1) / (this.numberOfRowsProperty.get() + 1);

      let verticalOffset = 0;
      const stopScalingRowNumber = 3;
      // when the number of rows is less than 3, scaling up the ball radius
      // differently
      if ( this.numberOfRowsProperty.get() <= stopScalingRowNumber ) {

        // some ad hoc fudge factor to suppress even more the size of the
        // ball when the number of rows is low
        // (3/4 when row =1, 4/5 when row =2 and 5/6 when row =3)
        const fudgeFactor = ((this.numberOfRowsProperty.get() - 1) + 3) /
                          ((this.numberOfRowsProperty.get() - 1) + 4);
        scaleFactor = scaleFactor * fudgeFactor;

        // offset vertically the ball trajectory down such that they still give
        // the impression to hit the pegs
        verticalOffset = ( 1 - fudgeFactor ) * this.ballCanvas.height / 2;
      }

      const self = this;
      this.balls.forEach( function( ball ) {

        // don't draw balls in bins (cylinders) when the bins aren't visible
        if ( self.histogramModeProperty.get() === 'cylinder' || ball.phase !== BallPhase.COLLECTED ) {

          const ballViewPositionX = self.modelViewTransform.modelToViewX( ball.position.x );
          const ballViewPositionY = self.modelViewTransform.modelToViewY( ball.position.y );

          context.drawImage( self.ballCanvas,
            ballViewPositionX - self.ballCanvas.width * scaleFactor / 2,
            ballViewPositionY - self.ballCanvas.height * scaleFactor / 2 + verticalOffset,
            self.ballCanvas.width * scaleFactor,
            self.ballCanvas.height * scaleFactor );
        }
      } );
    }
  } );
} );
