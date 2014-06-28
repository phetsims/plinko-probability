// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the 'Plinko Probability' sim.
 */
define( function( require ) {
  'use strict';

  // modules
  var PlinkoProbabilityScreen = require( 'PLINKO/view/PlinkoProbabilityScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!PLINKO/simTitle' );

  var simOptions = {
    credits: {
      // TODO: fill this in once the design is done
      leadDesign: 'La\'lead Designere',
      softwareDevelopment: 'Sof Tware De\'Veloper',
      designTeam: 'De\'zine Teem'
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( window.phetcommon.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new PlinkoProbabilityScreen() ], simOptions );
    sim.start();
  } );
} );
