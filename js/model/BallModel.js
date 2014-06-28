// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for Ball in Plinko Probability
 */


define( function( require ) {
  'use strict';

  var Property = require( 'AXON/Property' );
  var Poolable = require( 'PHET_CORE/Poolable' );

  function BallModel() {

    // 0 -> Initially falling
    // 1 -> Falling between pegs
    // 2 -> Out of pegs
    // 3 -> Collected
    this.phase = 0;

    //0 is the leftmost
    this.row = 0;

    //0 is the topmost
    this.column = 0;

    //-1 is left, 0 is down, 1 is right
    this.direction = 0;

    //0 is the top of the current peg, 1 is the top of the next peg
    this.fallenRatio = 0;

    this.path = []; //TODO: calculate directions based on p


  }

  BallModel.prototype = {
    constructor: BallModel,

    step: function( dt ) {
      //TODO: If not show path...
      if (this.phase === 0) {

      }
      else if (this.phase === 1) {

      }
      else if (this.phase === 2) {

      }
    },

    reset: function() {

    }

  };

  Poolable( BallModel, {
    defaultFactory: function() { return new BallModel(); }
  } );

  return BallModel;
} );