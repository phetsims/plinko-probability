// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for Plinko Probability Intro
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
    'use strict';

    // modules
    var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
    var IntroBall = require( 'PLINKO_PROBABILITY/intro/model/IntroBall' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Timer = require( 'PHET_CORE/Timer' );
    var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
    var PlinkoProbabilityCommonModel = require( 'PLINKO_PROBABILITY/common/model/PlinkoProbabilityCommonModel' );

    // constants
    var MAX_BALL_NUMBER = 100;
    var PERSPECTIVE_TILT = Math.PI / 1.4; // in radians

    /**
     * Main model of the first tab (intro tab) of the plinko probability simulation
     * @constructor
     */
    function PlinkoProbabilityIntroModel() {

      PlinkoProbabilityCommonModel.call( this );

      this.timerID = [];

      var bounds = PlinkoConstants.HISTOGRAM_BOUNDS;
      var binWidth = bounds.width / (this.numberOfRows + 1); // the width of one bin is the total width divided by the number of rows
      var cylinderWidth = 0.95 * binWidth;
      var ellipseHeight = cylinderWidth * Math.sin( PERSPECTIVE_TILT ); // the height is the width times some perspective tilt
      this.cylinderInfo = {
        height: bounds.height * 0.90, // we want the cylinders to be shorter than the histogram
        cylinderWidth: cylinderWidth, // there is a small gap between each cylinder
        ellipseHeight: ellipseHeight,
        verticalOffset: 0.035, // gap between pegboard and cylinders
        top: bounds.maxY
      };
    }


    plinkoProbability.register( 'PlinkoProbabilityIntroModel', PlinkoProbabilityIntroModel );

    return inherit( PlinkoProbabilityCommonModel, PlinkoProbabilityIntroModel, {

      /**
       * time step function that is responsible for updating the position and status of tehe balls.
       * @public
       * @param {number} dt - a small time interval
       */
      step: function( dt ) {
        this.balls.forEach( function( ball ) {
          ball.step( dt * 5 );
        } );
      },

      /**
       * resets timer for each ball
       * @public
       */
      reset: function() {
        this.resetTimer();
        PlinkoProbabilityCommonModel.prototype.reset.call( this );
      },

      /**
       * Reset of the Timer to ensure that all the step listeners are prevented from being called back
       * @public
       */
      resetTimer: function() {
        // check that if this.timerID contains any scheduled timeout
        if ( this.timerID ) {
          // clear all the timeO
          this.timerID.forEach( function( timerIdElement ) {
            Timer.clearTimeout( timerIdElement );
          } );
          // clear out the array
          this.timerID = [];
        }
      },

      /**
       * Play function adds balls to the model, the number of balls added depends on the status of ballMode.
       * The function updates the total number of launched balls
       * @private
       */
      play: function() {
        var i = 0;
        var timerIDnumber;
        var thisModel = this;
        switch( this.ballMode ) {
          case 'oneBall':
            if ( this.launchedBallsNumber < MAX_BALL_NUMBER ) {
              this.launchedBallsNumber++;
              this.addNewBall();
            }
            break;

          case 'tenBalls':
            var maxBallNumberTenCase = 10;
            for ( i; (i < maxBallNumberTenCase) && (this.launchedBallsNumber < MAX_BALL_NUMBER); i++ ) {
              this.launchedBallsNumber++;
              timerIDnumber = Timer.setTimeout( function() { thisModel.addNewBall();}, (i * 500) ); /// measured in milliseconds
              this.timerID.push( timerIDnumber );
            }
            break;

          case 'allBalls':
            for ( i; this.launchedBallsNumber < MAX_BALL_NUMBER; i++ ) {
              this.launchedBallsNumber++;
              timerIDnumber = Timer.setTimeout( function() { thisModel.addNewBall();}, (i * 300) ); /// measured in milliseconds
              this.timerID.push( timerIDnumber );
            }
            break;

          default:
            throw new Error( 'Unhandled galton Board Radio Button state: ' + this.galtonBoardRadioButton );

        }
      },

      /**
       * Add a new Ball to the model
       * @private
       */
      addNewBall: function() {
        var thisModel = this;
        //create new ball
        var addedBall = new IntroBall( this.probability, this.numberOfRows, this.histogram.bins, this.cylinderInfo );
        // update number of balls in the bin and the last position of the addedBall
        this.histogram.updateBinCountAndOrientation( addedBall );
        this.balls.push( addedBall );
        //'exited' is triggered when the addedBall leaves the last peg on the Galton board.
        addedBall.on( 'exited', function() {
          thisModel.histogram.addBallToHistogram( addedBall );
        } );
        //triggers sound to play when ball hits a peg
        addedBall.on( 'playSound', function() {
          thisModel.playBallHittingPegSound( addedBall.direction );
        } );
      }
    } );
  }
)
;



