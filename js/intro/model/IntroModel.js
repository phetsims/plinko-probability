// Copyright 2014-2016, University of Colorado Boulder

/**
 * Model for the 'Intro' screen
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroBall = require( 'PLINKO_PROBABILITY/intro/model/IntroBall' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityCommonModel = require( 'PLINKO_PROBABILITY/common/model/PlinkoProbabilityCommonModel' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var PlinkoProbabilityQueryParameters = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityQueryParameters' );

  // constants
  var MAX_BALLS = PlinkoProbabilityQueryParameters.MAX_BALLS_INTRO || 100;
  var PERSPECTIVE_TILT = Math.PI / 1.4; // in radians

  /**
   * @constructor
   */
  function IntroModel() {

    PlinkoProbabilityCommonModel.call( this );

    var bounds = PlinkoProbabilityConstants.HISTOGRAM_BOUNDS;
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

    // @private
    this.launchedBallsNumber = 0; // number of balls created
    this.ballsToCreateNumber = 0; // number of balls in the creation queue
  }

  plinkoProbability.register( 'IntroModel', IntroModel );

  return inherit( PlinkoProbabilityCommonModel, IntroModel, {

    /**
     * Time step function that is responsible for updating the position and status of the balls.
     *
     * @param {number} dt - time interval
     * @public
     */
    step: function( dt ) {

      // Keep track of the time elapsed since the last ball was created
      this.ballCreationTimeElapsed += dt;

      // we only want to create a ball if:
      // there are balls waiting in line &&
      // the minimum time interval has passed 150 milliseconds &&
      // the number of launched balls is less than the maximum number of balls
      if ( this.ballsToCreateNumber > 0 && this.ballCreationTimeElapsed > 0.150 && this.launchedBallsNumber < MAX_BALLS ) {
        this.addNewBall(); // add a new ball
      }

      // Move balls
      var ballsMoved = false;
      var dtCapped = Math.min( 0.1, dt * 5 ); // Cap the dt so that the balls don't make a big jump
      this.balls.forEach( function( ball ) {
        var ballMoved = ball.step( dtCapped );
        ballsMoved = ( ballMoved || ballsMoved );
      } );

      // Notify if balls moved
      if ( ballsMoved ) {
        this.ballsMovedEmitter.emit();
      }
    },

    /**
     * @override
     * @public
     */
    erase: function() {
      PlinkoProbabilityCommonModel.prototype.erase.call( this );
      this.ballsToCreateNumber = 0;
      this.launchedBallsNumber = 0;
    },

    /**
     * This function updates the number of balls to be launched which depends on the status of ballMode.
     * The cap of of the maximum number of balls to be launches is enforced by the step() function.
     *
     * @private
     */
    updateBallsToCreateNumber: function() {
      switch( this.ballMode ) {

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
          this.ballsToCreateNumber += MAX_BALLS;
          break;

        default:
          throw new Error( 'invalid ballMode: ' + this.ballMode );
      }
    },

    /**
     * Add a new Ball to the model
     *
     * @private
     */
    addNewBall: function() {

      // create a new ball
      var addedBall = new IntroBall( this.probability, this.numberOfRows, this.histogram.bins, this.cylinderInfo );

      this.launchedBallsNumber++; // increment the number of launched balls
      this.ballsToCreateNumber--; // decrease the number of balls in the queue

      this.ballCreationTimeElapsed = 0; //reset the time elapsed since the launched of the last ball

      // Disable the playButton when all the balls have been queued
      if ( this.launchedBallsNumber + this.ballsToCreateNumber >= MAX_BALLS ) {
        this.isBallCapReachedProperty.set( true );
      }

      this.histogram.updateBinCountAndOrientation( addedBall );
      this.balls.push( addedBall );

      // ballOutOfPegsEmitter is emitted when the addedBall leaves the last peg on the Galton board.
      var self = this;
      addedBall.ballOutOfPegsEmitter.addListener( function ballOutOfPegsListener() {
        self.histogram.addBallToHistogram( addedBall );
        addedBall.ballOutOfPegsEmitter.removeListener( ballOutOfPegsListener );
      } );
    }
  } );
} );

