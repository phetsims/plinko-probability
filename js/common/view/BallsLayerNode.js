// Copyright 2002-2016, University of Colorado Boulder

/**
 * Canvas Node that renders all the balls node
 *
 * @author Martin Veillette
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var BallRepresentationNode = require( 'PLINKO_PROBABILITY/common/view/BallRepresentationNode' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var PegInterface = require( 'PLINKO_PROBABILITY/common/model/PegInterface' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );

  /**
   * @param {Ball[]} balls - an array of model Ball
   * @param {ModelViewTransform2} modelViewTransform - model to view transform
   * @param {Property.<string> } galtonBoardRadioButtonProperty - valid values are 'ball', 'path', and 'none'
   * @param {Object} options - must contain a canvasBounds attribute of type Bounds2
   * @constructor
   */
  function BallsLayerNode( balls, modelViewTransform, galtonBoardRadioButtonProperty, options ) {

    assert && assert( options && options.hasOwnProperty( 'canvasBounds' ), 'No canvasBounds specified.' );

    CanvasNode.call( this, options );

    var self = this;

    // @private
    this.balls = balls;

    // @private - model to view coordinate transform
    this.modelViewTransform = modelViewTransform;
    this.galtonBoardRadioButtonProperty = galtonBoardRadioButtonProperty; // valid values are 'ball', 'path', 'none'


    // set the default ball radius using the largest possible radius, that is the minimum number of rows.
    this.defaultNumberOfRows = PlinkoConstants.ROWS_RANGE.min;
    var defaultBallRadius = modelViewTransform.modelToViewDeltaX( PegInterface.getSpacing( this.defaultNumberOfRows ) * PlinkoConstants.BALL_SIZE_FRACTION ); //

    // create a single ball image to use for rendering all balls - asynchronous
    var ball = new BallRepresentationNode( defaultBallRadius );
    ball.toImage( function( image ) {
      self.ballImage = image;
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
      if ( self.ballImage === null ) {
        return;
      }
      // render all balls only if 'ball' is the current mode of the Galton Board
      if ( self.galtonBoardRadioButtonProperty.value === 'ball' ) {
        this.balls.forEach( function( ball ) {
          // render a ball only if 'ball' is the current mode of the Galton Board
          var ballViewPosition = self.modelViewTransform.modelToViewPosition( ball.position );
          var scale = self.defaultNumberOfRows / ball.numberOfRows;
          context.drawImage( self.ballImage,
            ballViewPosition.x - self.ballImage.width * scale / 2,
            ballViewPosition.y - self.ballImage.height * scale / 2,
            self.ballImage.width * scale,
            self.ballImage.height * scale );

        } );
      }
    }
  } );
} ); // define
