// Copyright 2015-2019, University of Colorado Boulder

/**
 * A Scenery node that depicts a wooden triangular board.
 *
 * @author Martin Veillette (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LinearGradient = require( 'SCENERY/util/LinearGradient' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );

  // constants
  const RIGHT_SHADOW_WIDTH = 10;
  const BOTTOM_SHADOW_HEIGHT = 10;
  const SHADOW_X_OFFSET = 4;
  const SHADOW_Y_OFFSET = 4;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Board( options ) {

    options = merge( {
      size: new Dimension2( 600, 300 ), // triangle base width x height
      shadowFill: 'rgb(136,136,136)'
    }, options );

    // @public (read-only) so we have the size of the board without gradients
    this.size = options.size;

    // local vars to improve readability
    const width = options.size.width;
    const height = options.size.height;

    // triangular shape of the board, origin at top center
    const boardShape = new Shape().moveTo( 0, 0 )
      .lineTo( width / 2, height )
      .lineTo( -width / 2, height )
      .close();

    // board face
    const faceGradient = new LinearGradient( -width / 2, 0, width / 2, 0 )
      .addColorStop( 0.0112, '#FBEFD0' )
      .addColorStop( 0.1742, '#FADBA2' )
      .addColorStop( 0.2978, '#FAE3B0' )
      .addColorStop( 0.5393, '#E8CFA1' )
      .addColorStop( 0.6573, '#F0D3A1' )
      .addColorStop( 0.7809, '#FBEED2' )
      .addColorStop( 0.9607, '#F9E2BA' );
    const faceNode = new Path( boardShape, {
      fill: faceGradient
    } );

    // bottom shadow, a rectangle below the triangle
    const bottomShadowGradient = new LinearGradient( 0, 0, 0, BOTTOM_SHADOW_HEIGHT )
      .addColorStop( 0.00, options.shadowFill )
      .addColorStop( 0.20, options.shadowFill )
      .addColorStop( 1.00, PlinkoProbabilityConstants.BACKGROUND_COLOR );
    const bottomShadowNode = new Rectangle( 0, 0, faceNode.width + 8, BOTTOM_SHADOW_HEIGHT, 5, 50, {
      fill: bottomShadowGradient,
      left: faceNode.left + SHADOW_X_OFFSET,
      top: faceNode.bottom
    } );

    // right shadow, a diagonal strip along the right edge of the triangle
    const rightShadowShape = new Shape().moveTo( 0, 0 )
      .lineTo( RIGHT_SHADOW_WIDTH, 0 )
      .lineTo( width / 2 + RIGHT_SHADOW_WIDTH, height )
      .lineTo( width / 2, height )
      .close();
    const rightShadowGradient = new LinearGradient( 0, 0, RIGHT_SHADOW_WIDTH / 2, -RIGHT_SHADOW_WIDTH /2 )
      .addColorStop( 0.00, options.shadowFill )
      .addColorStop( 0.20, options.shadowFill )
      .addColorStop( 1.00, PlinkoProbabilityConstants.BACKGROUND_COLOR );
    const rightShadowNode = new Path( rightShadowShape, {
      fill: rightShadowGradient,
      left: faceNode.centerX + SHADOW_X_OFFSET,
      top: faceNode.top + SHADOW_Y_OFFSET
    } );

    // shadows behind face
    options.children = [ bottomShadowNode, rightShadowNode, faceNode ];

    Node.call( this, options );
  }

  plinkoProbability.register( 'Board', Board );

  return inherit( Node, Board );
} );