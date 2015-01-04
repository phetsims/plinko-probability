// Copyright 2002-2014, University of Colorado Boulder

/**
 * A Scenery node that depicts a hopper.
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Hopper( options ) {

    Node.call( this );

    options = _.extend( {
      // defaults

      topWidth: 70,
      bottomWidth: 30,
      hopperThickness: 30,
      rimThickness: 3,
      hopperFill: 'black',
      hopperHighLightFill: 'rgb(136,136,136)',
      rimFill: 'red',
      rimHighLightFill: 'rgb(255,255,255)'
    }, options );

    // Add the bins

    var hopperShape = new Shape();

    hopperShape.moveTo( -options.bottomWidth / 2, 0 )
      .lineTo( -options.topWidth / 2, -options.hopperThickness )
      .lineTo( options.topWidth / 2, -options.hopperThickness )
      .lineTo( options.bottomWidth / 2, 0 )
      .lineTo( -options.bottomWidth / 2, 0 );

    var rimShape = new Shape();
    rimShape.moveTo( -options.bottomWidth / 2, 0 )
      .lineTo( -options.bottomWidth / 2, options.rimThickness )
      .lineTo( options.bottomWidth / 2, options.rimThickness )
      .lineTo( options.bottomWidth / 2, 0 )
      .lineTo( -options.bottomWidth / 2, 0 );


    var hopperRectangleGradient = new LinearGradient( -options.topWidth / 2, 0, options.topWidth / 2, 0 ).
      addColorStop( 0, options.hopperFill ).
      addColorStop( 0.47, options.hopperHighLightFill ).
      addColorStop( 1, options.hopperFill );

    var rimRectangleGradient = new LinearGradient( -options.bottomWidth / 2, 0, options.bottomWidth / 2, 0 ).
      addColorStop( 0, options.rimFill ).
      addColorStop( 0.47, options.rimHighLightFill ).
      addColorStop( 1, options.rimFill );


    this.addChild( new Path( hopperShape, {fill: hopperRectangleGradient} ) );
    this.addChild( new Path( rimShape, {fill: rimRectangleGradient} ) );


    // Pass options through to the parent class.
    this.mutate( options );
  }

  return inherit( Node, Hopper );
} );