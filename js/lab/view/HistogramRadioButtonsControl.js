// Copyright 2015, University of Colorado Boulder

/**
 *  Scenery Node that displays two Radio Buttons that switches between the fraction and counter view for the histogram
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // imports
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  // images
  var counterDOMImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var fractionDOMImage = require( 'image!PLINKO_PROBABILITY/fraction.png' );

  // constants
  var ICON_WIDTH = 35;

  /**
   *
   * @param {Property.<string>} histogramRadioProperty - Valid values are 'fraction', 'number'.
   * @param {Object} [options]
   * @constructor
   */
  function HistogramRadioButtonsControl( histogramRadioProperty, options ) {


    options = _.extend( {
        spacing: 5, // vertical separation of the buttons
        cornerRadius: 10,
        baseColor: 'white',
        buttonContentXMargin: 5,
        buttonContentYMargin: 13,
        selectedStroke: 'black',
        deselectedLineWidth: 1,
        selectedLineWidth: 2
      },
      options );

    // create (and scale) the counter icon and the fraction icon
    var counterImage = new Image( counterDOMImage );
    counterImage.scale( ICON_WIDTH / counterImage.width );
    var fractionImage = new Image( fractionDOMImage );
    fractionImage.scale( ICON_WIDTH / fractionImage.width );
    
    // create the radio buttons
    RadioButtonGroup.call( this, histogramRadioProperty, [
      { value: 'number', node: counterImage },
      { value: 'fraction', node: fractionImage }
    ], options );

  }

  plinkoProbability.register( 'HistogramRadioButtonsControl', HistogramRadioButtonsControl );

  return inherit( RadioButtonGroup, HistogramRadioButtonsControl );
} );
