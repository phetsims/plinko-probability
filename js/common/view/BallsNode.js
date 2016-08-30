// Copyright 2002-2016, University of Colorado Boulder

/**
 * Canvas Node that renders all the scenery balls
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var BallNode = require( 'PLINKO_PROBABILITY/common/view/BallNode' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );

  //constants
  var PHASE_COLLECTED = 3; // the ball has landed on its final position

  /**
   * @param {Ball[]} balls - an array of model Ball
   * @param {ModelViewTransform2} modelViewTransform - model to view transform
   * @param {Property.<number>} numberOfRowsProperty - number of rows
   * @param {Property.<string>} histogramModeProperty - see PlinkoProbabilityCommonView
   * @param {Property.<string>} hopperModeProperty - see PlinkoProbabilityCommonModel
   * @param {Object} options - must contain a canvasBounds attribute of type Bounds2
   * @constructor
   */
  function BallsNode( balls, modelViewTransform, numberOfRowsProperty, histogramModeProperty, hopperModeProperty, options ) {

    assert && assert( options && options.hasOwnProperty( 'canvasBounds' ), 'No canvasBounds specified.' );

    CanvasNode.call( this, options );

    var self = this;

    // @private
    this.balls = balls;
    this.modelViewTransform = modelViewTransform;
    this.histogramModeProperty = histogramModeProperty;
    this.hopperModeProperty = hopperModeProperty;

    // set the default ball radius using the largest possible radius, that is the minimum number of rows.
    var defaultNumberOfRows = PlinkoProbabilityConstants.ROWS_RANGE.min;
    var defaultBallRadius = modelViewTransform.modelToViewDeltaX( GaltonBoard.getPegSpacing( defaultNumberOfRows ) * PlinkoProbabilityConstants.BALL_SIZE_FRACTION );

    // Create an image of the ball, to bw used for rendering all balls. This happens asynchronously.
    var ballNode = new BallNode( defaultBallRadius );
    ballNode.toImage( function( image ) {
      self.ballImage = image; // @private
      self.invalidatePaint(); // calls paintCanvas
    } );

    numberOfRowsProperty.link( function( numberOfRows ) {
      self.scaleFactor = defaultNumberOfRows / numberOfRows;
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
      var self = this;

      // image is created asynchronously by toImage, so it may not be available yet
      if ( !self.ballImage ) {
        return;
      }

      // render all balls only if 'ball' is the current hopper mode
      if ( self.hopperModeProperty.value === 'ball' ) {
        this.balls.forEach( function( ball ) {

          // when we are in the histogram mode and the ball has been collected don't draw the ball
          if ( !(self.histogramModeProperty.value === 'counter' && ball.phase === PHASE_COLLECTED) ) {
            var ballViewPositionX = self.modelViewTransform.modelToViewX( ball.position.x );
            var ballViewPositionY = self.modelViewTransform.modelToViewY( ball.position.y );

            context.drawImage( self.ballImage,
              ballViewPositionX - self.ballImage.width * self.scaleFactor / 2,
              ballViewPositionY - self.ballImage.height * self.scaleFactor / 2,
              self.ballImage.width * self.scaleFactor,
              self.ballImage.height * self.scaleFactor );
          }
        } );
      }
    }
  } );
} );
