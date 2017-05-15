// Copyright 2015-2016, University of Colorado Boulder

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
   * Constructor for hopper
   * @param {Property.<number>} numberOfRowsProperty
   * @param {Object} [options]
   * @constructor
   */
  function Hopper( numberOfRowsProperty, options ) {

    Node.call( this );

    var self = this;

    options = _.extend( {
      topWidth: 70,
      bottomWidth: 45,
      hopperThickness: 28,
      rimThickness: 3,
      hopperFill: 'black',
      hopperHighLightFill: 'rgb(136,136,136)',
      rimFill: 'red',
      rimHighLightFill: 'rgb(255,255,255)'
    }, options );

    var extraSpace = 12;

    // create horizontal gradients for the hopper and the rim
    var hopperRectangleGradient = new LinearGradient( -options.topWidth / 2, 0, options.topWidth / 2, 0 ).addColorStop( 0, options.hopperFill ).addColorStop( 0.47, options.hopperHighLightFill ).addColorStop( 1, options.hopperFill );
    var rimRectangleGradient = new LinearGradient( -options.bottomWidth / 2, 0, options.bottomWidth / 2, 0 ).addColorStop( 0, options.rimFill ).addColorStop( 0.47, options.rimHighLightFill ).addColorStop( 1, options.rimFill );


    // present for the lifetime of the simulation
    numberOfRowsProperty.link( function( numberOfRows ) {
      self.removeAllChildren();
      // create the truncated pyramidal shape of the hopper
      var hopperShape = new Shape();

      // create a small rim at the bottom the hopper
      var rimShape = new Shape();

      var bottomWidth = options.bottomWidth * 11 / (5+Math.min( 6, numberOfRows ));
      hopperShape.moveTo( 0, 0 )
        .lineTo( -bottomWidth / 2, 0 )
        .lineTo( -bottomWidth / 2 - extraSpace, -options.hopperThickness )
        .lineTo( bottomWidth / 2 + extraSpace, -options.hopperThickness )
        .lineTo( bottomWidth / 2, 0 )
        .close();

      rimShape.moveTo( 0, 0 )
        .lineTo( -bottomWidth / 2, 0 )
        .lineTo( -bottomWidth / 2, options.rimThickness )
        .lineTo( bottomWidth / 2, options.rimThickness )
        .lineTo( bottomWidth / 2, 0 )
        .close();

      // add the hopper and the rim.
      var hopperPath = new Path( hopperShape, { fill: hopperRectangleGradient } );
      var rimPath = new Path( rimShape, { fill: rimRectangleGradient } );
      self.addChild( hopperPath );
      self.addChild( rimPath );

    } );
    // pass options through to the parent class.
    this.mutate( options );
  }

  plinkoProbability.register( 'Hopper', Hopper );

  return inherit( Node, Hopper );
} );