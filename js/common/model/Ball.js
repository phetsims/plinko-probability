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
  var Random = require( 'DOT/Random' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector2 = require( 'DOT/Vector2' );

  // convenience variables
  var random = new Random();
  var scratchVector = new Vector2(); // @private updated throughout falling phase to prevent multiple Vector2() calls.

  // constants
  var PHASE_INITIAL = 0;         // ball leaving hopper
  var PHASE_FALLING = 1;         // ball falling within bounds of board
  var PHASE_EXIT = 2;            // ball exits the lower bounds of board and enters the bins
  var PHASE_COLLECTED = 3;       // ball lands in final position

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

    this.probability = probability; // @private {read-only}
    this.numberOfRows = numberOfRows; // @private {read-only}

    this.pegSeparation = PegInterface.getSpacing( numberOfRows ); // @public {read-only}

    this.ballRadius = this.pegSeparation * PlinkoConstants.BALL_SIZE_FRACTION;  // @public {read-only}

    // 0 -> Initially falling
    // 1 -> Falling between pegs
    // 2 -> Out of pegs
    // 3 -> Collected
    this.phase = PHASE_INITIAL; // @private

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
    this.row = 0; // @private


    // 'left','right'
    this.direction = 'left';  // @public {read-only}

    // 0 is the top of the current peg, 1 is the top of the next peg
    this.fallenRatio = 0; // @private

    this.pegHistory = []; // {Array.<Object>}

    this.finalBinHorizontalOffset = 0; // @public describes final horizontal offset of ball within a bin {number}
    this.finalBinVerticalOffset = 0;  // @public describes final vertical offset of ball within a bin {number}

    var direction;  // 'left', 'right'
    var rowNumber;
    var columnNumber = 0;
    var peg; // {Object}

    // the path of the balls through the pegs of the galton board  is determined
    for ( rowNumber = 0; rowNumber <= numberOfRows; rowNumber++ ) {
      direction = (random.random() > probability) ? 'left' : 'right';
      peg = {
        rowNumber: rowNumber, // an integer starting at zero
        positionX: PegInterface.getPositionX( rowNumber, columnNumber, numberOfRows ),
        positionY: PegInterface.getPositionY( rowNumber, columnNumber, numberOfRows ),
        direction: direction // direction to the next peg
      };

      this.pegHistory.push( peg );

      // increment the column number of the next row, but not for the last row
      if ( rowNumber < numberOfRows ) {
        columnNumber += (direction === 'left') ? 0 : 1;
      }
    }

    // @public (read-only)
    // bin position of the ball {number}
    this.binIndex = columnNumber;

    // @private (read-only)
    // binCount {number} indicates the number of balls in a specific cylinder
    this.binCount = bins[ columnNumber ].binCount;

    // increment the number of balls in this index by one
    this.binCount++;

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
     * this function updates the information about the peg position based on the peg history
     * @public
     */
    updatePegPositionInformation: function() {
      var peg;
      peg = this.pegHistory.shift();
      this.row = peg.rowNumber; // 0 is the leftmost
      this.pegPositionX = peg.positionX; // x position of the peg based on the column, row, and number of of rows
      this.pegPositionY = peg.positionY; // y position of the peg based on the column, row, and number of of rows
      this.direction = peg.direction; // whether the ball went left or right
    },
    /**
     * this function gets the first peg position
     * @public
     */
    initialPegPositionInformation: function() {
      var peg;
      peg = this.pegHistory[ 0 ]; // get the first peg from the peg history
      this.row = peg.rowNumber; // 0 is the left most
      this.pegPositionX = peg.positionX; // x position of the peg based on the column, row, and number of of rows
      this.pegPositionY = peg.positionY; // y position of the peg based on the column, row, and number of of rows
    },
    /**
     *
     * Updates the position of the ball
     * @param {number} df - the time difference in seconds
     * @public
     */
    ballStep: function( df ) {
      if ( this.phase === PHASE_INITIAL ) { // balls is leaving the hopper
        if ( df + this.fallenRatio < 1 ) { // if the ball has not gotten to the first peg
          this.initialPegPositionInformation(); // get the initial peg information
          this.fallenRatio += df; // fall some more
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
        if ( this.getPosition().y > this.finalBinVerticalOffset ) { // if it has not fallen to its final position

          // the change in the fallen ratio needs to be scaled by the peg separation so that it matches the speed everywhere else
          this.fallenRatio += df * this.pegSeparation;
        }
        else {
          this.phase = PHASE_COLLECTED; // switch phases
          this.trigger0( 'landed' ); // mark the ball for removal
        }
      }

      // position depends of the state of the ball
      this.position = this.getPosition().addXY( 0, this.pegSeparation * PlinkoConstants.PEG_HEIGHT_FRACTION_OFFSET );
      this.positionProperty.notifyObserversStatic();
    },

    /**
     * gets the position of the ball depending on the phase
     * @returns {Vector2}
     */
    getPosition: function() {
      switch( this.phase ) {
        case PHASE_INITIAL: // ball left the hopper
          // we only want this to move one peg distance down
          var displacement = scratchVector.setXY( 0, (1 - this.fallenRatio) );  // {Vector2} describes motion of ball within bin in PHASE_INITIAL
          displacement.multiplyScalar( this.pegSeparation );
          return displacement.addXY( this.pegPositionX, this.pegPositionY );
        case PHASE_FALLING: // ball is falling through the pegs
          // steer the ball to the left or right depending on this.direction
          var shift = (this.direction === 'left') ? -0.5 : 0.5;

          // mimic the fall as a parabolic motion
          var fallingPosition = scratchVector.setXY( shift * this.fallenRatio, -this.fallenRatio * this.fallenRatio );

          // get the ball aligned with its final x position in the bin.
          fallingPosition.multiplyScalar( this.pegSeparation ); // scale the vector by the peg separation

          // exit from the last row with the correct alignment with the bin
          if ( this.row === this.numberOfRows - 1 ) {
            // transition
            fallingPosition.addXY( this.finalBinHorizontalOffset * this.fallenRatio, 0 );
          }
          return fallingPosition.addXY( this.pegPositionX, this.pegPositionY );
        case PHASE_EXIT: // the ball is exiting the pegs and making its way to the bin
          return scratchVector.setXY( this.finalBinHorizontalOffset, -this.fallenRatio ).addXY( this.pegPositionX, this.pegPositionY );
        case PHASE_COLLECTED: // the ball has landed to its final position
          return scratchVector.setXY( this.finalBinHorizontalOffset, this.finalBinVerticalOffset ).addXY( this.pegPositionX, 0 );
      }
    }

  } );

} );

