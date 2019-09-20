// Copyright 2015-2019, University of Colorado Boulder

/**
 * View representation of the top portion of the row of cylinders
 * it is the back portion of the cylinder from the viewpoint of the z-layer
 * used within the Plinko Probability Simulation
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  const Shape = require( 'KITE/Shape' );

  // constants
  const BOUNDS = PlinkoProbabilityConstants.HISTOGRAM_BOUNDS;

  /**
   * @param {Property.<number>} numberOfRowsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} cylinderInfo - Contains cylinder info: height, width, offset, ellipseHeight
   * @constructor
   */
  function CylindersBackNode( numberOfRowsProperty, modelViewTransform, cylinderInfo ) {

    Node.call( this );

    const self = this;

    // convenience variables
    const ellipseWidth = modelViewTransform.modelToViewDeltaX( cylinderInfo.cylinderWidth );
    const ellipseHeight = Math.abs( modelViewTransform.modelToViewDeltaY( cylinderInfo.ellipseHeight ) );
    const verticalOffset = -modelViewTransform.modelToViewDeltaY( cylinderInfo.verticalOffset );

    // create the shape for the top of the cylinder
    const topShape = Shape.ellipse( 0, 0, ellipseWidth / 2, ellipseHeight / 2 );

    // link present for the lifetime of the sim, no need to dispose
    numberOfRowsProperty.link( function( numberOfRows ) {
      assert && assert( Number.isInteger( numberOfRows ), 'numberOfRows must be an integer' );

      const numberOfCylinders = numberOfRows + 1;
      for ( let i = 0; i < numberOfCylinders; i++ ) {
        // create and add the top of the cylinders containers
        const binCenterX = self.getBinCenterX( i, numberOfCylinders );
        const x = modelViewTransform.modelToViewX( binCenterX );          // x-coordinate of bin in model units
        const y = modelViewTransform.modelToViewY( cylinderInfo.top );    // y-coordinate of bin in model units
        const top = new Path( topShape, {
          fill: PlinkoProbabilityConstants.TOP_CYLINDER_FILL_COLOR,
          stroke: PlinkoProbabilityConstants.TOP_CYLINDER_STROKE_COLOR,
          centerX: x,
          top: y + verticalOffset
        } );
        self.addChild( top );
      }
    } );
  }

  plinkoProbability.register( 'CylindersBackNode', CylindersBackNode );

  return inherit( Node, CylindersBackNode, {

    /**
     * Function that returns the center x coordinate of a bin with index binIndex
     *
     * @param {number} binIndex - index associated with the bin, the index may range from 0 to numberOfBins-1
     * @param {number} numberOfBins - the number of bins on the screen
     * @returns {number}
     * @public (read-only)
     */
    getBinCenterX: function( binIndex, numberOfBins ) {
      // We consider numberOfBins-1 because we consider the most left bin the first bin out of the total number of bins
      assert && assert( binIndex <= numberOfBins - 1 );
      return ((binIndex + 1 / 2) / numberOfBins) * BOUNDS.width + BOUNDS.minX;
    }
  } );
} );