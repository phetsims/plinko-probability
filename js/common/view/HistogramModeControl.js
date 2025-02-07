// Copyright 2015-2023, University of Colorado Boulder

/**
 * Controls the values of the 'histogram mode' Property, which determines the representation
 * that is displayed at the output (bottom) of the Galton board.
 *
 * @author Denzell Barnett (Berea College)
 */

import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import plinkoProbability from '../../plinkoProbability.js';

// constants
const ICON_WIDTH = 35;

class HistogramModeControl extends RectangularRadioButtonGroup {

  /**
   * @param {Property.<string>} histogramModeProperty - see PlinkoProbabilityCommonView
   * @param {string} topValue - value associated with top radio button
   * @param {HTMLImageElement} topImage - image used to create icon for top radio button
   * @param {string} bottomValue - value associated with bottom radio button
   * @param {HTMLImageElement} bottomImage - image used to create icon for bottom radio button
   * @param {Object} [options]
   */
  constructor( histogramModeProperty, topValue, topImage, bottomValue, bottomImage, options ) {

    options = merge( {
      spacing: 5, // vertical separation of the buttons
      radioButtonOptions: {
        cornerRadius: 10,
        baseColor: 'white',
        xMargin: 5,
        yMargin: 5,
        buttonAppearanceStrategyOptions: {
          selectedStroke: 'black',
          deselectedLineWidth: 1,
          selectedLineWidth: 2
        }
      }
    }, options );

    // create the icons for the radio buttons
    const topNode = new Image( topImage );
    topNode.scale( ICON_WIDTH / topNode.width );

    const bottomNode = new Image( bottomImage );
    bottomNode.scale( ICON_WIDTH / bottomNode.width );

    super( histogramModeProperty, [
      { value: topValue, createNode: () => topNode },
      { value: bottomValue, createNode: () => bottomNode }
    ], options );
  }
}

plinkoProbability.register( 'HistogramModeControl', HistogramModeControl );
export default HistogramModeControl;