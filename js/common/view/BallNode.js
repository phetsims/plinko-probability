// Copyright 2015-2016, University of Colorado Boulder

/**
 * Scenery node that represents a ball.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );

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