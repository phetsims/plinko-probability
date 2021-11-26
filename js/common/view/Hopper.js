// Copyright 2015-2021, University of Colorado Boulder

/**
 * A Scenery node that depicts a hopper, a pyramidal shape container
 *
 * @author Martin Veillette (Berea College)
 */

import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Path } from '../../../../scenery/js/imports.js';
import { LinearGradient } from '../../../../scenery/js/imports.js';
import plinkoProbability from '../../plinkoProbability.js';

class Hopper extends Node {
  /**
   * Constructor for hopper
   * @param {Property.<number>} numberOfRowsProperty
   * @param {Object} [options]
   */
  constructor( numberOfRowsProperty, options ) {

    super();

    options = merge( {
      topWidth: 70,
      bottomWidth: 45,
      hopperThickness: 28,
      rimThickness: 3,
      hopperFill: 'black',
      hopperHighLightFill: 'rgb(136,136,136)',
      rimFill: 'red',
      rimHighLightFill: 'rgb(255,255,255)'
    }, options );

    const extraSpace = 12;

    // create horizontal gradients for the hopper and the rim
    const hopperRectangleGradient = new LinearGradient( -options.topWidth / 2, 0, options.topWidth / 2, 0 ).addColorStop( 0, options.hopperFill ).addColorStop( 0.47, options.hopperHighLightFill ).addColorStop( 1, options.hopperFill );
    const rimRectangleGradient = new LinearGradient( -options.bottomWidth / 2, 0, options.bottomWidth / 2, 0 ).addColorStop( 0, options.rimFill ).addColorStop( 0.47, options.rimHighLightFill ).addColorStop( 1, options.rimFill );


    // present for the lifetime of the simulation
    numberOfRowsProperty.link( numberOfRows => {
      this.removeAllChildren();
      // create the truncated pyramidal shape of the hopper
      const hopperShape = new Shape();

      // create a small rim at the bottom the hopper
      const rimShape = new Shape();

      const bottomWidth = options.bottomWidth * 11 / ( 5 + Math.min( 6, numberOfRows ) );
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
      const hopperPath = new Path( hopperShape, { fill: hopperRectangleGradient } );
      const rimPath = new Path( rimShape, { fill: rimRectangleGradient } );
      this.addChild( hopperPath );
      this.addChild( rimPath );

    } );
    // pass options through to the parent class.
    this.mutate( options );
  }
}

plinkoProbability.register( 'Hopper', Hopper );

export default Hopper;