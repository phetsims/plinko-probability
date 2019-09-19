// Copyright 2014-2019, University of Colorado Boulder

/**
 * Main entry point for the 'Plinko Probability' sim.
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const IntroScreen = require( 'PLINKO_PROBABILITY/intro/IntroScreen' );
  const LabScreen = require( 'PLINKO_PROBABILITY/lab/LabScreen' );
  const SliderAndGeneralKeyboardHelpContent = require( 'SCENERY_PHET/keyboard/help/SliderAndGeneralKeyboardHelpContent' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  const plinkoProbabilityTitleString = require( 'string!PLINKO_PROBABILITY/plinko-probability.title' );

  var keyboardHelpContent = new SliderAndGeneralKeyboardHelpContent( {
    generalSectionOptions: {
      withGroupContent: true
    }
  } );

  var simOptions = {
    credits: {
      leadDesign: 'Michael Dubson, Amanda McGarry',
      softwareDevelopment: 'Martin Veillette, Denzell Barnett, Chris Malley (PixelZoom, Inc.), Guillermo Ramos-Macias',
      team: 'Karina K. Hensberry, Trish Loeblein, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Steele Dalton, Amanda Davis, Alex Dornan, Bryce Griebenow, Ben Roberts'
    },
    keyboardHelpNode: keyboardHelpContent
  };

  SimLauncher.launch( function() {
    var sim = new Sim( plinkoProbabilityTitleString, [ new IntroScreen(), new LabScreen() ], simOptions );
    sim.start();
  } );
} );
