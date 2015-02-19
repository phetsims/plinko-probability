// Copyright 2002-2015, University of Colorado Boulder

/**
 * Button with a counter icon.
 *
 * @author John Blanco
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );

  // images
  var counterImage = require( 'image!PLINKO/counter.png' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function CounterButton( options ) {

    options = _.extend( {
      baseColor: 'white',
      iconWidth: 20 // width of counter icon, used for scaling, the aspect ratio will determine height
    }, options );

    // eraser icon
    options.content = new Image( counterImage );
    options.content.scale( options.iconWidth / options.content.width );

    RectangularPushButton.call( this, options );
  }

  return inherit( RectangularPushButton, CounterButton );
} );