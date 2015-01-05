// Copyright 2002-2015, University of Colorado Boulder

/**
 * The main Plinko Probability screen
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
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
        backgroundColor: PlinkoConstants.BACKGROUND_COLOR
      }
    );
  }

  return inherit( Screen, PlinkoProbabilityScreen );
} );
