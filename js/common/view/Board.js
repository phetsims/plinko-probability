// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node that depicts a wooden triangular board.
 *
 * @author Martin Veillette (Berea College)
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

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Board( options ) {

    Node.call( this );

    options = _.extend( {
      size: new Dimension2( 600, 300 ), // triangle base width x height
      shadowFill: 'rgb(136,136,136)'
    }, options );

    // @public (read-only) so we have the size of the board without gradients
    this.size = options.size;

    // local vars to improve readability
    var width = options.size.width;
    var height = options.size.height;

    // triangular shape of the board
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
    this.addChild( faceNode );

    // bottom shadow
    var bottomShadowHeight = 10;
    var bottomShadowGradient = new LinearGradient( 0, 0, 0, bottomShadowHeight )
      .addColorStop( 0.00, options.shadowFill )
      .addColorStop( 0.20, options.shadowFill )
      .addColorStop( 1.00, PlinkoProbabilityConstants.BACKGROUND_COLOR );
    var bottomShadowNode = new Rectangle( 0, 0, faceNode.width + 8, bottomShadowHeight, 5, 50, {
      fill: bottomShadowGradient,
      left: faceNode.left + 4,
      top: faceNode.bottom
    } );
    this.addChild( bottomShadowNode );

    // right shadow
    var rightShadowShape = new Shape().moveTo( 4, 4 )
      .lineToRelative( width / 2, height )
      .lineToRelative( 10, 0 )
      .lineToRelative( -width / 2, -height )
      .close();
    var rightShadowGradient = new LinearGradient( width / 4, height / 2, width / 4 + 5, height / 2 - 5 )
      .addColorStop( 0.00, options.shadowFill )
      .addColorStop( 0.20, options.shadowFill )
      .addColorStop( 1.00, PlinkoProbabilityConstants.BACKGROUND_COLOR );
    var rightShadowNode = new Path( rightShadowShape, {
      fill: rightShadowGradient
    } );
    this.addChild( rightShadowNode );

    this.mutate( options );
  }

  plinkoProbability.register( 'Board', Board );

  return inherit( Node, Board );
} );