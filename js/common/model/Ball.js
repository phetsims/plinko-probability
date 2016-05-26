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
   * @param {Array.<{binCount,direction}>} cylindersNumberOfBallsAndLastPosition - an array containing the [number of balls in bin , last position of ball]
   * @constructor
   */
  function Ball( probability, numberOfRows, cylindersNumberOfBallsAndLastPosition ) {

    PropertySet.call( this, {
      position: new Vector2( 0, 0 )
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

    // -0.5 is left, 0.5 is right
    this.direction = 0;

    // 0 is the top of the current peg, 1 is the top of the next peg
    this.fallenRatio = 0;

    this.pegHistory = []; // {Array.<Object>}

    var direction;  // 0 is left, 1 is right
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


    // @public (read-only)
    // binDirection {number} takes values -1 (left), 0 (center), 1 (right)
    this.binDirection = cylindersNumberOfBallsAndLastPosition[ this.binIndex ].direction;

    // @private (read-only)
    // binCount {number} indicates the number of balls in a specific cylinder
    this.binCount = cylindersNumberOfBallsAndLastPosition[ this.binIndex ].binCount;

    // Indicates ball horizontal position in bin
    switch( this.binCount % 3 ) {
      case 0:     // Ball makes probabilistic decision whether to end in left or right horizontal position in the bin
        this.binDirection = (Math.random() < 0.5) ? 1 : -1;
        break;
      case 1:     // Ball makes decision to end in left horizontal position in the bin
        this.binDirection *= -1;
        break;
      case 2:     // Ball makes decision to end in left horizontal position in the bin
        this.binDirection = 0;
        break;

      default:
        throw new Error( 'Unhandled bin direction' );
    }
    this.binCount++;

    // @public
    // describes number of rows in the ball stack within a bin {number}
    this.binStackLevel = 2 * Math.floor( this.binCount / 3 ) + ((this.binCount % 3 === 0) ? 0 : 1);

    // @public
    // describes final vertical position of ball within a bin {number}
    this.finalBinVerticalPosition = 8.5 - (0.4 * this.binStackLevel);

    // @public
    // describes final horizontal position of ball within a bin {number}
    this.finalBinHorizontalPosition = this.binDirection / 4;

    this.indexOfBall = this.indexOfEveryBall( cylindersNumberOfBallsAndLastPosition );
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

    /**
     *Indexes every instance of a ball.
     * @param {Array.<{binCount,direction}>} binCountArray
     * @public
     */
    indexOfEveryBall: function( binCountArray ) {
      var tempCount = 0;
      for ( var i = 0; i < binCountArray.length; i++ ) {
        tempCount += binCountArray[ i ].binCount;
      }
      return tempCount;
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
          var displacement = new Vector2( 0, (1 - this.fallenRatio) );  // {Vector2} describes motion of ball within bin in PHASE_INITIAL
          displacement.multiplyScalar( this.pegSeparation );
          return displacement.add( this.pegPosition );
        case PHASE_FALLING:
          var fallingPosition;      // {Vector2} describes motion of ball within bin in PHASE_FALLING
          if ( this.row === 11 ) {
            // #TODO : Fix ball jumping on lab screen. Needs to be made more general.
            fallingPosition = new Vector2( (this.direction + this.finalBinHorizontalPosition) * this.fallenRatio, -this.fallenRatio * this.fallenRatio );
            fallingPosition.multiplyScalar( this.pegSeparation );
          }
          else {
            fallingPosition = new Vector2( this.direction * this.fallenRatio, -this.fallenRatio * this.fallenRatio );
            fallingPosition.multiplyScalar( this.pegSeparation );
          }
          return fallingPosition.add( this.pegPosition );
        case PHASE_EXIT:
          return new Vector2( this.finalBinHorizontalPosition, -this.fallenRatio ).multiplyScalar( this.pegSeparation ).add( this.pegPosition );
        case PHASE_COLLECTED:
          return new Vector2( this.finalBinHorizontalPosition, -this.finalBinVerticalPosition ).multiplyScalar( this.pegSeparation ).add( this.pegPosition );
      }
    }

  } );

} );

