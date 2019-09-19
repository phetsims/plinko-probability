// Copyright 2014-2019, University of Colorado Boulder

/**
 * Model for Ball in Plinko Probability
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const BallPhase = require( 'PLINKO_PROBABILITY/common/model/BallPhase' );
  const Emitter = require( 'AXON/Emitter' );
  const GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
  const inherit = require( 'PHET_CORE/inherit' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  const Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {number} probability - number ranging from 0 to 1
   * @param {number} numberOfRows - an integer
   * @param {Array.<Object>} bins
   * @constructor
   */
  function Ball( probability, numberOfRows, bins ) {

    // position vector
    this.position = new Vector2( 0, 0 ); // @public (read-only)

    this.probability = probability; // @private (read-only)
    this.numberOfRows = numberOfRows; // @private (read-only)

    this.pegSeparation = GaltonBoard.getPegSpacing( numberOfRows ); // @public (read-only)

    this.ballRadius = this.pegSeparation * PlinkoProbabilityConstants.BALL_SIZE_FRACTION;  // @public (read-only)

    this.phase = BallPhase.INITIAL; // @public (read-only), see BallPhase

    // @public
    this.ballHittingPegEmitter = new Emitter( {
      parameters: [ { validValues: [ 'left', 'right' ] } ]
    } );
    this.ballOutOfPegsEmitter = new Emitter();
    this.ballCollectedEmitter = new Emitter();

    // rows and column
    /*
     * the pegs are assigned a row and column ( the columns are left aligned)
     * the row and column numbers start at zero
     * they are arranged in the following manner
     *
     *   X
     *   X X
     *   X X X
     *   X X X X
     */

    // 0 is the topmost
    this.row = 0; // @private

    // the direction in which the ball is going 'left','right'
    this.direction = 'left';  // @public (read-only)

    // 0 is the top of the current peg, 1 is the top of the next peg
    this.fallenRatio = 0; // @private

    // contains the pegs which the ball will touch
    this.pegHistory = []; // @public (read-only) {Array.<Object>}

    this.finalBinHorizontalOffset = 0; // @public describes final horizontal offset of ball within a bin {number}
    this.finalBinVerticalOffset = 0;  // @public describes final vertical offset of ball within a bin {number}

    let direction;  // 'left', 'right'
    let rowNumber;
    let columnNumber = 0;
    let peg; // {Object}

    // the path of the balls through the pegs of the galton board  is determined
    for ( rowNumber = 0; rowNumber <= numberOfRows; rowNumber++ ) {
      direction = ( phet.joist.random.nextDouble() > probability ) ? 'left' : 'right';
      peg = {
        rowNumber: rowNumber, // an integer starting at zero
        positionX: getPegPositionX( rowNumber, columnNumber, numberOfRows ),
        positionY: getPegPositionY( rowNumber, columnNumber, numberOfRows ),
        direction: direction // direction to the next peg
      };

      this.pegHistory.push( peg );

      // increment the column number of the next row, but not for the last row
      if ( rowNumber < numberOfRows ) {
        columnNumber += ( direction === 'left' ) ? 0 : 1;
      }
    }

    // @public (read-only)
    // bin position of the ball {number}
    this.binIndex = columnNumber;

    // @public (read-only)
    // binCount {number} indicates the number of balls in a specific cylinder
    this.binCount = bins[ columnNumber ].binCount;

    // increment the number of balls in this index by one
    this.binCount++;

  }

  plinkoProbability.register( 'Ball', Ball );

  /**
   * Function that returns the X position of a peg with index rowNumber and column Number
   * The position is given in the model view (with respect to the galton board)
   *
   * @param {number} rowNumber
   * @param {number} columnNumber
   * @param {number} numberOfRows
   * @returns {number}
   * @public
   */
  var getPegPositionX = function( rowNumber, columnNumber, numberOfRows ) {
    return ( -rowNumber / 2 + columnNumber ) / ( numberOfRows + 1 );
  };

  /**
   * Function that returns the Y position of a peg with index rowNumber and column Number
   * The position is given in the model view (with respect to the galton board)
   *
   * @param {number} rowNumber
   * @param {number} columnNumber
   * @param {number} numberOfRows
   * @returns {number}
   * @public
   */
  var getPegPositionY = function( rowNumber, columnNumber, numberOfRows ) {
    return ( -rowNumber - 2 * PlinkoProbabilityConstants.PEG_HEIGHT_FRACTION_OFFSET ) / ( numberOfRows + 1 );
  };

  return inherit( Object, Ball, {

    /**
     * @param {number} dt - time interval
     * @returns {boolean} true if the ball moved, false if it didn't move
     * @public
     */
    step: function( dt ) {
      return this.ballStep( dt );
    },

    /**
     * Updates the peg information (rowNumber, columnNumber, and location) used for determining ball position
     * check and changes the phase of the ball.
     * Plays a sounds when the ball hits a peg
     * Emits when the ball has exited so that it can be added to statistics
     * Emits when the ball has landed so that it doesn't get painted when it doesn't need to
     * updates the position of the ball
     *
     * @param {number} df - fraction of falling between pegs
     * @returns {boolean} true if the ball moved, false if it didn't move
     * @private
     */
    ballStep: function( df ) {

      if ( this.phase === BallPhase.COLLECTED ) {
        // do nothing, the ball is at rest in a bin
        return false;
      }
      else if ( this.phase === BallPhase.INITIAL ) { // balls is leaving the hopper
        if ( df + this.fallenRatio < 1 ) { // if the ball has not gotten to the first peg
          this.initializePegPosition(); // get the initial peg information
          this.fallenRatio += df; // fall some more
        }
        else {
          this.phase = BallPhase.FALLING; // switch the phase
          this.fallenRatio = 0; // reset the ratio
          this.updatePegPosition(); // update the peg position information
          this.ballHittingPegEmitter.emit( this.direction ); // can play a sound when ball hits peg;
        }
      }
      else if ( this.phase === BallPhase.FALLING ) { //ball is falling between pegs
        if ( df + this.fallenRatio < 1 ) { // if ball has not reached the next peg
          this.fallenRatio += df; // fall some more
        }
        else { // the ball has reached the top of the next peg
          this.fallenRatio = 0; // reset the fallen ratio

          if ( this.pegHistory.length > 1 ) { // if it is not the last peg
            this.updatePegPosition(); // update the next to last peg information
            this.ballHittingPegEmitter.emit( this.direction ); // can play a sound when ball hits peg;
          }
          else { // ball is at the top of the last peg
            this.phase = BallPhase.EXITED; // switch phases
            this.updatePegPosition(); // update the last peg information
            this.ballOutOfPegsEmitter.emit();
          }
        }
      }
      else if ( this.phase === BallPhase.EXITED ) { // the ball has exited and it is making its way to the bin
        // the position at which the balls will eventually land
        const finalPosition = this.finalBinVerticalOffset + this.pegSeparation * PlinkoProbabilityConstants.PEG_HEIGHT_FRACTION_OFFSET;
        if ( this.position.y > finalPosition ) { // if it has not fallen to its final position

          // The change in the fallen ratio needs to be scaled by the peg separation so that it matches the speed everywhere else.
          // Multiply by 2 to make the balls fall a bit faster once they've entered the bins, see #63
          this.fallenRatio += 2 * df * this.pegSeparation;
        }
        else {
          this.phase = BallPhase.COLLECTED; // switch phases
          this.ballCollectedEmitter.emit(); // mark the ball for removal
        }
      }

      // update the position of the ball
      this.updatePosition();
      return true;
    },

    /**
     * Updates the position of the ball depending on the phase.
     * @private
     */
    updatePosition: function() {
      switch( this.phase ) {

        // ball left the hopper
        case BallPhase.INITIAL:

          // we only want this to move one peg distance down
          // set the position be at some point between the hopper and the first peg
          this.position.setXY( 0, ( 1 - this.fallenRatio ) );

          // scale it so that it does not move too much
          this.position.multiplyScalar( this.pegSeparation );

          // add the position of the first peg
          this.position.addXY( this.pegPositionX, this.pegPositionY );
          break;

        // ball is falling through the pegs
        case BallPhase.FALLING:

          // steer the ball to the left or right depending on this.direction
          var shift = ( this.direction === 'left' ) ? -0.5 : 0.5;

          // mimic the fall as a parabolic motion
          this.position.setXY( shift * this.fallenRatio, -this.fallenRatio * this.fallenRatio );

          // get the ball aligned with its final x position in the bin.
          this.position.multiplyScalar( this.pegSeparation ); // scale the vector by the peg separation

          // exit from the last row with the correct alignment with the bin
          if ( this.row === this.numberOfRows - 1 ) {
            // transition
            this.position.addXY( this.finalBinHorizontalOffset * this.fallenRatio, 0 );
          }
          this.position.addXY( this.pegPositionX, this.pegPositionY );
          break;

        // the ball is exiting the pegs and making its way to the bin
        case BallPhase.EXITED:
          this.position.setXY( this.finalBinHorizontalOffset, -this.fallenRatio );
          this.position.addXY( this.pegPositionX, this.pegPositionY );
          break;

        // the ball has landed to its final position
        case BallPhase.COLLECTED:
          this.position.setXY( this.finalBinHorizontalOffset, this.finalBinVerticalOffset );
          this.position.addXY( this.pegPositionX, 0 );
          break;

        default:
          throw new Error( 'invalid phase: ' + this.phase );
      }

      // add a vertical offset, such that the balls do not reach the pegs but are over the pegs.
      this.position.addXY( 0, this.pegSeparation * PlinkoProbabilityConstants.PEG_HEIGHT_FRACTION_OFFSET );
    },

    /**
     * Sends the trigger to update statistics and land.
     * If the ball phase is BallPhase.INITIAL it does nothing.
     * Otherwise notifies observers and changes the phase to BallPhase.COLLECTED to make sure the triggers only get sent once.
     * The ball will not be stepped through the other intermediate phases.
     *
     * @public
     */
    updateStatisticsAndLand: function() {
      if ( this.phase === BallPhase.INITIAL ) {

        // send triggers
        this.ballOutOfPegsEmitter.emit();
        this.ballCollectedEmitter.emit();

        // change phase to indicate that ball has landed in bin
        this.phase = BallPhase.COLLECTED;
      }
    },

    /**
     * Initializes the peg position.
     * @private
     */
    initializePegPosition: function() {
      const peg = this.pegHistory[ 0 ]; // get the first peg from the peg history
      this.row = peg.rowNumber; // 0 is the left most
      this.pegPositionX = peg.positionX; // x position of the peg based on the column, row, and number of of rows
      this.pegPositionY = peg.positionY; // y position of the peg based on the column, row, and number of of rows
    },

    /**
     * Updates the peg position.
     * @private
     */
    updatePegPosition: function() {
      const peg = this.pegHistory.shift();
      this.row = peg.rowNumber; // 0 is the leftmost
      this.pegPositionX = peg.positionX; // x position of the peg based on the column, row, and number of of rows
      this.pegPositionY = peg.positionY; // y position of the peg based on the column, row, and number of of rows
      this.direction = peg.direction; // whether the ball went left or right
    }
  } );
} );
