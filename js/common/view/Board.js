// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node that depicts a wooden triangular board.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  //var Matrix3 = require( 'DOT/Matrix3' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  //var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Board( options ) {

    Node.call( this );

    options = _.extend( {
      // defaults
      height: 300,
      bottomWidth: 600,
      shadowFill: 'rgb(136,136,136)'
    }, options );

    var boardShape = new Shape();

    boardShape.moveTo( 0, 0 )
      .lineTo( options.bottomWidth / 2, options.height )
      .lineTo( -options.bottomWidth / 2, options.height )
      .close();

    var boardRectangleGradient = new LinearGradient( -options.bottomWidth / 2, 0, options.bottomWidth / 2, 0 ).
      addColorStop( 0.0112, '#FBEFD0' ).
      addColorStop( 0.1742, '#FADBA2' ).
      addColorStop( 0.2978, '#FAE3B0' ).
      addColorStop( 0.5393, '#E8CFA1' ).
      addColorStop( 0.6573, '#F0D3A1' ).
      addColorStop( 0.7809, '#FBEED2' ).
      addColorStop( 0.9607, '#F9E2BA' );

    // create a shadow of the wooden board
    //var boardShadowShape = boardShape.copy().transformed( Matrix3.translation( 10, 5 ) );
//    this.addChild( new Path( boardShadowShape, { fill: options.shadowFill, centerX: 20, top: 10 } ) );
//    var boardShadowRectangleGradient = new LinearGradient( options.bottomWidth / 2, options.height, options.bottomWidth / 2, options.height + 5 ).
//      addColorStop( 0.00, options.shadowFill ).
//      addColorStop( 0.50, options.shadowFill ).
//      addColorStop( 1.00, PlinkoConstants.BACKGROUND_COLOR );

    //this.addChild( new Path( boardShadowShape, { fill: boardShadowRectangleGradient } ) );
    this.addChild( new Path( boardShape, { fill: boardRectangleGradient, centerX: 0, top: 0 } ) );

    // Pass options through to the parent class.
    this.mutate( options );
  }

  plinkoProbability.register( 'Board', Board );

  return inherit( Node, Board );
} );