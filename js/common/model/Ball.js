// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for Ball in Plinko Probability
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PegInterface = require( 'PLINKO_PROBABILITY/common/model/PegInterface' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var PHASE_INITIAL = 0;
  var PHASE_FALLING = 1;
  var PHASE_EXIT = 2;
  var PHASE_COLLECTED = 3;

  /**
   *
   * @param {number} probability - number ranging from 0 to 1
   * @param {number} numberOfRows - an integer
   * @constructor
   */
  function Ball( probability, numberOfRows ) {

    PropertySet.call( this, {
      position: new Vector2( 0, 0 )
      //   index: 'empty'
    } );


    this.probability = probability;
    this.numberOfRows = numberOfRows;


    this.pegSeparation = PegInterface.getSpacing( numberOfRows );


    this.ballRadius = this.pegSeparation * 0.25 / 1.6;

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

    this.pegHistory = []; // {Array.<Object>}

    var direction;  // 0 is left, 1 is right
    var rowNumber;
    var columnNumber = 0;
    var peg;
    for ( rowNumber = 0; rowNumber <= numberOfRows; rowNumber++ ) {
      direction = (Math.random() < probability) ? 1 : 0;
      peg = {
        rowNumber: rowNumber, // an integer starting at zero
        columnNumber: columnNumber, // an integer starting at zero
        direction: direction, // direction to the next peg,
        position: PegInterface.getPosition( rowNumber, columnNumber, numberOfRows )
      };
      this.pegHistory.push( peg );

      columnNumber += direction;
    }

    // bin position of the ball
    this.binIndex = peg.columnNumber;
    this.numberOfBalls = 0;

  }

  plinkoProbability.register( 'Ball', Ball );

  return inherit( PropertySet, Ball, {
    reset: function() {
    },

    /**
     *
     * @param {number} dt - time interval
     */
    step: function( dt ) {
      this.ballStep( dt );
    },

    path: function() {
      this.trigger( 'exited' );
      this.trigger( 'landed' );
    },
    updatePegPositionInformation: function() {
      var peg;
      peg = this.pegHistory.shift();
      this.column = peg.columnNumber;
      this.row = peg.rowNumber;
      this.pegPosition = peg.position;
      this.direction = peg.direction;
    },
    initialPegPositionInformation: function() {
      var peg;
      peg = this.pegHistory[ 0 ];
      this.column = peg.columnNumber;
      this.row = peg.rowNumber;
      this.pegPosition = peg.position;
    },

    ballStep: function( dt ) {
      // all of the logic involving the motion to the pegs has been moved to PlinkoProbabilityIntroModel.js
      //TODO: add motion logic to the lab model. It is broken at this point.
      this.position = this.getPosition().addXY( 0, this.pegSeparation * PlinkoConstants.PEG_HEIGHT_FRACTION_OFFSET );
    },


    /**
     *
     * @returns {Vector2}
     */
    getPosition: function() {
      switch( this.phase ) {
        case PHASE_INITIAL:
          var displacement = new Vector2( 0, (1 - this.fallenRatio) );
          displacement.multiplyScalar( this.pegSeparation );
          return this.pegPosition.plus( displacement );
        case PHASE_FALLING:
          var fallingPosition = new Vector2( (this.direction - 0.5) * this.fallenRatio, -this.fallenRatio * this.fallenRatio );
          fallingPosition.multiplyScalar( this.pegSeparation );
          return this.pegPosition.plus( fallingPosition );
        case PHASE_EXIT:
          return this.pegPosition.plus( new Vector2( 0, -this.fallenRatio * this.pegSeparation ) );
        case PHASE_COLLECTED:
          return this.pegPosition.plus( new Vector2( 0, -this.fallenRatio * this.pegSeparation ) );
      }
    }

  } );

} );

