// Copyright 2015-2016, University of Colorado Boulder

/**
 * Scenery node that represents a ball.
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

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

  return inherit( ShadedSphereNode, BallNode );
} );