// Copyright 2016, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );

  var getQueryParameter = phet.chipper.getQueryParameter;

  // @private {boolean} we need a flag to call prepopulate() after the histogram is created
  var ballsOnScreenFlag = false;

  // creates query parameter that lowers the maximum amount of balls for testing purposes.
  if ( getQueryParameter( 'ballsOnScreen' ) ) {
    var ballsOnScreen = parseFloat( ( getQueryParameter( 'ballsOnScreen' )) );
    ballsOnScreen = Math.floor( ballsOnScreen );
    ballsOnScreenFlag = true;
  }
  var PlinkoProbabilityQueryParameters = {
    
    BALLS_ON_SCREEN: ballsOnScreen,
    BALLS_ON_SCREEN_FLAG: ballsOnScreenFlag

  };

  plinkoProbability.register( 'PlinkoProbabilityQueryParameters', PlinkoProbabilityQueryParameters );

  return PlinkoProbabilityQueryParameters;
} );
