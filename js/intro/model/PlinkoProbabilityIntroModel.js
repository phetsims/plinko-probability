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
    var GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
    var Histogram = require( 'PLINKO_PROBABILITY/common/model/Histogram' );
    var inherit = require( 'PHET_CORE/inherit' );
    var ObservableArray = require( 'AXON/ObservableArray' );
    //var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
    var PropertySet = require( 'AXON/PropertySet' );
    var Sound = require( 'VIBE/Sound' );
    var Timer = require( 'PHET_CORE/Timer' );


    // audio
    var bonk1Audio = require( 'audio!PLINKO_PROBABILITY/bonk-1-for-plinko' );
    var bonk2Audio = require( 'audio!PLINKO_PROBABILITY/bonk-2-for-plinko' );

    // constants
    var MAX_BALL_NUMBER = 100;

    function PlinkoProbabilityIntroModel() {

      var thisModel = this;

      PropertySet.call( this, {
        probability: 0.5,  // probability will be 50%
        histogramMode: 'count', // acceptable values are 'count' and 'fraction'
        ballMode: 'oneBall', // acceptable values are 'oneBall', 'tenBalls', 'allRemainingBalls' and 'continuous'
        histogramVisible: false, // start with the bin view
        isBallCapReached: false, // is the maximum of balls reached?
        numberOfRows: 12,
        isSoundEnabled: false
      } );

      //Audio for ball hitting pegs
      this.bonk1Audio = new Sound( bonk1Audio );
      this.bonk2Audio = new Sound( bonk2Audio );

      this.timerID = [];

      this.launchedBallsNumber = 0; // number of current trial (current ball drop)

      this.galtonBoard = new GaltonBoard( this.numberOfRowsProperty ); // create the galton board
      this.balls = new ObservableArray(); // the balls that are currently on the screen
      this.histogram = new Histogram( this.numberOfRowsProperty );
      this.landedBallsNumber = this.histogram.landedBallsNumber; //number of balls in the histogram

      this.on( 'PressPlayButton', function() {
        thisModel.play();
      } );
    }


    plinkoProbability.register( 'PlinkoProbabilityIntroModel', PlinkoProbabilityIntroModel );

    return inherit( PropertySet, PlinkoProbabilityIntroModel, {
      /**
       * Plays "ball hitting peg" sound during ball path through the Galton board.
       * @param {number} ballDirection
       * @param {boolean} isBallSoundActive
       */
      playBallHittingPegSound: function( ballDirection, isBallSoundActive ) {
        var thisModel = this;

        //Various sound options: click1Audio , click2Audio , bonk1Audio , bonk2Audio , ballHittingFloor ;
        //Will play sound based on ball's motion, left or right
        if ( thisModel.isSoundEnabled && isBallSoundActive ) {

          if ( ballDirection === -0.5 ) {
            thisModel.bonk1Audio.play();
          }
          else {
            thisModel.bonk2Audio.play();
          }
        }
      },
      /**
       * time step function that is responsible for updating the position and status of tehe balls.
       * @public
       * @param {number} dt - a small time interval
       */
      step: function( dt ) {
        var thisModel = this;
        var PHASE_INITIAL = 0;
        var PHASE_FALLING = 1;
        var PHASE_EXIT = 2;
        var PHASE_COLLECTED = 3;
        var df = dt * 5;
        this.balls.forEach( function( ball ) {
          if ( ball.phase === PHASE_INITIAL ) { // balls is leaving the hopper
            if ( df + ball.fallenRatio < 1 ) { // if the ball has not gotten to the first peg
              ball.fallenRatio += df; // fall some more
              ball.initialPegPositionInformation(); // get the initial peg information
            }
            else {
              ball.phase = PHASE_FALLING; // switch the phase
              ball.fallenRatio = 0; // reset the raio
              ball.updatePegPositionInformation(); // update the peg position information
              thisModel.playBallHittingPegSound( ball.direction, ball.isSoundActive ); // if sound is active play
            }
          }
          if ( ball.phase === PHASE_FALLING ) { //ball is falling between pegs
            if ( df + ball.fallenRatio < 1 ) { // if ball has not reached the next peg
              ball.fallenRatio += df; // fall some more
            }
            else { // the ball has reached the top of the next peg
              ball.fallenRatio = 0; // reset the fallen ratio

              if ( ball.pegHistory.length > 1 ) { // if it is not the last peg
                ball.updatePegPositionInformation(); // update the next to last peg information
                thisModel.playBallHittingPegSound( ball.direction, ball.isSoundActive ); // if sound is active play sound
              }
              else { // ball is at the top of the last peg
                ball.phase = PHASE_EXIT; // switch phases
                ball.updatePegPositionInformation(); // update the last peg information
                ball.trigger( 'exited' );
              }
            }
          }
          if ( ball.phase === PHASE_EXIT ) { // the ball has exited and it is making its way to the bin
            if ( df + ball.fallenRatio < ball.finalBinVerticalPosition ) { // if it has not fallen to its final postition
              ball.fallenRatio += df; //fall some more
            }
            else {
              ball.phase = PHASE_COLLECTED; // switch phases
              ball.trigger( 'landed' ); // mark the ball for removal
            }
          }
          ball.step( df ); // this update the position
        } );
      },
      /**
       * Reset of the model attributes.
       * @public
       */
      reset: function() {
        PropertySet.prototype.reset.call( this );
        this.balls.clear(); // get rid of all the balls on the screen 
        this.histogram.reset();
        this.launchedBallsNumber = 0;
        this.resetTimer();

      },
      /**
       * Reset of the Timer to empty listeners.
       * @public
       */
      resetTimer: function() {
        //TODO: Manage memory leak for timerID array. Values do not delete after function call.
        if ( this.timerID ) {

          this.timerID.forEach( function( timerIdElement ) {
            Timer.clearTimeout( timerIdElement );
          } );
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
        var thisModel = this;
        var timerIDnumber;
        var soundActive;  //{boolean} indicates if a ball will be able to play a sound
        switch( this.ballMode ) {
          case 'oneBall':
            if ( this.launchedBallsNumber < MAX_BALL_NUMBER ) {
              this.launchedBallsNumber++;
              soundActive = true;
              this.addNewBall( soundActive );
            }
            break;

          case 'tenBalls':
            var maxBallNumberTenCase = 10;
            for ( i; (i < maxBallNumberTenCase) && (this.launchedBallsNumber < MAX_BALL_NUMBER); i++ ) {
              this.launchedBallsNumber++;
              soundActive = (i % 2 === 0 || i === (maxBallNumberTenCase - 1)); // sets soundActive on every other ball including the last ball.
              thisModel.soundActive = soundActive;
              //Because setTimeout is a callback function we are passing our addNewBall function with the isSoundActive parameter via IIFE into setTimout().
              var listener = (function( isSoundActive ) {
                return function() {
                  return thisModel.addNewBall( isSoundActive );
                };
              })( soundActive );
              timerIDnumber = Timer.setTimeout( listener, (i * 500) ); /// measure in milliseconds
              this.timerID.push( timerIDnumber );
            }
            break;

          case 'allBalls':
            for ( i; this.launchedBallsNumber < MAX_BALL_NUMBER; i++ ) {
              this.launchedBallsNumber++;
              soundActive = (i % 5 === 0 || i === (MAX_BALL_NUMBER - 1));
              thisModel.soundActive = soundActive;
              var listener2 = (function( isSoundActive ) {
                return function() {
                  return thisModel.addNewBall( isSoundActive );
                };
              })( soundActive );
              timerIDnumber = Timer.setTimeout( listener2, (i * 300) );

              this.timerID.push( timerIDnumber );
            }
            break;

          default:
            throw new Error( 'Unhandled galton Board Radio Button state: ' + thisModel.galtonBoardRadioButton );

        }
      },

      /**
       * Add a new Ball to the model
       * @private
       * @param {boolean} soundActive
       */
      addNewBall: function( soundActive ) {
        var thisModel = this;
        //create new ball
        var addedBall = new Ball( this.probability, this.numberOfRows, thisModel.histogram.binCountAndPreviousPosition );
        addedBall.isSoundActive = soundActive;// indicates whether a ball will play a sound while it's passing through the board.
        // update number of balls in the bin and the last position of the addedBall
        this.histogram.updateBinCountAndPreviousPosition( addedBall );
        this.balls.push( addedBall );
        //'exited' is triggered when the addedBall leaves the last peg on the Galton board.
        addedBall.on( 'exited', function() {
          thisModel.histogram.addBallToHistogram( addedBall );
        } );

      },


      /**
       * Function that returns the theoretical average of the binomial distribution
       * @param {number} numberOfRows - an integer
       * @param {number} probability - ranges from 0 to 1
       * @returns {number}
       */
      getTheoreticalAverage: function( numberOfRows, probability ) {
        assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );
        return numberOfRows * probability;
      },

      /**
       * Function that calculates the theoretical standard deviation of the binomial distribution
       * @param {number} numberOfRows - an integer
       * @param {number} probability - ranges from 0 to 1
       * @returns {number}
       */
      getTheoreticalStandardDeviation: function( numberOfRows, probability ) {
        assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );
        return Math.sqrt( numberOfRows * probability * (1 - probability) );
      },

      /**
       * Function that calculates the theoretical standard deviation of the mean for the current value of number of balls
       * It returns a string if there is not a single particle on the board
       * @param {number} numberOfRows - an integer
       * @param {number} probability - ranges from 0 to 1
       * @returns {number||string}
       */
      getTheoreticalStandardDeviationOfMean: function( numberOfRows, probability ) {
        assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );

        if ( this.landedBallsNumber > 0 ) {
          return Math.sqrt( numberOfRows * probability * (1 - probability ) / this.landedBallsNumber );
        }
        else {
          return 'Not A Number';
        }
      },

      /**
       * Function that returns the binomial coefficient, equivalent to (in Latex) ${n\choose k}$
       * usually expressed as "n choose k". It is the coefficient of the x^k term in the polynomial
       * expansion of the binomial power (1 + x)^n. It is related to the Pascal triangle.
       *
       * see http://en.wikipedia.org/wiki/Binomial_coefficient
       *
       * @param {number} n - the number of rows
       * @param {number} k - the bin number
       * @returns {number}  "n choose k"= n!/( k! (n-k)!)
       */
      getBinomialCoefficient: function( n, k ) {
        // we want (n)*(n-1)*(n-2)..(n-k+1) divided by (k)*(k-1)*(k-2)...*2*1
        var coefficient = 1;
        var i;
        for ( i = n - k + 1; i <= n; i++ ) {
          coefficient *= i;
        }
        for ( i = 1; i <= k; i++ ) {
          coefficient /= i;
        }
        return coefficient;
      },

      /**
       * Function that returns the theoretical probability that a ball in in a galton box with 'n' rows (or layers)
       * ends up in the bin number 'k' given the success  probability of every event is 'p'.
       *
       * see http://en.wikipedia.org/wiki/Binomial_distribution
       *
       * @param {number} n - the number of rows, must be an integer > 0
       * @param {number} k - the bin number - an integer between 0 and n
       * @param {number} p - the success (a.k.a binary) probability, a number between 0 and 1
       * @returns {number} P(n,k,p)= ("n choose k") * p^k * p^(n-k)
       */
      getBinomialProbability: function( n, k, p ) {
        assert && assert( k <= n, 'the bin number, k, ranges from 0 to n' );
        var binomialCoefficient = this.getBinomialCoefficient( n, k );
        var statisticalWeight = Math.pow( p, k ) * Math.pow( 1 - p, n - k );
        return binomialCoefficient * statisticalWeight;
      },

      /**
       *  Function that returns the theoretical probabilities of the binomial distribution
       *  i.e. P(n,k,p) of a binomial distribution in array form
       *
       *  see http://en.wikipedia.org/wiki/Binomial_distribution
       *
       * @returns {Array.<number>}
       */
      getBinomialDistribution: function() {
        var binomialCoefficientsArray = [];
        var k;
        // let's not try to be clever and let's go forward with the brute force approach
        for ( k = 0; k < this.numberOfRowsProperty.value + 1; k++ ) {
          binomialCoefficientsArray.push( this.getBinomialProbability( this.numberOfRowsProperty.value, k, this.probability ) );
        }
        return binomialCoefficientsArray;
      },

      /**
       *  Function that returns the theoretical probabilities of the binomial distribution
       *  i.e. P(n,k,p) of a binomial distribution in array form
       *  The binomial distribution is normalized in the sense that the largest coefficient of the array will be one.
       *
       * @returns {Array.<number>}
       */
      getNormalizedBinomialDistribution: function() {
        var binomialCoefficientsArray = this.getBinomialDistribution();
        var maxCoefficient = _.max( binomialCoefficientsArray );
        var normalizedArray = binomialCoefficientsArray.map( function( num ) {
          return num / maxCoefficient;
        } ); // fraction is smaller than one
        return normalizedArray;
      }

    } );
  }
)
;



