// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model for Ball in Plinko Probability
 */


define( function( require ) {
  'use strict';

  // var Property = require( 'AXON/Property' );

  var inherit = require( 'PHET_CORE/inherit' );
  //var GaltonBoard = require( 'PLINKO/plinko-probability/model/GaltonBoard' );
  //var PoolableMixin = require( 'PHET_CORE/PoolableMixin' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );


  var PHASE_INITIAL = 0;
  var PHASE_FALLING = 1;
  var PHASE_EXIT = 2;
  var PHASE_COLLECTED = 3;

  function Ball() {


    PropertySet.call( this, {
      position: new Vector2( 0, 0 )
      //   index: 'empty'
    } );

    // 0 -> Initially falling
    // 1 -> Falling between pegs
    // 2 -> Out of pegs
    // 3 -> Collected
    this.phase = PHASE_INITIAL;

    // rows and column
    /*
     the pegs are assigned a row and column ( the columns are left aligned)
     the row and column numbers start at zero
     they are arranged in the following manner

     X
     X X
     X X X
     X X X X
     */

    //0 is the topmost
    this.row = 0;

    //0 is the leftmost
    this.column = 0;

    //-1 is left, 0 is down, 1 is right
    this.direction = 0;

    //0 is the top of the current peg, 1 is the top of the next peg
    this.fallenRatio = 0;

    this.pegHistory = []; //TODO: calculate directions based on p

    this.binIndex = -1;
  }


  return inherit( PropertySet, Ball, {
    // dt {Number} is normalized in plinkoProbabilityModel
    // probability {Number}
    step: function( dt, probability, maxRows ) {
      if ( this.phase === PHASE_INITIAL ) {
        if ( dt + this.fallenRatio >= 1 ) {
          this.phase = PHASE_FALLING;
          dt -= 1 - this.fallenRatio;
          this.fallenRatio = 0;
        }
        else {
          this.fallenRatio += dt;
        }
      }

      if ( this.phase === PHASE_FALLING ) {
        while ( true ) {
          if ( this.direction === 0 ) {
            this.direction = Math.random() < probability ? 1 : -1;
          }

          if ( dt + this.fallenRatio >= 1 ) {
            dt -= 1 - this.fallenRatio;
            this.column += (this.direction === 1 ? 1 : 0);
            this.row += 1;
            this.pegHistory.push( {column: this.column, row: this.row} );

            this.fallenRatio = 0;
            this.direction = 0;
            if ( this.row >= maxRows ) {
              this.phase = PHASE_EXIT;
            }
          }
          else {
            this.fallenRatio += dt;
            break;
          }
        }
      }

      if ( this.phase === PHASE_EXIT ) {
        if ( dt + this.fallenRatio >= 1 ) {
          this.phase = PHASE_COLLECTED;
          // dt -= 1 - this.fallenRatio;
          this.binIndex = this.column;
          this.trigger( 'landed' );
          //this.fallenRatio = 0;
        }
        else {
          this.fallenRatio += dt;
        }
      }
      this.position = this.getPosition();
    },

    reset: function() {

    },

    getPosition: function() {
      switch( this.phase ) {
        case PHASE_INITIAL:
          return new Vector2( 0, -1 + this.fallenRatio );
        case PHASE_FALLING:
          return new Vector2( this.getPositionX( this.row, this.column ) + 0.5 * (this.direction) * this.fallenRatio,
            this.getPositionY( this.row, this.column ) + this.fallenRatio * this.fallenRatio );
        case PHASE_EXIT:
          return new Vector2( this.getPositionX( this.row, this.column ), this.getPositionY( this.row, this.column ) + this.fallenRatio );
        case PHASE_COLLECTED:
          return new Vector2( this.getPositionX( this.row, this.column ), this.getPositionY( this.row, this.column ) + this.fallenRatio );
      }
    },

    getPositionX: function( row, column ) {
      //return new GaltonBoard.getPegFromRowColumn( row, column ).position.x;
      return column - row * 0.5;
    },

    getPositionY: function( row, column ) {
      //return new GaltonBoard.getPegFromRowColumn( row, column ).position.y;
      return row;
    }

  } );

} );

