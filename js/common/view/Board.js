// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node that depicts a wooden triangular board.
 *
 * @author Martin Veillette (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var RIGHT_SHADOW_WIDTH = 10;
  var BOTTOM_SHADOW_HEIGHT = 10;
  var SHADOW_X_OFFSET = 4;
  var SHADOW_Y_OFFSET = 4;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Board( options ) {

    options = _.extend( {
      size: new Dimension2( 600, 300 ), // triangle base width x height
      shadowFill: 'rgb(136,136,136)'
    }, options );

    // @public (read-only) so we have the size of the board without gradients
    this.size = options.size;

    // local vars to improve readability
    var width = options.size.width;
    var height = options.size.height;

    // triangular shape of the board, origin at top center
    var boardShape = new Shape().moveTo( 0, 0 )
      .lineTo( width / 2, height )
      .lineTo( -width / 2, height )
      .close();

    // board face
    var faceGradient = new LinearGradient( -width / 2, 0, width / 2, 0 )
      .addColorStop( 0.0112, '#FBEFD0' )
      .addColorStop( 0.1742, '#FADBA2' )
      .addColorStop( 0.2978, '#FAE3B0' )
      .addColorStop( 0.5393, '#E8CFA1' )
      .addColorStop( 0.6573, '#F0D3A1' )
      .addColorStop( 0.7809, '#FBEED2' )
      .addColorStop( 0.9607, '#F9E2BA' );
    var faceNode = new Path( boardShape, {
      fill: faceGradient
    } );

    // bottom shadow
    var bottomShadowGradient = new LinearGradient( 0, 0, 0, BOTTOM_SHADOW_HEIGHT )
      .addColorStop( 0.00, options.shadowFill )
      .addColorStop( 0.20, options.shadowFill )
      .addColorStop( 1.00, PlinkoProbabilityConstants.BACKGROUND_COLOR );
    var bottomShadowNode = new Rectangle( 0, 0, faceNode.width + 8, BOTTOM_SHADOW_HEIGHT, 5, 50, {
      fill: bottomShadowGradient,
      left: faceNode.left + SHADOW_X_OFFSET,
      top: faceNode.bottom
    } );

    // right shadow
    var rightShadowShape = new Shape().moveTo( 0, 0 )
      .lineTo( RIGHT_SHADOW_WIDTH, 0 )
      .lineTo( width / 2 + RIGHT_SHADOW_WIDTH, height )
      .lineTo( width / 2, height )
      .close();
    var rightShadowGradient = new LinearGradient( 0, 0, RIGHT_SHADOW_WIDTH / 2, -RIGHT_SHADOW_WIDTH /2 )
      .addColorStop( 0.00, options.shadowFill )
      .addColorStop( 0.20, options.shadowFill )
      .addColorStop( 1.00, PlinkoProbabilityConstants.BACKGROUND_COLOR );
    var rightShadowNode = new Path( rightShadowShape, {
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