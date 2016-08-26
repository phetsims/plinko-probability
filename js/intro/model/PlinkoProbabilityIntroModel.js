// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for Plinko Probability Intro
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroBall = require( 'PLINKO_PROBABILITY/intro/model/IntroBall' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
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
    this.addProperty( 'galtonBoardRadioButton', 'ball' ); // acceptable value 'ball'

    var bounds = PlinkoConstants.HISTOGRAM_BOUNDS;
    var binWidth = bounds.width / ( this.numberOfRows + 1 ); // the width of one bin is the total width divided by the number of columns
    var cylinderWidth = 0.95 * binWidth; // there is a small gap between each cylinder
    var ellipseHeight = cylinderWidth * Math.sin( PERSPECTIVE_TILT ); // the height is the width times some perspective tilt

    this.cylinderInfo = { // @public (read-only)
      height: bounds.height * 0.87, // we want the cylinders to be shorter than the histogram
      cylinderWidth: cylinderWidth,
      ellipseHeight: ellipseHeight, // the height of the ellipse
      verticalOffset: 0.035, // gap between pegboard and cylinders
      top: bounds.maxY // the top of the cylinders
    };

    this.launchedBallsNumber = 0; // @public {number} - number of balls created
    this.ballsToCreateNumber = 0; // @public {number} - an integer number representing the number of balls in the creation queue
  }

  plinkoProbability.register( 'PlinkoProbabilityIntroModel', PlinkoProbabilityIntroModel );

  return inherit( PlinkoProbabilityCommonModel, PlinkoProbabilityIntroModel, {

    /**
     * Time step function that is responsible for updating the position and status of the balls.
     * @public
     * @param {number} dt - a small time interval
     */
    step: function( dt ) {
      this.ballCreationTimeElapsed += dt; // we want to to keep track of the time elapsed since the last ball was created
      // we only want to create a ball if:
      // there are balls waiting in line &&
      // the minimum time interval has passed 150 milliseconds &&
      // the number of launched balls is less than the maximum number of balls
      if ( this.ballsToCreateNumber > 0 && this.ballCreationTimeElapsed > 0.150 && this.launchedBallsNumber < MAX_BALL_NUMBER ) {
        this.addNewBall(); // add a new ball
      }

      this.balls.forEach( function( ball ) {
        // we want to cap the dt so that the balls don't make a big jump
        ball.step( Math.min( 0.1, dt * 5 ) );
      } );
    },

    /**
     * Resets timer for each ball
     * @public
     */
    reset: function() {
      PlinkoProbabilityCommonModel.prototype.reset.call( this );
      this.ballsToCreateNumber = 0; // @private remove the queue of balls waiting to be created
      this.launchedBallsNumber = 0; // reset the number of launched balls to zero
    },

    /**
     * This function updates the number of balls to be launched which depends on the status of ballMode
     * The cap of of the maximum number of balls to be launches is enforced by the step() function.
     * @private
     */
    updateBallsToCreateNumber: function() {
      switch ( this.ballMode ) {
        // add one ball to the queue
        case 'oneBall':
          this.ballsToCreateNumber++;
          break;

          // add ten ball to the queue
        case 'tenBalls':
          this.ballsToCreateNumber += 10;
          break;

          // add max number of balls to the queue
        case 'allBalls':
          this.ballsToCreateNumber += MAX_BALL_NUMBER;
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
      // create a new ball
      var addedBall = new IntroBall( this.probability, this.numberOfRows, this.histogram.bins, this.cylinderInfo );

      this.launchedBallsNumber++; // increment the number of launched balls
      this.ballsToCreateNumber--; // decrease the number of balls in the queue

      this.ballCreationTimeElapsed = 0; //reset the time elapsed since the launched of the last ball

      // we want to disable the playButton when all the balls have been queued
      if ( this.launchedBallsNumber + this.ballsToCreateNumber >= MAX_BALL_NUMBER ) {
        this.isBallCapReachedProperty.set( true );
      }

      this.histogram.updateBinCountAndOrientation( addedBall );
      this.balls.push( addedBall );

      // ballOutOfPegsEmitter is emitted when the addedBall leaves the last peg on the Galton board.
      addedBall.ballOutOfPegsEmitter.addListener( function ballOutOfPegsListener() {
        thisModel.histogram.addBallToHistogram( addedBall );
        addedBall.ballOutOfPegsEmitter.removeListener( ballOutOfPegsListener );
      } );
    }
  } );
} );

