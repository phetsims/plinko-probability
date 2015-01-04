// Copyright 2002-2013, University of Colorado Boulder

/**
 * The main Plinko Probability screen
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );

  var PlinkoProbabilityModel = require( 'PLINKO/plinko-probability/model/PlinkoProbabilityModel' );
  var PlinkoProbabilityView = require( 'PLINKO/plinko-probability/view/PlinkoProbabilityView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var plinkoProbabilityScreenString = require( 'string!PLINKO/plinkoProbabilityScreen' );

  function PlinkoProbabilityScreen() {
    Screen.call( this,
      plinkoProbabilityScreenString,
      null, // no icon, single-screen sim
      function() { return new PlinkoProbabilityModel(); },
      function( model ) { return new PlinkoProbabilityView( model ); }, {
        backgroundColor: 'rgb(170,220,255)'
      }
    );
  }

  return inherit( Screen, PlinkoProbabilityScreen );
} );
