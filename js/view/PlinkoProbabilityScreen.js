// Copyright 2002-2013, University of Colorado Boulder

/**
 * The main Plinko Probability screen
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoProbabilityModel = require( 'PLINKO/model/PlinkoProbabilityModel' );
  var PlinkoProbabilityView = require( 'PLINKO/view/PlinkoProbabilityView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var plinkoProbabilityScreenString = require( 'string!PLINKO/plinkoProbabilityScreen' );

  function PlinkoProbabilityScreen() {
    Screen.call( this,
      plinkoProbabilityScreenString,
      null, // no icon, single-screen sim
      function() { return new PlinkoProbabilityModel(); },
      function( model ) { return new PlinkoProbabilityView( model ); }, {
        backgroundColor: 'rgb(198,226,246)'
      }
    );
  }

  return inherit( Screen, PlinkoProbabilityScreen );
} );
