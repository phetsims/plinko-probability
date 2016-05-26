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
    var GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
    var Histogram = require( 'PLINKO_PROBABILITY/common/model/Histogram' );
    var inherit = require( 'PHET_CORE/inherit' );
    //var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
    var PropertySet = require( 'AXON/PropertySet' );
    var ObservableArray = require( 'AXON/ObservableArray' );
    var Sound = require( 'VIBE/Sound' );
    var Timer = require( 'PHET_CORE/Timer' );

    // audio
    var ballHittingFloorAudio = require( 'audio!PLINKO_PROBABILITY/ballHittingFloor' );


    // constants
    var MAX_NUMBER_BALLS = 9500;

    /**
     * Main model of the second tab (lab tab) of the plinko probability simulation
     * @constructor
     */
    function PlinkoProbabilityLabModel() {

      var thisModel = this;

      PropertySet.call( this, {
        probability: 0.5,
        histogramMode: 'count', // acceptable values are 'count' and 'fraction'
        ballMode: 'oneBall', // acceptable values are 'oneBall' and 'continuous'
        histogramVisible: false,
        isBallCapReached: false, // is the maximum of balls reached?
        numberOfRows: 12,
        galtonBoardRadioButton: 'ball', // Valid values are 'ball', 'path', and 'none'.
        isSoundEnabled: false,
        isPlaying: false  // false if no balls are being dropped true if they are
      } );


      this.ballHittingFloorSound = new Sound( ballHittingFloorAudio );

      this.launchedBallsNumber = 0; // number of current trial (current ball drop)

      this.galtonBoard = new GaltonBoard( this.numberOfRowsProperty );
      this.balls = new ObservableArray();
      this.histogram = new Histogram( this.numberOfRowsProperty );
      this.landedBallsNumber = this.histogram.landedBallsNumber; //number of balls in the histogram


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

    return inherit( PropertySet, PlinkoProbabilityLabModel, {
      step: function( dt ) {
        var thisModel = this;
        var PHASE_INITIAL = 0;
        var PHASE_FALLING = 1;
        var PHASE_EXIT = 2;
        var PHASE_COLLECTED = 3;
        switch( this.galtonBoardRadioButton ) {
          case 'ball':
            this.balls.forEach( function( ball ) {
              var df = dt * 5;
              if ( ball.phase === PHASE_INITIAL ) {
                if ( df + ball.fallenRatio < 1 ) {
                  ball.fallenRatio += df;
                  ball.initialPegPositionInformation();
                }
                else {
                  ball.phase = PHASE_FALLING;
                  ball.fallenRatio = 0;
                  ball.updatePegPositionInformation();
                  if ( thisModel.isSoundEnabled ) {
                    thisModel.ballHittingFloorSound.play();
                  }

                }
              }
              if ( ball.phase === PHASE_FALLING ) {
                if ( df + ball.fallenRatio < 1 ) {
                  ball.fallenRatio += df;
                }
                else {
                  ball.fallenRatio = 0;

                  if ( ball.pegHistory.length > 1 ) {
                    ball.updatePegPositionInformation();
                    if ( thisModel.isSoundEnabled ) {

                      thisModel.ballHittingFloorSound.play();
                    }

                  }
                  else {
                    ball.phase = PHASE_EXIT;
                    ball.updatePegPositionInformation();
                    if ( thisModel.isSoundEnabled ) {
                      thisModel.ballHittingFloorSound.play();
                    }
                    ball.trigger( 'updateStatisticsSignal' );
                  }
                }
              }
              if ( ball.phase === PHASE_EXIT ) {
                if ( df + ball.fallenRatio < 1 ) {
                  ball.fallenRatio += df;
                }
                else {
                  ball.phase = PHASE_COLLECTED;
                  //this.binIndex = this.column;
                  ball.trigger( 'landed' );
                }
              }
              ball.step( 5 * dt );
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

      reset: function() {
        PropertySet.prototype.reset.call( this );
        this.balls.clear();
        this.histogram.reset();
      },

      play: function() {
        var thisModel = this;
        switch( this.ballMode ) {
          case 'oneBall':
            this.launchedBallsNumber++;
            this.addNewBall();
            break;

          case 'continuous':
            var timeInterval;

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
        var addedBall = new Ball( this.probability, this.numberOfRows, this.histogram.cylinderBallNumberAndLastPosition );
        this.balls.push( addedBall );
        addedBall.on( 'updateStatisticsSignal', function() {
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



