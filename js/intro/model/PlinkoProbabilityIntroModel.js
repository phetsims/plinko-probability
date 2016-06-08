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


      var bounds = PlinkoConstants.HISTOGRAM_BOUNDS;
      var binWidth = bounds.width / (this.numberOfRows + 1); // the width of one bin is the total width divided by the number of rows
      var cylinderWidth = 0.95 * binWidth;
      var ellipseHeight = cylinderWidth * Math.sin( PERSPECTIVE_TILT ); // the height is the width times some perspective tilt

      this.cylinderInfo = {           // @public {read-only}
        height: bounds.height * 0.87, // we want the cylinders to be shorter than the histogram
        cylinderWidth: cylinderWidth, // there is a small gap between each cylinder
        ellipseHeight: ellipseHeight, // the height of the ellipse
        verticalOffset: 0.035, // gap between pegboard and cylinders
        top: bounds.maxY // the top of the cylinders
      };
      this.ballsToCreateNumber = 0; // an integer number representing the number of balls in the creation queue
    }


    plinkoProbability.register( 'PlinkoProbabilityIntroModel', PlinkoProbabilityIntroModel );

    return inherit( PlinkoProbabilityCommonModel, PlinkoProbabilityIntroModel, {

      /**
       * time step function that is responsible for updating the position and status of the balls.
       * @public
       * @param {number} dt - a small time interval
       */
      step: function( dt ) {
        PlinkoProbabilityCommonModel.prototype.step.call( this, dt );

        this.ballCreationTimeElapsed += dt; // we want to to keep track of the time elapsed since the last ball was created
        // we only want to create a ball if:
        // there are balls waiting in line &&
        // the minimum time interval has passed 300 milliseconds &&
        // the number of launched balls is less than the maximum number of balls
        if ( this.ballsToCreateNumber > 0 && this.ballCreationTimeElapsed > 0.3 && this.launchedBallsNumber < MAX_BALL_NUMBER ) {
          this.addNewBall(); // add a new ball
          this.ballCreationTimeElapsed = 0; //reset the time elapsed
          this.ballsToCreateNumber--; //remove the ball for the queue
        }

        this.balls.forEach( function( ball ) {
          // we want to cap the dt so that the balls don't make a big jump

          ball.step( Math.min( 0.1, dt * 5 ) );
        } );
      },

      /**
       * resets timer for each ball
       * @public
       */
      reset: function() {
        PlinkoProbabilityCommonModel.prototype.reset.call( this );
        this.ballsToCreateNumber = 0; // remove the queue of balls waiting to be created
      },

      /**
       * This function updates the number of balls to be launched which depends on the status of ballMode
       * The cap of of the maximum number of balls to be launches is enforced by the step() function.
       * @private
       */
      updateBallsToCreateNumber: function() {
        switch( this.ballMode ) {
          case 'oneBall':
            this.ballsToCreateNumber++; // add a ball to the queue
            break;

          case 'tenBalls':
            this.ballsToCreateNumber += 10;
            break;

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
        // update number of balls in the bin and the last position of the addedBall
        this.launchedBallsNumber++; // update the number of launched balls
        this.histogram.updateBinCountAndOrientation( addedBall );
        this.balls.push( addedBall );
        //'exited' is triggered when the addedBall leaves the last peg on the Galton board.
        addedBall.on( 'exited', function() {
          thisModel.histogram.addBallToHistogram( addedBall );
        } );
        // triggers sound to play when ball hits a peg
        addedBall.on( 'playSound', function() {
          thisModel.playBallHittingPegSound( addedBall.direction );
        } );
      }
    } );
  }
)
;



