// Copyright 2014-2020, University of Colorado Boulder

/**
 * Main entry point for the 'Plinko Probability' sim.
 *
 * @author Martin Veillette (Berea College)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import IntroScreen from './intro/IntroScreen.js';
import LabScreen from './lab/LabScreen.js';
import plinkoProbabilityStrings from './plinkoProbabilityStrings.js';

const plinkoProbabilityTitleStringProperty = plinkoProbabilityStrings[ 'plinko-probability' ].titleStringProperty;

const simOptions = {
  credits: {
    leadDesign: 'Michael Dubson, Amanda McGarry',
    softwareDevelopment: 'Martin Veillette, Denzell Barnett, Chris Malley (PixelZoom, Inc.), Guillermo Ramos-Macias',
    team: 'Karina K. Hensberry, Trish Loeblein, Ariel Paul, Kathy Perkins',
    qualityAssurance: 'Steele Dalton, Amanda Davis, Alex Dornan, Bryce Griebenow, Ben Roberts'
  },
  hasKeyboardHelpContent: true
};

simLauncher.launch( () => {
  const sim = new Sim( plinkoProbabilityTitleStringProperty, [ new IntroScreen(), new LabScreen() ], simOptions );
  sim.start();
} );