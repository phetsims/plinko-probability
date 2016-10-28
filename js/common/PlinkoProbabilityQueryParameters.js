// Copyright 2016, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Denzell Barnett
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Util = require( 'DOT/Util' );

  var PlinkoProbabilityQueryParameters = QueryStringMachine.getAll( {

    // Maximum number of balls in the Intro screen, e.g. maxBallsIntro=150
    // Used to test overflow of bins.
    maxBallsIntro: {
      type: 'number',
      defaultValue: 100,
      isValidValue: function( value ) {
        return value > 0 && Util.isInteger( value );
      }
    },

    // Maximum number of balls that can be in any 1 bin in the Lab screen, e.g. maxBallsLab=10
    // Use this to test the 'Out of Balls!' dialog without having to wait an eternity.
    maxBallsLab: {
      type: 'number',
      defaultValue: 9999,
      isValidValue: function( value ) {
        return value > 0 && Util.isInteger( value );
      }
    },

    // Number of balls to put in the Lab screen histogram at startup, e.g. populateHistogram=20
    // Use this to quickly test the histogram.
    histogramBallsLab: {
      type: 'number',
      defaultValue: 0,
      isValidValue: function( value ) {
        return value >= 0 && Util.isInteger( value );
      }
    },

    // Uses 3D appearance for the Play button, see https://github.com/phetsims/plinko-probability/issues/26
    play3D: { type: 'flag' }
  } );

  plinkoProbability.register( 'PlinkoProbabilityQueryParameters', PlinkoProbabilityQueryParameters );

  return PlinkoProbabilityQueryParameters;
} );

