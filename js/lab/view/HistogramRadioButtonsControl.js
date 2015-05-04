// Copyright 2002-2015, University of Colorado Boulder

/**
 *  Scenery Node that displays three Radio Buttons that control the flow of Balls
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // imports
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  // images
  var counterDOMImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var fractionDOMImage = require( 'image!PLINKO_PROBABILITY/fraction.png' );

  // constants
  //var ICON_HEIGHT = 20;
  var ICON_WIDTH = 35;

  /**
   *
   * @param {Property.<string>} histogramRadioProperty - Valid values are 'fraction', 'number'.
   * @param {Object} [options]
   * @constructor
   */
  function HistogramRadioButtonsControl( histogramRadioProperty, options ) {

    Node.call( this );
    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        spacing: 5, // vertical separation of the buttons
        cornerRadius: 10,
        baseColor: 'white',
        buttonContentXMargin: 5,
        buttonContentYMargin: 15,
        selectedStroke: 'black',
        deselectedLineWidth: 1,
        selectedLineWidth: 2
      },
      options );

    // eraser icon
    var counterImage = new Image( counterDOMImage );
    counterImage.scale( ICON_WIDTH / counterImage.width );
    var fractionImage = new Image( fractionDOMImage );
    fractionImage.scale( ICON_WIDTH / fractionImage.width );


    RadioButtonGroup.call( this, histogramRadioProperty, [
      { value: 'number', node: counterImage },
      { value: 'fraction', node: fractionImage }
    ], options );

  }

  return inherit( RadioButtonGroup, HistogramRadioButtonsControl );
} );
