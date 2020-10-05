// Copyright 2020, University of Colorado Boulder

/**
 * Content for the keyboard help dialog
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import SliderAndGeneralKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/SliderAndGeneralKeyboardHelpContent.js';
import plinkoProbability from '../../plinkoProbability.js';

class PlinkoProbabilityKeyboardHelpContent extends SliderAndGeneralKeyboardHelpContent {
  constructor() {
    super( {
      generalSectionOptions: {
        withGroupContent: true
      }
    } );
  }
}

plinkoProbability.register( 'PlinkoProbabilityKeyboardHelpContent', PlinkoProbabilityKeyboardHelpContent );
export default PlinkoProbabilityKeyboardHelpContent;