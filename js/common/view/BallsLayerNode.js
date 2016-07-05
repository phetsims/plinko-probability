// Copyright 2002-2016, University of Colorado Boulder

/**
 * Canvas Node that renders all the scenery balls
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var BallRepresentationNode = require( 'PLINKO_PROBABILITY/common/view/BallRepresentationNode' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PegInterface = require( 'PLINKO_PROBABILITY/common/model/PegInterface' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );

  //constants
  var PHASE_COLLECTED = 3; // the ball has landed on its final position

  /**
   * @param {Ball[]} balls - an array of model Ball
   * @param {ModelViewTransform2} modelViewTransform - model to view transform
   * @param {Property.<number>} numberOfRowsProperty - number of rows
   * @param {Property.<string>} histogramRadioProperty - valid values are 'counter', 'cylinder', and 'fraction
   * @param {Property.<string>} galtonBoardRadioButtonProperty - valid values are 'ball', 'path', and 'none'
   * @param {Object} options - must contain a canvasBounds attribute of type Bounds2
   * @constructor
   */
  function BallsLayerNode( balls, modelViewTransform, numberOfRowsProperty, histogramRadioProperty, galtonBoardRadioButtonProperty, options ) {

    assert && assert( options && options.hasOwnProperty( 'canvasBounds' ), 'No canvasBounds specified.' );

    CanvasNode.call( this, options );

    var self = this;

    // @private
    this.balls = balls;

    // @private - model to view coordinate transform
    this.modelViewTransform = modelViewTransform;

    // @private
    this.galtonBoardRadioButtonProperty = galtonBoardRadioButtonProperty; // valid values are 'ball', 'path', 'none'

    // @private
    this.histogramRadioProperty = histogramRadioProperty;
    // set the default ball radius using the largest possible radius, that is the minimum number of rows.
    var defaultNumberOfRows = PlinkoConstants.ROWS_RANGE.min;
    var defaultBallRadius = modelViewTransform.modelToViewDeltaX( PegInterface.getSpacing( defaultNumberOfRows ) * PlinkoConstants.BALL_SIZE_FRACTION ); //

    // create a single ball image to use for rendering all balls - asynchronous
    var ball = new BallRepresentationNode( defaultBallRadius );

    // create an image of the ball representation
    ball.toImage( function( image ) {
      self.ballImage = image;
    } );


    numberOfRowsProperty.link( function( numberOfRows ) {
      self.scaleFactor = defaultNumberOfRows / numberOfRows;
    } );

    this.invalidatePaint();
  }

  plinkoProbability.register( 'BallsLayerNode', BallsLayerNode );

  return inherit( CanvasNode, BallsLayerNode, {


    /**
     * @param {CanvasRenderingContext2D} context
     * @override
     * @private
     */
    paintCanvas: function( context ) {
      var self = this;

      // Slight chance the image used isn't loaded. In that case, return & try again on next frame
      if ( !self.ballImage ) {
        return;
      }

      // render all balls only if 'ball' is the current mode of the Galton Board
      if ( self.galtonBoardRadioButtonProperty.value === 'ball' ) {
        this.balls.forEach( function( ball ) {

          // when we are in the histogram mode and the ball has been collected don't draw the ball
          if ( !(self.histogramRadioProperty.value === 'counter' && ball.phase === PHASE_COLLECTED) ) {
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
} ); // define
