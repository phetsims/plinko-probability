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
    var Ball = require( 'PLINKO_PROBABILITY/common/model/Ball' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Timer = require( 'PHET_CORE/Timer' );
    var PlinkoProbabilityCommonModel = require( 'PLINKO_PROBABILITY/common/model/PlinkoProbabilityCommonModel' );

    // constants
    var MAX_BALL_NUMBER = 100;

    /**
     * Main model of the first tab (intro tab) of the plinko probability simulation
     * @constructor
     */
    function PlinkoProbabilityIntroModel() {

      var thisModel = this;

      PlinkoProbabilityCommonModel.call( this ); // inherits properties from PlinkoProbabilityCommonModel.js

      //trigger that plays when play button is pressed
      this.on( 'PressPlayButton', function() {
        thisModel.play();
      } );
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
       * Play function adds balls to the model, the number of balls added depends on the status of ballMode.
       * The function updates the total number of launched balls
       * @private
       */
      play: function() {
        var i = 0;
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
              Timer.setTimeout( function() { thisModel.addNewBall();}, (i * 500) ); /// measured in milliseconds
            }
            break;

          case 'allBalls':
            for ( i; this.launchedBallsNumber < MAX_BALL_NUMBER; i++ ) {
              this.launchedBallsNumber++;
              Timer.setTimeout( function() { thisModel.addNewBall();}, (i * 300) ); /// measured in milliseconds
            }
            break;

          default:
            throw new Error( 'Unhandled galton Board Radio Button state: ' + thisModel.galtonBoardRadioButton );

        }
      },

      /**
       * Add a new Ball to the model
       * @private
       */
      addNewBall: function() {
        var thisModel = this;
        //create new ball
        var addedBall = new Ball( this.probability, this.numberOfRows, thisModel.histogram.binCountAndPreviousPosition );
        // update number of balls in the bin and the last position of the addedBall
        this.histogram.updateBinCountAndPreviousPosition( addedBall );
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



