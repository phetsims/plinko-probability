// Copyright 2014-2016, University of Colorado Boulder

/**
 * Model for Plinko Probability Intro
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
    'use strict';

    // modules
    var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
    var GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
    var Histogram = require( 'PLINKO_PROBABILITY/common/model/Histogram' );
    var inherit = require( 'PHET_CORE/inherit' );
    var ObservableArray = require( 'AXON/ObservableArray' );
    var PropertySet = require( 'AXON/PropertySet' );
    var Sound = require( 'VIBE/Sound' );

    // audio
    var bonk1Audio = require( 'audio!PLINKO_PROBABILITY/bonk-1-for-plinko' );
    var bonk2Audio = require( 'audio!PLINKO_PROBABILITY/bonk-2-for-plinko' );

    // constants
    var SOUND_TIME_INTERVAL = .1;   // in millisecond, minimum sound time interval between two sounds

    function PlinkoProbabilityCommonModel() {


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

      // Audio for ball hitting pegs
      this.bonk1Sound = new Sound( bonk1Audio );  // @private
      this.bonk2Sound = new Sound( bonk2Audio );  // @private

      this.launchedBallsNumber = 0; // @public - number of current trial (current ball drop)

      this.soundTimeElapse = 0;  //@private - number used to keep track of the last sound playing

      this.galtonBoard = new GaltonBoard( this.numberOfRowsProperty ); // @public (read-only) - create the galton board
      this.balls = new ObservableArray(); // the balls that are currently on the screen
      this.histogram = new Histogram( this.numberOfRowsProperty );
      this.landedBallsNumber = this.histogram.landedBallsNumber; //number of balls in the histogram
      this.ballCreationTimeElapsed = 0; // time elapsed since last ball creation;

      //TODO, can the play hitting ball peg sound use the time from the stepper instead?
      // keep track of time, for playing sound purposes
      this.oldTime = new Date().getTime();

    }


    plinkoProbability.register( 'PlinkoProbabilityCommonModel', PlinkoProbabilityCommonModel );

    return inherit( PropertySet, PlinkoProbabilityCommonModel, {

      /**
       * Play sound that depends on the direction of the ball
       * @param {string} direction - acceptable values are 'left' and 'right'
       */
      playBallHittingPegSound: function( direction ) {
        var thisModel = this;

        assert && assert( direction === 'left' || direction === 'right', 'direction should be left or right' );
        if ( thisModel.isSoundEnabled ) {
          //play sound if the previous sound was played more than some elapsed time
          if ( this.soundTimeElapse > SOUND_TIME_INTERVAL ) {
            //Will play sound based on ball's motion, left or right
            ( direction === 'left') ? thisModel.bonk1Sound.play() : thisModel.bonk2Sound.play();
            this.soundTimeElapse = 0;
          }
        }
      },

      /**
       * time step function that is responsible for updating the position and status of the balls.
       * @public
       * @param {number} dt - a small time interval
       */
      step: function( dt ) {
        this.soundTimeElapse += dt;
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
      },

      /**
       * Function that returns the theoretical average of the binomial distribution
       * @param {number} numberOfRows - an integer
       * @param {number} probability - ranges from 0 to 1
       * @returns {number}
       * @public read-only
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
       * @public read-only
       */
      getTheoreticalStandardDeviation: function( numberOfRows, probability ) {
        assert && assert( numberOfRows % 1 === 0, 'number of rows should be an integer' );
        return Math.sqrt( numberOfRows * probability * (1 - probability) );
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
       * @private
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
       * @private
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
       * @private
       */
      getBinomialDistribution: function() {
        var binomialCoefficientsArray = [];
        var k;
        // let's not try to be clever and let's go forward with the brute force approach
        for ( k = 0; k < this.numberOfRows + 1; k++ ) {
          binomialCoefficientsArray.push( this.getBinomialProbability( this.numberOfRows, k, this.probability ) );
        }
        return binomialCoefficientsArray;
      },

      /**
       *  Function that returns the theoretical probabilities of the binomial distribution
       *  i.e. P(n,k,p) of a binomial distribution in array form
       *  The binomial distribution is normalized in the sense that the largest coefficient of the array will be one.
       *
       * @returns {Array.<number>}
       * @public read-only
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



