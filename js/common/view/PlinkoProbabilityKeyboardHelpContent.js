// Copyright 2018, University of Colorado Boulder

/**
 * Content for the "Hot Keys and Help" dialog that can be brought up from the sim navigation bar.
 *
 * @author Michael Kauzmann (PhET Interaction Simulations)
 */
define( require => {
  'use strict';

  // modules
  const GeneralKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/GeneralKeyboardHelpSection' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const SliderKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/SliderKeyboardHelpSection' );
  const TwoColumnKeyboardHelpContent = require( 'SCENERY_PHET/keyboard/help/TwoColumnKeyboardHelpContent' );

  class PlinkoProbabilityKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
    constructor() {
      const sliderKeyboardHelpSection = new SliderKeyboardHelpSection();
      const generalNavigationHelpSection = new GeneralKeyboardHelpSection( { withGroupContent: true } );

      super( sliderKeyboardHelpSection, generalNavigationHelpSection );
    }
  }

  return plinkoProbability.register( 'PlinkoProbabilityKeyboardHelpContent', PlinkoProbabilityKeyboardHelpContent );
} );