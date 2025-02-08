// Copyright 2015-2025, University of Colorado Boulder

/**
 * View representation of the front cylinders (the side part of the cylinder) used within the Plinko Probability Simulation
 *
 * @author Martin Veillette (Berea College)
 */

import Shape from '../../../../kite/js/Shape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import LinearGradient from '../../../../scenery/js/util/LinearGradient.js';
import PlinkoProbabilityConstants from '../../common/PlinkoProbabilityConstants.js';
import plinkoProbability from '../../plinkoProbability.js';

// constants
const BOUNDS = PlinkoProbabilityConstants.HISTOGRAM_BOUNDS;

class CylindersFrontNode extends Node {
  /**
   * @param {Property.<number>} numberOfRowsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} cylinderInfo - Contains cylinder info: height, width, offset, ellipseHeight
   */
  constructor( numberOfRowsProperty, modelViewTransform, cylinderInfo ) {

    super();


    // convenience variable for placing the object inn the view
    const ellipseWidth = modelViewTransform.modelToViewDeltaX( cylinderInfo.cylinderWidth );
    const ellipseHeight = Math.abs( modelViewTransform.modelToViewDeltaY( cylinderInfo.ellipseHeight ) );
    const cylinderHeight = Math.abs( modelViewTransform.modelToViewDeltaY( cylinderInfo.cylinderHeight ) );
    const verticalOffset = -modelViewTransform.modelToViewDeltaY( cylinderInfo.verticalOffset );

    // create side shape of the cylinder
    const sideShape = new Shape();
    sideShape.moveTo( -ellipseWidth / 2, 0 )
      .lineTo( -ellipseWidth / 2, cylinderHeight )
      .ellipticalArc( 0, 0, ellipseWidth / 2, ellipseHeight / 2, 0, Math.PI, 0, true )
      .lineTo( ellipseWidth / 2, 0 )
      .ellipticalArc( 0, cylinderHeight, ellipseWidth / 2, ellipseHeight / 2, 0, 0, Math.PI, false )
      .close();

    // create the linear fill gradient for the cylinder
    const sideFill = new LinearGradient( -ellipseWidth / 2, 0, ellipseWidth / 2, 0 ).addColorStop( 0.0, PlinkoProbabilityConstants.CYLINDER_BASE_COLOR.colorUtilsDarker( 0.7 ) ).addColorStop( 0.5, PlinkoProbabilityConstants.CYLINDER_BASE_COLOR ).addColorStop( 1, PlinkoProbabilityConstants.CYLINDER_BASE_COLOR.colorUtilsBrighter( 0.5 ) );

    const sideLayerNode = new Node();
    this.addChild( sideLayerNode );

    // link is present for the lifetime of the sim
    numberOfRowsProperty.link( numberOfRows => {
      const numberOfTicks = numberOfRows + 1;
      for ( let i = 0; i < numberOfTicks; i++ ) {
        const binCenterX = this.getBinCenterX( i, numberOfTicks );
        const x = modelViewTransform.modelToViewX( binCenterX );
        const y = modelViewTransform.modelToViewY( cylinderInfo.top );

        // create and add the path for side of the cylinder
        const side = new Path( sideShape, {
          fill: sideFill,
          stroke: PlinkoProbabilityConstants.SIDE_CYLINDER_STROKE_COLOR,
          centerX: x,
          top: y + verticalOffset + ellipseHeight / 2
        } );
        sideLayerNode.addChild( side );
      }
    } );

  }


  /**
   * Function that returns the center x coordinate of a bin with index binIndex
   *
   * @param {number} binIndex - index associated with the bin, the index may range from 0 to numberOfBins-1
   * @param {number} numberOfBins - the number of bins on the screen
   * @returns {number}
   * @public
   */
  getBinCenterX( binIndex, numberOfBins ) {
    // We consider numberOfBins-1 because we consider the most left bin the first bin out of the total number of bins
    assert && assert( binIndex <= numberOfBins - 1 );
    return ( ( binIndex + 1 / 2 ) / numberOfBins ) * BOUNDS.width + BOUNDS.minX;
  }
}

plinkoProbability.register( 'CylindersFrontNode', CylindersFrontNode );

export default CylindersFrontNode;