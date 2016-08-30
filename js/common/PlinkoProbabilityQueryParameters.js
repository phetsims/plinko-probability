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

    // number of balls to put in the histogram at startup, e.g. populateHistogram=20
    POPULATE_HISTOGRAM: getQueryParameter( 'populateHistogram' ) && parseInt( getQueryParameter( 'populateHistogram' ) )
  };

  plinkoProbability.register( 'PlinkoProbabilityQueryParameters', PlinkoProbabilityQueryParameters );

  return PlinkoProbabilityQueryParameters;
} );

