// Copyright 2015, University of Colorado Boulder

/**
 * Controls the values of the 'histogram mode' Property, which determines the representation 
 * that is displayed at the output (bottom) of the Galton board.
 *
 * @author Denzell Barnett(Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  // constants
  var ICON_WIDTH = 35;

  /**
   * @param {Property.<string>} histogramModeProperty
   * @param {HTMLImageElement} topImage - represents top icon to be created
   * @param {HTMLImageElement} bottomImage - represents bottom icon to be created
   * @param {string} topValue - represents value of top icon image value
   * @param {string} bottomValue - represents value of bottom icon image value
   * @param {Object} [options]
   * @constructor
   */
  function HistogramModeControl( histogramModeProperty, topImage, bottomImage, topValue, bottomValue, options ) {

    options = _.extend( {
      spacing: 5, // vertical separation of the buttons
      cornerRadius: 10,
      baseColor: 'white',
      buttonContentXMargin: 5,
      buttonContentYMargin: 5,
      selectedStroke: 'black',
      deselectedLineWidth: 1,
      selectedLineWidth: 2
    }, options );

    // create the icons for the radio buttons
    var topNode = new Image( topImage );
    topNode.scale( ICON_WIDTH / topNode.width );

    var bottomNode = new Image( bottomImage );
    bottomNode.scale( ICON_WIDTH / bottomNode.width );

    RadioButtonGroup.call( this, histogramModeProperty, [
      { value: topValue, node: topNode },
      { value: bottomValue, node: bottomNode }
    ], options );
  }

  plinkoProbability.register( 'HistogramModeControl', HistogramModeControl );

  return inherit( RadioButtonGroup, HistogramModeControl );
} );

