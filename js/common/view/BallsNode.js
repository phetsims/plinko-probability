// Copyright 2016-2017, University of Colorado Boulder

/**
 * Canvas Node that renders all the scenery balls
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var BallNode = require( 'PLINKO_PROBABILITY/common/view/BallNode' );
  var BallPhase = require( 'PLINKO_PROBABILITY/common/model/BallPhase' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
  var inherit = require( 'PHET_CORE/inherit' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );

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

    var self = this;

    // @private
    this.balls = balls;
    this.numberOfRowsProperty = numberOfRowsProperty;
    this.histogramModeProperty = histogramModeProperty;
    this.modelViewTransform = modelViewTransform;

    // set the default ball radius using the largest possible radius, that is the minimum number of rows.
    var defaultBallRadius = modelViewTransform.modelToViewDeltaX(
      GaltonBoard.getPegSpacing( PlinkoProbabilityConstants.ROWS_RANGE.min ) * PlinkoProbabilityConstants.BALL_SIZE_FRACTION );

    // Create an image of the ball, used for rendering all balls. This happens asynchronously.
    var ballNode = new BallNode( defaultBallRadius );
    ballNode.toImage( function( image ) {
      self.ballImage = image; // @private
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
      if ( !this.ballImage ) { return; }

      // Adjust size of the balls based on the number of rows in the Galton board.
      // scale ball radius to be inversely proportional to (number of bins )

      var scaleFactor = (PlinkoProbabilityConstants.ROWS_RANGE.min + 1) / (this.numberOfRowsProperty.get() + 1);

      var verticalOffset = 0;
      var stopScalingRowNumber = 3;
      // when the number of rows is less than 3, scaling up the ball radius
      // differently
      if ( this.numberOfRowsProperty.get() <= stopScalingRowNumber ) {

        // some ad hoc fudge factor to suppress even more the size of the
        // ball when the number of rows is low
        // (3/4 when row =1, 4/5 when row =2 and 5/6 when row =3)
        var fudgeFactor = ((this.numberOfRowsProperty.get() - 1) + 3) /
                          ((this.numberOfRowsProperty.get() - 1) + 4);
        scaleFactor = scaleFactor * fudgeFactor;

        // offset vertically the ball trajectory down such that they still give
        // the impression to hit the pegs
        verticalOffset = (1 - fudgeFactor) * this.ballImage.height / 2;
      }

      var self = this;
      this.balls.forEach( function( ball ) {

        // don't draw balls in bins (cylinders) when the bins aren't visible
        if ( self.histogramModeProperty.get() === 'cylinder' || ball.phase !== BallPhase.COLLECTED ) {

          var ballViewPositionX = self.modelViewTransform.modelToViewX( ball.position.x );
          var ballViewPositionY = self.modelViewTransform.modelToViewY( ball.position.y );

          context.drawImage( self.ballImage,
            ballViewPositionX - self.ballImage.width * scaleFactor / 2,
            ballViewPositionY - self.ballImage.height * scaleFactor / 2 + verticalOffset,
            self.ballImage.width * scaleFactor,
            self.ballImage.height * scaleFactor );
        }
      } );
    }
  } );
} );
