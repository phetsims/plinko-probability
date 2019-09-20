// Copyright 2016-2019, University of Colorado Boulder

/**
 * Describes "phases" of a ball, on its journey from the hopper to a bin.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );

  const BallPhase = {
    INITIAL: 0,   // ball has left the hopper
    FALLING: 1,   // ball is falling within bounds of board
    EXITED: 2,    // ball has exited the lower bounds of board and entered a bin
    COLLECTED: 3  // ball has landed in final position
  };

  plinkoProbability.register( 'BallPhase', BallPhase );

  // make enum immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( BallPhase ); }

  return BallPhase;
} );