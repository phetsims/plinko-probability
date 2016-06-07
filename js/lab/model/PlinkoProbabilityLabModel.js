// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for Plinko Probability Lab
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
    'use strict';

    // modules
    var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
    var LabBall = require( 'PLINKO_PROBABILITY/lab/model/LabBall' );
    var inherit = require( 'PHET_CORE/inherit' );
    var PlinkoProbabilityCommonModel = require( 'PLINKO_PROBABILITY/common/model/PlinkoProbabilityCommonModel' );

    // constants
    var MAX_NUMBER_BALLS = 9999;


    /**
     * Main model of the second tab (lab tab) of the plinko probability simulation
     * @constructor
     */
    function PlinkoProbabilityLabModel() {

      var thisModel = this;

      PlinkoProbabilityCommonModel.call( this ); // inherits properties from PlinkoProbabilityCommonModel.js
      // These need to be linked until the end of the simulation
      this.galtonBoardRadioButtonProperty.link( function() {
        thisModel.balls.clear(); // clear the balls
      } );

      this.probabilityProperty.link( function() {
        thisModel.balls.clear(); // clear the balls
        thisModel.histogram.reset(); // reset histogram statistics
        thisModel.isBallCapReached = false;
      } );

      this.numberOfRowsProperty.link( function() {
        thisModel.balls.clear();
        thisModel.histogram.reset();
        thisModel.isBallCapReached = false;
      } );

      this.ballCreationTimeInterval = 0; // time we want to pass before we created a new ball
    }

    plinkoProbability.register( 'PlinkoProbabilityLabModel', PlinkoProbabilityLabModel );

    return inherit( PlinkoProbabilityCommonModel, PlinkoProbabilityLabModel, {
      /**
       * time step function that is  responsible for creating and updating the position and status of the balls
       * @public
       * @param {number} dt
       */
      step: function( dt ) {
        PlinkoProbabilityCommonModel.prototype.step.call( this, dt );
        this.ballCreationTimeElapsed += dt; // we don't want balls to drop too quickly so we keep track of the interval
        if ( this.isPlaying && this.ballCreationTimeElapsed > this.ballCreationTimeInterval ) { // if the play button is pressed and the interval is greater than some interval
          this.addNewBall(); // add a new ball
          this.ballCreationTimeElapsed = 0; // reset the elapsed time
        }

        switch( this.galtonBoardRadioButton ) {
          case 'ball':
            this.balls.forEach( function( ball ) {
              // we want to cap dt fairly low so that the balls don't make a sudden jump
              ball.step( Math.min( 0.090, dt * 5 ) ); // 90 milliseconds is the highest dt will be
            } );
            this.ballCreationTimeInterval = 0.050; // 50 milliseconds if we are seeing balls
            break;
          case 'path':
            this.balls.forEach( function( ball ) {
              ball.updateStatisticsAndLand();
            } );
            this.ballCreationTimeInterval = 0.050; // 50 milliseconds if we are seeing paths
            break;
          case 'none':
            this.balls.forEach( function( ball ) {
              ball.updateStatisticsAndLand();
            } );
            this.ballCreationTimeInterval = 0.020; // 20 milliseconds if nothing is being shown
            break;
          default:
            throw new Error( 'Unhandled galton Board Radio Button state: ' + this.galtonBoardRadioButton );
        }

      },

      /**
       * Add a new Ball to the model
       */
      addNewBall: function() {
        var thisModel = this;
        var addedBall = new LabBall( this.probability, this.numberOfRows, this.histogram.bins );
        this.histogram.bins[ addedBall.binIndex ].binCount++; //update the bin count of the bins
        this.balls.push( addedBall ); // add the ball to the observable array
        if ( thisModel.histogram.getMaximumActualBinCount() >= MAX_NUMBER_BALLS ) {
          thisModel.isBallCapReached = true;
        }
        addedBall.on( 'exited', function() {
          thisModel.histogram.addBallToHistogram( addedBall );
        } );
        // when the ball lands remove the one that came before it
        addedBall.on( 'landed', function() {
          var previousBallIndex = thisModel.balls.indexOf( addedBall ) - 1; //gets the index of the ball before it
          if ( previousBallIndex > -1 ) {
            var previousBall = thisModel.balls.get( previousBallIndex ); // gets the last ball object
            thisModel.balls.remove( previousBall ); //removes the previous ball
          }
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



