// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model for Ball in Plinko Probability
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // var Property = require( 'AXON/Property' );

  var inherit = require( 'PHET_CORE/inherit' );
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

    // 0 is the topmost
    this.row = 0;

    // 0 is the leftmost
    this.column = 0;

    // 0 is left, 1 is right
    this.direction = 0;

    // 0 is the top of the current peg, 1 is the top of the next peg
    this.fallenRatio = 0;

    this.pegHistory = [];

    this.binIndex = -1;
  }

  return inherit( PropertySet, Ball, {
    reset: function() {
    },

    /**
     *
     * @param {number} binaryProbability - a number between 0 and 1, the average probability of the ball to fall to the right
     * @param {number} maxRows - an integer
     */
    pegPath: function( binaryProbability, maxRows ) {

      var direction;  // 0 is left, 1 is right
      var rowNumber;
      var columnNumber = 0;
      for ( rowNumber = 0; rowNumber <= maxRows; rowNumber++ ) {
        direction = (Math.random() < binaryProbability) ? 1 : 0;
        var peg = {
          rowNumber: rowNumber, // an integer starting at zero
          columnNumber: columnNumber, // an integer starting at zero
          direction: direction, // direction to the next peg
          unnormalizedPosition: new Vector2( columnNumber - rowNumber * 0.5, rowNumber ) //
        };
        this.pegHistory.push( peg );

        columnNumber += direction;
      }
    },

    /**
     *
     * @param {number} dt - time interval
     */
    step: function( dt ) {
      this.ballStep( dt );
    },

    ballStep: function( dt );
  {
    var df = dt;
    // Initially falling
    if ( this.phase === PHASE_INITIAL ) {
      if ( df + this.fallenRatio >= 1 ) {
        this.phase = PHASE_FALLING;
        this.fallenRatio = 0;
      }
      else {
        this.fallenRatio += df;
      }
    }

    // Falling between pegs
    if ( this.phase === PHASE_FALLING ) {
      if ( df + this.fallenRatio >= 1 ) {
        var peg = this.pegHistory.shift();
        this.column = peg.columnNumber;
        this.row = peg.rowNumber;
        this.direction = peg.direction;
        this.fallenRatio = 0;
        if ( this.pegHistory.length === 0 ) {
          this.phase = PHASE_EXIT;
        }
      }
      else {
        this.fallenRatio += df;
      }
    }

    // Out of pegs
    if ( this.phase === PHASE_EXIT ) {
      if ( df + this.fallenRatio >= 1 ) {
        this.phase = PHASE_COLLECTED;
        this.binIndex = this.column;
        this.trigger( 'landed' );
      }
      else {
        this.fallenRatio += dt;
      }
    }
    this.position = this.getPosition();
  }
  ,


    /**
     *
     * @returns {Vector2}
     */
    getPosition: function() {
      switch( this.phase ) {
        case PHASE_INITIAL:
          return new Vector2( 0, -1 + this.fallenRatio );
        case PHASE_FALLING:
          return new Vector2( this.getPositionX( this.row, this.column ) + (this.direction - 0.5) * this.fallenRatio,
            this.getPositionY( this.row, this.column ) + this.fallenRatio * this.fallenRatio );
        case PHASE_EXIT:
          return new Vector2( this.getPositionX( this.row, this.column ), this.getPositionY( this.row, this.column ) + this.fallenRatio );
        case PHASE_COLLECTED:
          return new Vector2( this.getPositionX( this.row, this.column ), this.getPositionY( this.row, this.column ) + this.fallenRatio );
      }
    },

    /**
     *
     * @param {number}  row
     * @param {number} column
     * @returns {number}
     */
    getPositionX: function( row, column ) {
      //return new GaltonBoard.getPegFromRowColumn( row, column ).position.x;
      return column - row * 0.5;
    },

    /**
     *
     * @param {number} row
     * @param {number} column
     * @returns {number}
     */
    getPositionY: function( row, column ) {
      //return new GaltonBoard.getPegFromRowColumn( row, column ).position.y;
      return row;
    }

  } );

} )

