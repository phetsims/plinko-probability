// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the Galton Board ( also known as a bean machine). It consists in a triangular lattice of pegs.
 * Rendering is done by Canvas Node
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PegInterface = require( 'PLINKO_PROBABILITY/common/model/PegInterface' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   *
   * @param {GaltonBoard} galtonBoard
   * @param {Property.<number>} numberOfRowsProperty - an integer
   * @param {Property.<number>} probabilityProperty - a number ranging from 0 to 1
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} [options]
   * @constructor
   */
  function GaltonBoardCanvasNode( galtonBoard, numberOfRowsProperty, probabilityProperty, modelViewTransform, options ) {

    options = _.extend( {
        openingAngle: Math.PI / 2, //  opening angle of the pegs
        rangeRotationAngle: Math.PI / 2 // range of rotation of the peg, when going from binaryProbability 0 to 1.
      },
      options );

    this.options = options;
    var self = this;

    CanvasNode.call( this, options );

    // the peg orientation should be facing up when the probability is 50%
    var leftArcAngle = -Math.PI / 2 + options.rangeRotationAngle * (probabilityProperty.value - 0.5) - options.openingAngle / 2;
    var rightArcAngle = -Math.PI / 2 + options.rangeRotationAngle * (probabilityProperty.value - 0.5) + options.openingAngle / 2;

    var pegRadius = PlinkoConstants.PEG_RADIUS * 26 / 5;
    // create the shape of the peg , a disk with a segment removed, the segment removed spans an angle of options.openingAngle
    var pegShape = new Shape().arc( 0, 0, pegRadius, leftArcAngle, rightArcAngle, true );

    // for each peg, let's create a peg Path and a peg Shadow

    var pegPath = new Path( pegShape, { fill: PlinkoConstants.PEG_COLOR } );
    var pegShadow = new Circle( 1.4 * pegRadius, {
      fill: new RadialGradient(
        pegRadius * 0.3,
        pegRadius * 0.5,
        0,
        pegRadius * 0.1,
        -pegRadius * 0.6,
        pegRadius * 1.4
      )
        .addColorStop( 0, 'rgba(0,0,0,1)' )
        .addColorStop( 0.1809, 'rgba(3,3,3, 0.8191)' )
        .addColorStop( 0.3135, 'rgba(12,12,12, 0.6865)' )
        .addColorStop( 0.4307, 'rgba(28,28,28, 0.5693)' )
        .addColorStop( 0.539, 'rgba(48,48,48, 0.461)' )
        .addColorStop( 0.6412, 'rgba(80,80,80, 0.3588)' )
        .addColorStop( 0.7388, 'rgba(116,116,116, 0.2612)' )
        .addColorStop( 0.8328, 'rgba(158,158,158, 0.1672)' )
        .addColorStop( 0.9217, 'rgba(206,206,206, 0.0783)' )
        .addColorStop( 1, 'rgba(255,255,255, 0.00)' )
    } );


    pegPath.toImage( function( image ) {
      self.pegImage = image;
    } );

    // no need to unlink since it is present for the lifetime of the simulation
    // this handle the rotation of the pegs
    probabilityProperty.lazyLink( function( newProbability, oldProbability ) {
      var newAngle = newProbability * options.rangeRotationAngle;
      var oldAngle = oldProbability * options.rangeRotationAngle;
      var changeAngle = newAngle - oldAngle;
      pegPath.rotateAround( pegPath.center, changeAngle );
      pegPath.toImage( function( image ) {
        self.pegImage = image;
        self.pegImageWidth = image.width;
        self.pegImageHeight = image.height;

      } );
    } );

    pegPath.toImage( function( image ) {
      self.pegImage = image;
    } );

    pegShadow.toImage( function( image ) {
      self.pegShadowImage = image;
      self.pegShadowImageWidth = image.width;
      self.pegShadowImageHeight = image.height;
    } );


    this.galtonBoard = galtonBoard;
    this.numberOfRowsProperty = numberOfRowsProperty;
    this.probabilityProperty = probabilityProperty;
    this.modelViewTransform = modelViewTransform;


    this.invalidatePaint();
  }

  plinkoProbability.register( 'GaltonBoardCanvasNode', GaltonBoardCanvasNode );

  return inherit( CanvasNode, GaltonBoardCanvasNode, {


    /**
     * @param {CanvasRenderingContext2D} context
     * @override
     * @private
     */
    paintCanvas: function( context ) {
      var self = this;

      // Slight chance the image used isn't loaded. In that case, return & try again on next frame
      if ( self.pegImage === null || self.pegShadowImage === null ) {
        return;
      }

      var pegSpacing = PegInterface.getSpacing( self.numberOfRowsProperty.value );
      // offset the center of the shadow with respect to the peg, a bit below and to the left, empirically determined
      var offsetVector = new Vector2( pegSpacing * 0.08, -pegSpacing * 0.24 );

      // render all balls only if 'ball' is the current mode of the Galton Board
      this.galtonBoard.pegs.forEach( function( peg ) {
        // render a ball only if 'ball' is the current mode of the Galton Board
        if ( peg.isVisible ) {
          var pegViewPosition = self.modelViewTransform.modelToViewPosition( peg.position );
          var pegShadowPosition = self.modelViewTransform.modelToViewPosition( peg.position.plus( offsetVector ) );
          var scale = PlinkoConstants.ROWS_RANGE.min / self.numberOfRowsProperty.value;

          context.drawImage( self.pegShadowImage,
            pegShadowPosition.x - self.pegShadowImage.width * scale / 2,
            pegShadowPosition.y - self.pegShadowImage.height * scale / 2,
            self.pegShadowImage.width * scale,
            self.pegShadowImage.height * scale );

          context.drawImage( self.pegImage,
            pegViewPosition.x - self.pegImage.width * scale / 2,
            pegViewPosition.y - self.pegImage.height * scale / 2,
            self.pegImage.width * scale,
            self.pegImage.height * scale );
        }
      } );
    }
  } );
} );
// define

