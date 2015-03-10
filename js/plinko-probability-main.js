// Copyright 2002-2015, University of Colorado Boulder

/**
 * Main entry point for the 'Plinko Probability' sim.
 */
define( function( require ) {
  'use strict';

  // modules
  //var PlinkoProbabilityScreen = require( 'PLINKO/plinko-probability/PlinkoProbabilityScreen' );
  var PlinkoProbabilityIntroScreen = require( 'PLINKO/intro/PlinkoProbabilityIntroScreen' );
  var PlinkoProbabilityLabScreen = require( 'PLINKO/lab/PlinkoProbabilityLabScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!PLINKO/plinko-probability.name' );

  var simOptions = {
    credits: {
      // TODO: fill in credits
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  //SimLauncher.launch( function() {
  //var sim = new Sim( simTitle, [ new PlinkoProbabilityScreen() ], simOptions );
  //sim.start();
  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new PlinkoProbabilityIntroScreen(),
      new PlinkoProbabilityLabScreen() ], simOptions );
    sim.start();

  } );
} );
