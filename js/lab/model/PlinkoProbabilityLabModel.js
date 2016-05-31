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
    var Ball = require( 'PLINKO_PROBABILITY/common/model/Ball' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Timer = require( 'PHET_CORE/Timer' );
    var PlinkoProbabilityCommonModel = require( 'PLINKO_PROBABILITY/common/model/PlinkoProbabilityCommonModel' );

    // constants
    var MAX_NUMBER_BALLS = 9500;


    /**
     * Main model of the second tab (lab tab) of the plinko probability simulation
     * @constructor
     */
    function PlinkoProbabilityLabModel() {

      var thisModel = this;

      PlinkoProbabilityCommonModel.call( this ); // inherits properties from PlinkoProbabilityCommonModel.js

      this.galtonBoardRadioButtonProperty.link( function() {
        thisModel.balls.clear();
        Timer.clearInterval( thisModel.continuousTimer ); // reset the timer

        // if it is playing then call play again to make sure that the timer between dropped balls is the correct one
        if ( thisModel.isPlayingProperty.value === true ) {
          thisModel.play();
        }
      } );

      this.probabilityProperty.link( function() {
        thisModel.balls.clear();
        thisModel.histogram.reset();
      } );

      this.numberOfRowsProperty.link( function() {
        thisModel.balls.clear();
        thisModel.histogram.reset();
      } );
    }

    plinkoProbability.register( 'PlinkoProbabilityLabModel', PlinkoProbabilityLabModel );

    return inherit( PlinkoProbabilityCommonModel, PlinkoProbabilityLabModel, {
      /**
       * time step function that is  responsible for updating the position and status of the balls
       * @public
       * @param dt
       */
      step: function( dt ) {
        switch( this.galtonBoardRadioButton ) {
          case 'ball':
            this.balls.forEach( function( ball ) {
              ball.step( dt * 5 );
            } );
            break;
          case 'path':
            this.balls.forEach( function( ball ) {
              ball.updateStatisticsAndLand();
            } );
            break;
          case 'none':
            this.balls.forEach( function( ball ) {
              ball.updateStatisticsAndLand();
            } );
            break;
          default:
            throw new Error( 'Unhandled galton Board Radio Button state: ' + this.galtonBoardRadioButton );
        }

      },

      /**
       * Play function adds balls to the model, the number of balls depends on the status of ballMode
       */
      play: function() {
        var thisModel = this;
        switch( this.ballMode ) {
          case 'oneBall':
            this.launchedBallsNumber++; // add one to the total
            this.addNewBall();
            break;

          case 'continuous':
            var timeInterval;
            // depending on the galtonBoardRadioButton the ball will show up as either ball, path, or not show up
            switch( thisModel.galtonBoardRadioButton ) {
              case 'ball':
                timeInterval = 50;
                this.continuousTimer = Timer.setInterval( function() {
                  thisModel.addNewBall();
                }, timeInterval );
                break;
              case 'path':
                timeInterval = 20;
                this.continuousTimer = Timer.setInterval( function() {
                  thisModel.addNewBall();
                }, timeInterval );
                break;
              case 'none':
                timeInterval = 10;
                thisModel.balls.clear();
                this.continuousTimer = Timer.setInterval( function() {
                  thisModel.addNewBall();
                }, timeInterval );
                break;
              default:
                throw new Error( 'Unhandled galton Board Radio Button state: ' + thisModel.galtonBoardRadioButton );
            }
            break;
        }
      },

      /**
       * Add a new Ball to the model
       */
      addNewBall: function() {
        var thisModel = this;
        var addedBall = new Ball( this.probability, this.numberOfRows, this.histogram.binCountAndPreviousPosition );
        this.balls.push( addedBall );
        addedBall.on( 'exited', function() {
          thisModel.histogram.addBallToHistogram( addedBall );
          if ( thisModel.histogram.getMaximumBinCount() > MAX_NUMBER_BALLS ) {
            Timer.clearInterval( thisModel.continuousTimer );
            thisModel.isBallCapReached = true;
          }
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



