// Copyright 2015-2019, University of Colorado Boulder

/**
 * Scenery node that represents a ball.
 *
 * @author Martin Veillette (Berea College)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import plinkoProbability from '../../plinkoProbability.js';
import PlinkoProbabilityConstants from '../PlinkoProbabilityConstants.js';

/**
 * @param {number} radius - in view coordinates
 * @constructor
 */
function BallNode( radius ) {
  ShadedSphereNode.call( this, 2 * radius, {
    mainColor: PlinkoProbabilityConstants.BALL_COLOR,
    highlightColor: PlinkoProbabilityConstants.BALL_HIGHLIGHT_COLOR
  } );
}

plinkoProbability.register( 'BallNode', BallNode );

inherit( ShadedSphereNode, BallNode );
export default BallNode;