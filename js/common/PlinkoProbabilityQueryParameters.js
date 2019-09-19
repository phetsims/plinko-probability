// Copyright 2016-2017, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author Denzell Barnett (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const Util = require( 'DOT/Util' );

  const PlinkoProbabilityQueryParameters = QueryStringMachine.getAll( {

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

    // TODO: Bad things will happen if the minRow is set higher than maxRow
    // minimum number of peg rows on lab screen
    minRow: {
      type: 'number',
      defaultValue: 1,
      isValidValue: function( value ) {
        return value > 0 && Util.isInteger( value );
      }
    },
    // maximum number of peg rows on lab screen
    maxRow: {
      type: 'number',
      defaultValue: 26,
      isValidValue: function( value ) {
        return value > 0 && Util.isInteger( value );
      }
    },
    // default number of peg rows on intro and lab screen
    defaultRow: {
      type: 'number',
      defaultValue: 12,
      isValidValue: function( value ) {
        return value > 0 && Util.isInteger( value );
      }
    },

    // Uses 3D appearance for the Play button, see https://github.com/phetsims/plinko-probability/issues/26
    play3D: { type: 'flag' }
  } );

  plinkoProbability.register( 'PlinkoProbabilityQueryParameters', PlinkoProbabilityQueryParameters );

  // log the values of all sim-specific query parameters
  phet.log && phet.log( 'query parameters: ' + JSON.stringify( PlinkoProbabilityQueryParameters, null, 2 ) );

  return PlinkoProbabilityQueryParameters;
} );

