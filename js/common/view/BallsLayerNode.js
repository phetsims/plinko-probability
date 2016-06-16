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
   * @param {Object} options - must contain a canvasBounds attribute of type Bounds2
   * @constructor
   */
  function BallsLayerNode( balls, modelViewTransform, options ) {

    assert && assert( options && options.hasOwnProperty( 'canvasBounds' ), 'No canvasBounds specified.' );

    CanvasNode.call( this, options );

    var self = this;

    // @private
    this.balls = balls;

    // @private - model to view coordinate transform
    this.modelViewTransform = modelViewTransform;

    this.defaultNumberOfRows = PlinkoConstants.ROWS_RANGE.defaultValue;
    var defaultBallRadius = modelViewTransform.modelToViewDeltaX( PegInterface.getSpacing( this.defaultNumberOfRows ) * PlinkoConstants.BALL_SIZE_FRACTION)  ; //
    this.defaultBallRadius = defaultBallRadius;
 //   console.log(defaultBallRadius);
    // create a single ball image to use for rendering all balls - asynchronous
    var ball = new BallRepresentationNode( defaultBallRadius );
    ball.toImage( function( image ) {
      self.ballImage = image;
      self.ballImageHalfWidth = self.ballImage.width / 2;
      self.ballImageHalfHeight = self.ballImage.height / 2;
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
      // render all balls
      this.balls.forEach( function( ball ) {
        // render a ball
        var ballViewPosition = self.modelViewTransform.modelToViewPosition( ball.position );
        context.drawImage( self.ballImage,
          ballViewPosition.x - self.ballImageHalfWidth,
          ballViewPosition.y - self.ballImageHalfHeight );
      } );
    }
  } );
} ); // define
