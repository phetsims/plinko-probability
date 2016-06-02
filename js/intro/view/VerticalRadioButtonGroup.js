// Copyright 2015, University of Colorado Boulder

/**
 * Scenery Node that displays two Radio Buttons that switches between the cylinder and histogram view
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  // images
  var counterDOMImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var containerDOMImage = require( 'image!PLINKO_PROBABILITY/container.png' );

  // constants
  var ICON_WIDTH = 35;

  /**
   *
   * @param {Property.<string>} histogramRadioProperty - Valid values are 'cylinder', 'number'.
   * @param {Object} [options]
   * @constructor
   */
  function VerticalRadioButtonGroup( histogramRadioProperty, options ) {


    options = _.extend( {
        spacing: 5, // vertical separation of the buttons
        cornerRadius: 10,
        baseColor: 'white',
        buttonContentXMargin: 5,
        buttonContentYMargin: 5,
        selectedStroke: 'black',
        deselectedLineWidth: 1,
        selectedLineWidth: 2
      },
      options );

    // create the icons for the radio buttons
    var counterImage = new Image( counterDOMImage );
    counterImage.scale( ICON_WIDTH / counterImage.width );
    var containerImage = new Image( containerDOMImage );
    containerImage.scale( ICON_WIDTH / containerImage.width );


    RadioButtonGroup.call( this, histogramRadioProperty, [
      { value: 'cylinder', node: containerImage },
      { value: 'number', node: counterImage }
    ], options );

  }

  plinkoProbability.register( 'VerticalRadioButtonGroup', VerticalRadioButtonGroup );

  return inherit( RadioButtonGroup, VerticalRadioButtonGroup );
} );

