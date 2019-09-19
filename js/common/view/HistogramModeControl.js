// Copyright 2015-2016, University of Colorado Boulder

/**
 * Controls the values of the 'histogram mode' Property, which determines the representation 
 * that is displayed at the output (bottom) of the Galton board.
 *
 * @author Denzell Barnett (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  // constants
  const ICON_WIDTH = 35;

  /**
   * @param {Property.<string>} histogramModeProperty - see PlinkoProbabilityCommonView
   * @param {string} topValue - value associated with top radio button
   * @param {HTMLImageElement} topImage - image used to create icon for top radio button
   * @param {string} bottomValue - value associated with bottom radio button
   * @param {HTMLImageElement} bottomImage - image used to create icon for bottom radio button
   * @param {Object} [options]
   * @constructor
   */
  function HistogramModeControl( histogramModeProperty, topValue, topImage, bottomValue, bottomImage, options ) {

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
    const topNode = new Image( topImage );
    topNode.scale( ICON_WIDTH / topNode.width );

    const bottomNode = new Image( bottomImage );
    bottomNode.scale( ICON_WIDTH / bottomNode.width );

    RadioButtonGroup.call( this, histogramModeProperty, [
      { value: topValue, node: topNode },
      { value: bottomValue, node: bottomNode }
    ], options );
  }

  plinkoProbability.register( 'HistogramModeControl', HistogramModeControl );

  return inherit( RadioButtonGroup, HistogramModeControl );
} );

