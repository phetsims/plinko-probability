// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for Ball in Plinko Probability
 */


define( function( require ) {
  'use strict';

  // var Property = require( 'AXON/Property' );
  var Poolable = require( 'PHET_CORE/Poolable' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Peg = require( 'PLINKO/utils/Peg' );

  function Ball() {
    // 0 -> Initially falling
    // 1 -> Falling between pegs
    // 2 -> Out of pegs
    // 3 -> Collected
    this.phase = Ball.PHASE_INITIAL;

    //0 is the topmost
    this.row = 0;

    //0 is the leftmost
    this.column = 0;

    //-1 is left, 0 is down, 1 is right
    this.direction = 0;

    //0 is the top of the current peg, 1 is the top of the next peg
    this.fallenRatio = 0;

    this.path = []; //TODO: calculate directions based on p
  }

  Ball.PHASE_INITIAL = 0;
  Ball.PHASE_FALLING = 1;
  Ball.PHASE_EXIT = 2;
  Ball.PHASE_COLLECTED = 3;

  window.Ball = Ball;

  inherit(Object, Ball, {
    // dt {Number} is normalized in plinkoProbabilityModel
    // probability {Number}
    step: function( dt, probability, maxRows ) {
      if (this.phase === Ball.PHASE_INITIAL) {
        if (dt + this.fallenRatio >= 1) {
          this.phase = Ball.PHASE_FALLING;
          dt -= 1 - this.fallenRatio;
          this.fallenRatio = 0;
        }
        else {
          this.fallenRatio += dt;
        }
      }

      if (this.phase === Ball.PHASE_FALLING) {
        while (true) {
          if (this.direction === 0) {
            this.direction = Math.random() < probability ? 1 : -1;
          }

          if (dt + this.fallenRatio >= 1) {
            dt -= 1 - this.fallenRatio;
            this.column += (this.direction === 1 ? 1 : 0);
            this.row += 1;

            this.fallenRatio = 0;
            this.direction = 0;
            if (this.row >= maxRows) {
              this.phase = Ball.PHASE_EXIT;
            }
          }
          else {
            this.fallenRatio += dt;
            break;
          }
        }
      }

      if (this.phase === Ball.PHASE_EXIT) {
        if (dt + this.fallenRatio >= 1) {
          this.phase = Ball.PHASE_COLLECTED;
          dt -= 1 - this.fallenRatio;
          this.fallenRatio = 0;
        }
        else {
          this.fallenRatio += dt;
        }
      }

      console.log(this.phase, this.row, dt, this.fallenRatio);

    },

    reset: function() {

    },

    getPosition: function() {
      switch (this.phase) {
        case Ball.PHASE_INITIAL: 
          return new Vector2(0, 1 - this.fallenRatio);
        case Ball.PHASE_FALLING:
          return new Vector2(Peg.getPositionX(this.row, this.column) + this.direction * this.fallenRatio, 
            Peg.getPositionY(this.row, this.column) - this.fallenRatio * this.fallenRatio);
        case Ball.PHASE_EXIT:
          return new Vector2(0, Peg.getPositionY(this.row, this.column) + this.fallenRatio);
      }
    }
  });

  /* jshint -W064 */
  Poolable( Ball, {
    defaultFactory: function() { return new Ball(); }
  } );

  return Ball;
} );
