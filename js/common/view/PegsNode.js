// Copyright 2002-2020, University of Colorado Boulder

/**
 * Renders a triangular lattice of pegs for a Galton board.
 * Implemented using CanvasNode as a performance optimization on iPad.
 *
 * @author Martin Veillette (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import RadialGradient from '../../../../scenery/js/util/RadialGradient.js';
import plinkoProbability from '../../plinkoProbability.js';
import GaltonBoard from '../model/GaltonBoard.js';
import PlinkoProbabilityConstants from '../PlinkoProbabilityConstants.js';

/**
 * @param {GaltonBoard} galtonBoard
 * @param {Property.<number>} numberOfRowsProperty - an integer
 * @param {Property.<number>} probabilityProperty - a number ranging from 0 to 1
 * @param {ModelViewTransform2} modelViewTransform
 * @param {Object} [options]
 * @constructor
 */
function PegsNode( galtonBoard, numberOfRowsProperty, probabilityProperty, modelViewTransform, options ) {

  options = merge( {
    rotatePegs: true, // pegs have a flat surface whose orientation changes with probability
    pegRadius: 50 // radius of peg when the number of rows is 1
  }, options );

  const self = this;

  // NOTE: the pegs are scales inversely proportional to the numberOfBins
  // that is inversely proportional to the number of rows +1

  // for the purposes of drawing the pegs, draw the largest possible peg (i.e. with the minimum number Of rows) in
  // Node and use canvasNode to scale it down, ensuring always a high quality image.
  const largestPegRadius = options.pegRadius * ( 2 / ( PlinkoProbabilityConstants.ROWS_RANGE.min + 1 ) );

  // @private
  this.options = options;
  this.galtonBoard = galtonBoard;
  this.numberOfRowsProperty = numberOfRowsProperty;
  this.probabilityProperty = probabilityProperty;
  this.modelViewTransform = modelViewTransform;

  CanvasNode.call( this, options );

  let pegShape;
  if ( options.rotatePegs ) {

    // flat surface pointing up
    pegShape = new Shape().arc( 0, 0, largestPegRadius, -0.75 * Math.PI, -0.25 * Math.PI, true );
  }
  else {
    pegShape = new Shape().circle( 0, 0, largestPegRadius );
  }

  const pegNode = new Path( pegShape, { fill: PlinkoProbabilityConstants.PEG_COLOR } );

  const shadowNode = new Circle( 1.4 * largestPegRadius, {
    fill: new RadialGradient(
      largestPegRadius * 0.3,
      largestPegRadius * 0.5,
      0,
      largestPegRadius * 0.1,
      -largestPegRadius * 0.6,
      largestPegRadius * 1.4
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

  // Renders the peg to a canvas.
  pegNode.toCanvas( function( canvas, x, y, width, height ) {
    self.pegCanvase = canvas; // @private
    self.invalidatePaint(); // calls paintCanvas
  } );

  // Create an image of the peg shadow. This happens asynchronously.
  shadowNode.toImage( function( image ) {
    self.shadowImage = image; // @private
    self.invalidatePaint(); // calls paintCanvas
  } );

  // Rotate the pegs when probability changes, but only if they have a flat surface.
  // No need to unlink since this instance is present for the lifetime of the simulation.
  if ( options.rotatePegs ) {
    probabilityProperty.lazyLink( function() {
      self.invalidatePaint();
    } );
  }

  // Update the number of pegs.
  // No need to unlink since this instance is present for the lifetime of the simulation.
  numberOfRowsProperty.lazyLink( function() {
    self.invalidatePaint();
  } );

  // calls paintCanvas
  self.invalidatePaint();
}

plinkoProbability.register( 'PegsNode', PegsNode );

export default inherit( CanvasNode, PegsNode, {

  /**
   * @param {CanvasRenderingContext2D} context
   * @override
   * @private
   */
  paintCanvas: function( context ) {

    const self = this;

    // images are created asynchronously by toImage, so they may not be available yet
    if ( !self.pegCanvase || !self.shadowImage ) {
      return;
    }

    // compute values that remain constant in for loop

    // scale peg radius to be inversely proportional to the number of bins
    const pegScale = ( PlinkoProbabilityConstants.ROWS_RANGE.min + 1 ) /
                     ( this.numberOfRowsProperty.get() + 1 );

    const pegWidth = pegScale * self.pegCanvase.width;
    const pegHeight = pegScale * self.pegCanvase.height;
    const shadowWidth = pegScale * self.shadowImage.width;
    const shadowHeight = pegScale * self.shadowImage.height;

    // probability 0.5 has the flat part of the peg facing up
    const pegAngle = -( Math.PI / 4 ) + ( this.probabilityProperty.get() * Math.PI / 2 );

    // shadow offset, a bit below and to the right, determined empirically
    const pegSpacing = GaltonBoard.getPegSpacing( self.numberOfRowsProperty.get() );
    const shadowOffset = self.modelViewTransform.modelToViewDelta( new Vector2( pegSpacing * 0.08, -pegSpacing * 0.24 ) );

    // galtonBoard.pegs contains all the model pegs (even pegs that that are currently invisible)
    this.galtonBoard.pegs.forEach( function( peg ) {
      if ( peg.isVisible ) {

        const pegPosition = self.modelViewTransform.modelToViewPosition( peg.position );
        const shadowPosition = pegPosition.plus( shadowOffset );

        // shadow
        context.drawImage( self.shadowImage,
          shadowPosition.x - shadowWidth / 2, shadowPosition.y - shadowHeight / 2,
          shadowWidth, shadowHeight );

        // rotated peg
        context.save();
        context.translate( pegPosition.x, pegPosition.y );
        context.rotate( pegAngle );
        context.drawImage( self.pegCanvase, -pegWidth / 2, -pegHeight / 2, pegWidth, pegHeight );
        context.restore();
      }
    } );
  }
} );