// Copyright 2015-2020, University of Colorado Boulder

/**
 * Scenery node that represents a ball.
 *
 * @author Martin Veillette (Berea College)
 */

import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import plinkoProbability from '../../plinkoProbability.js';
import PlinkoProbabilityConstants from '../PlinkoProbabilityConstants.js';

class BallNode extends ShadedSphereNode {

  /**
   * @param {number} radius - in view coordinates
   */
  constructor( radius ) {
    super( 2 * radius, {
      mainColor: PlinkoProbabilityConstants.BALL_COLOR,
      highlightColor: PlinkoProbabilityConstants.BALL_HIGHLIGHT_COLOR
    } );
  }
}

plinkoProbability.register( 'BallNode', BallNode );
export default BallNode;