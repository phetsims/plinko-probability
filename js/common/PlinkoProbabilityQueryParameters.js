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

  var getQueryParameter = phet.chipper.getQueryParameter;

  var PlinkoProbabilityQueryParameters = {

    // Maximum number of balls in the Intro screen.
    // Used to test overflow of bins.
    MAX_BALLS_INTRO: getQueryParameter( 'maxBallsIntro' ) && parseInt( getQueryParameter( 'maxBallsIntro' ), 10 ),

    // Maximum number of balls that can be in any 1 bin in the Lab screen, e.g. maxBalls=10
    // Use this to test the 'Out of Balls!' dialog without having to wait an eternity.
    MAX_BALLS_LAB: getQueryParameter( 'maxBallsLab' ) && parseInt( getQueryParameter( 'maxBallsLab' ), 10 ),

    // Number of balls to put in the histogram at startup, e.g. populateHistogram=20
    // Use this to quickly test the histogram.
    POPULATE_HISTOGRAM: getQueryParameter( 'populateHistogram' ) && parseInt( getQueryParameter( 'populateHistogram' ), 10 ),

    // Uses 3D appearance for the Play button, see https://github.com/phetsims/plinko-probability/issues/26
    PLAY_3D: getQueryParameter( 'play3d' )
  };

  plinkoProbability.register( 'PlinkoProbabilityQueryParameters', PlinkoProbabilityQueryParameters );

  return PlinkoProbabilityQueryParameters;
} );

