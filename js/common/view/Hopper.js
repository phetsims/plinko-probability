// Copyright 2015, University of Colorado Boulder

/**
 * A Scenery node that depicts a hopper, a pyramidal shape container
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Shape = require( 'KITE/Shape' );

  /**
   * Constructor for hopper,
   * @param {Object} [options]
   * @constructor
   */
  function Hopper( options ) {

    Node.call( this );

    options = _.extend( {
      topWidth: 70,
      bottomWidth: 28,
      hopperThickness: 28,
      rimThickness: 3,
      hopperFill: 'black',
      hopperHighLightFill: 'rgb(136,136,136)',
      rimFill: 'red',
      rimHighLightFill: 'rgb(255,255,255)'
    }, options );

    // create the truncated pyramidal shape of the hopper
    var hopperShape = new Shape();
    hopperShape.moveTo( 0, 0 )
      .lineTo( -options.bottomWidth / 2, 0 )
      .lineTo( -options.topWidth / 2, -options.hopperThickness )
      .lineTo( options.topWidth / 2, -options.hopperThickness )
      .lineTo( options.bottomWidth / 2, 0 )
      .close();

    // create a small rim at the bottom the hopper
    var rimShape = new Shape();
    rimShape.moveTo( 0, 0 )
      .lineTo( -options.bottomWidth / 2, 0 )
      .lineTo( -options.bottomWidth / 2, options.rimThickness )
      .lineTo( options.bottomWidth / 2, options.rimThickness )
      .lineTo( options.bottomWidth / 2, 0 )
      .close();

    // create horizontal gradients for the hopper and the rim
    var hopperRectangleGradient = new LinearGradient( -options.topWidth / 2, 0, options.topWidth / 2, 0 ).addColorStop( 0, options.hopperFill ).addColorStop( 0.47, options.hopperHighLightFill ).addColorStop( 1, options.hopperFill );
    var rimRectangleGradient = new LinearGradient( -options.bottomWidth / 2, 0, options.bottomWidth / 2, 0 ).addColorStop( 0, options.rimFill ).addColorStop( 0.47, options.rimHighLightFill ).addColorStop( 1, options.rimFill );

    // add the hopper and the rim.
    this.addChild( new Path( hopperShape, { fill: hopperRectangleGradient } ) );
    this.addChild( new Path( rimShape, { fill: rimRectangleGradient } ) );

    // pass options through to the parent class.
    this.mutate( options );
  }

  plinkoProbability.register( 'Hopper', Hopper );

  return inherit( Node, Hopper );
} );