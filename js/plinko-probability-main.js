// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main entry point for the 'Plinko Probability' sim.
 */
define( function( require ) {
  'use strict';

  // modules
  var PlinkoProbabilityIntroScreen = require( 'PLINKO_PROBABILITY/intro/PlinkoProbabilityIntroScreen' );
  var PlinkoProbabilityLabScreen = require( 'PLINKO_PROBABILITY/lab/PlinkoProbabilityLabScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var plinkoProbabilityTitleString = require( 'string!PLINKO_PROBABILITY/plinko-probability.title' );

  var simOptions = {
    credits: {
      leadDesign: 'Michael Dubson, Amanda McGarry',
      softwareDevelopment: 'Denzell Barnett, Guillermo Ramos-Macias, Martin Veillette',
      team: 'Karina K. Hensberry, Trish Loeblein, Ariel Paul, Kathy Perkins',
      qualityAssurance: 'Ben Roberts, Steele Dalton, Amanda Davis'
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( plinkoProbabilityTitleString, [ new PlinkoProbabilityIntroScreen(),
      new PlinkoProbabilityLabScreen() ], simOptions );
    sim.start();

  } );
} );
