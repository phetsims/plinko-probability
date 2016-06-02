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
  var PHASE_INITIAL = 0;      // ball leaving hopper
  var PHASE_FALLING = 1;      // ball falling within bounds of board
  var PHASE_EXIT = 2;         // ball exits the lower bounds of board and enters the bins
  var PHASE_COLLECTED = 3;    // ball lands in final position

  /**
   *
   * @param {number} probability - number ranging from 0 to 1
   * @param {number} numberOfRows - an integer
   * @param {Array.<Object>} bins
   * @constructor
   */
  function Ball( probability, numberOfRows, bins ) {

    PropertySet.call( this, {
      position: new Vector2( 0, 0 )
    } );


    this.probability = probability;
    this.numberOfRows = numberOfRows;


    this.pegSeparation = PegInterface.getSpacing( numberOfRows );


    this.ballRadius = this.pegSeparation * 0.18;

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

    // -0.5 is left, 0.5 is right
    this.direction = 0;

    // 0 is the top of the current peg, 1 is the top of the next peg
    this.fallenRatio = 0;

    this.pegHistory = []; // {Array.<Object>}

    var direction;  // -0.5 is left, 0.5 is right
    var rowNumber;
    var columnNumber = 0;
    var peg;
    for ( rowNumber = 0; rowNumber <= numberOfRows; rowNumber++ ) {
      direction = (Math.random() < probability) ? 0.5 : -0.5;
      peg = {
        rowNumber: rowNumber, // an integer starting at zero
        columnNumber: columnNumber, // an integer starting at zero
        direction: direction, // direction to the next peg,
        position: PegInterface.getPosition( rowNumber, columnNumber, numberOfRows )
      };
      this.pegHistory.push( peg );

      columnNumber += direction + 0.5;
    }

    // @public (read-only)
    // bin position of the ball {number}
    this.binIndex = peg.columnNumber;


    // @private (read-only)
    // binCount {number} indicates the number of balls in a specific cylinder
    this.binCount = bins[ this.binIndex ].binCount;


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
    /**
     * Sends the trigger to update statistics and land
     * if the ball phase is PHASE_INITIAL otherwise it does nothing
     * changes the phase to COLLECTED to make sure the triggers only get sent once
     * @public
     */
    updateStatisticsAndLand: function() {
      if ( this.phase === PHASE_INITIAL ) {
        // send triggers
        this.trigger0( 'exited' );
        this.trigger0( 'landed' );

        //changes phase
        this.phase = PHASE_COLLECTED;
      }
    },
    /**
     * @public
     * this function updates the information about the peg position based on the peg history
     */
    updatePegPositionInformation: function() {
      var peg;
      peg = this.pegHistory.shift();
      this.column = peg.columnNumber; //0 is the topmost
      this.row = peg.rowNumber; // 0 is the leftmost
      this.pegPosition = peg.position; // vector position of the peg based on the column, row, and number of of rows
      this.direction = peg.direction; // whether the ball went left or right
    },
    /**
     * @public
     * this function gets the first peg position
     */
    initialPegPositionInformation: function() {
      var peg;
      peg = this.pegHistory[ 0 ]; // get the first peg from the peg history
      this.column = peg.columnNumber; // 0 is the topmost
      this.row = peg.rowNumber; // 0 is the left most
      this.pegPosition = peg.position; // vector position of the peg
    },
    /**
     *
     * @public
     * updates the position of the ball
     */
    ballStep: function( df ) {
      if ( this.phase === PHASE_INITIAL ) { // balls is leaving the hopper
        if ( df + this.fallenRatio < 1 ) { // if the ball has not gotten to the first peg
          this.fallenRatio += df; // fall some more
          this.initialPegPositionInformation(); // get the initial peg information
        }
        else {
          this.phase = PHASE_FALLING; // switch the phase
          this.fallenRatio = 0; // reset the ratio
          this.updatePegPositionInformation(); // update the peg position information
          this.trigger0( 'playSound' );  //plays sound when ball hits peg
        }
      }
      if ( this.phase === PHASE_FALLING ) { //ball is falling between pegs
        if ( df + this.fallenRatio < 1 ) { // if ball has not reached the next peg
          this.fallenRatio += df; // fall some more
        }
        else { // the ball has reached the top of the next peg
          this.fallenRatio = 0; // reset the fallen ratio

          if ( this.pegHistory.length > 1 ) { // if it is not the last peg
            this.updatePegPositionInformation(); // update the next to last peg information
            this.trigger0( 'playSound' );  //plays sound when ball hits peg
          }
          else { // ball is at the top of the last peg
            this.phase = PHASE_EXIT; // switch phases
            this.updatePegPositionInformation(); // update the last peg information
            this.trigger0( 'exited' );
          }
        }
      }
      if ( this.phase === PHASE_EXIT ) { // the ball has exited and it is making its way to the bin
        if ( this.getPosition().y > this.finalBinVerticalPosition ) { // if it has not fallen to its final postition
          this.fallenRatio += df / 10; //fall some more
        }
        else {
          this.phase = PHASE_COLLECTED; // switch phases
          this.trigger0( 'landed' ); // mark the ball for removal
        }
      }

      // position depends of the state of the ball
      this.position = this.getPosition().addXY( 0, this.pegSeparation * PlinkoConstants.PEG_HEIGHT_FRACTION_OFFSET );
    },

    /**
     * gets the position of the ball depending on the phase
     * @returns {Vector2}
     */
    getPosition: function() {
      switch( this.phase ) {
        case PHASE_INITIAL: // ball left the hopper
          // we only want this to move one peg distance down
          var displacement = new Vector2( 0, (1 - this.fallenRatio) );  // {Vector2} describes motion of ball within bin in PHASE_INITIAL
          displacement.multiplyScalar( this.pegSeparation );
          return displacement.add( this.pegPosition );
        case PHASE_FALLING: // ball is falling through the pegs
          var fallingPosition;      // {Vector2} describes motion of ball within bin in PHASE_FALLING
          if ( this.row === this.numberOfRows - 1 ) { // if we are exiting the peg board we want to drop in the bin position
            // #TODO : Fix ball jumping on lab screen. Needs to be made more general.
            fallingPosition = new Vector2( (this.direction + this.finalBinHorizontalPosition) * this.fallenRatio, -this.fallenRatio * this.fallenRatio );
          }
          else {
            fallingPosition = new Vector2( this.direction * this.fallenRatio, -this.fallenRatio * this.fallenRatio );
          }
          fallingPosition.multiplyScalar( this.pegSeparation ); // scale the vector by the peg separation
          return fallingPosition.add( this.pegPosition );
        case PHASE_EXIT: // the ball is exiting the pegs and making its way to the bin
          return new Vector2( this.finalBinHorizontalPosition, -this.fallenRatio ).add( this.pegPosition );
        case PHASE_COLLECTED: // the ball has landed to its final position
          return new Vector2( this.finalBinHorizontalPosition, this.finalBinVerticalPosition ).addXY( this.pegPosition.x, 0 );
      }
    }

  } );

} );

