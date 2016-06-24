// Copyright 2015, University of Colorado Boulder

/**
 * Scenery Node that displays two Radio Buttons that switches between the cylinder and histogram view
 *
 * @author Denzell Barnett(Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );


  // constants
  var ICON_WIDTH = 35;

  /**
   *
   * @param {Property.<string>} histogramRadioProperty - Valid values are 'cylinder', 'number'.
   * @param {DOMImage} topDOMImage - represents top icon to be created
   * @param {DOMImage} bottomDOMImage - represents bottom icon to be created
   * @param {string} topValue - represents value of top icon image value
   * @param {string} bottomValue - represents value of bottom icon image value
   * @param {Object} [options]
   * @constructor
   */
  function VerticalRadioButtonCommon( histogramRadioProperty, topDOMImage, bottomDOMImage, topValue, bottomValue, options ) {


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
    var topImage = new Image( topDOMImage );
    topImage.scale( ICON_WIDTH / topImage.width );
    var bottomImage = new Image( bottomDOMImage );
    bottomImage.scale( ICON_WIDTH / bottomImage.width );


    RadioButtonGroup.call( this, histogramRadioProperty, [
      { value: topValue, node: topImage },
      { value: bottomValue, node: bottomImage }
    ], options );

  }

  plinkoProbability.register( 'VerticalRadioButtonCommon', VerticalRadioButtonCommon );

  return inherit( RadioButtonGroup, VerticalRadioButtonCommon );
} );

