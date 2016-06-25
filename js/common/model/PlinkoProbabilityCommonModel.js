// Copyright 2014-2016, University of Colorado Boulder

/**
 * Common Model for Plinko Probability
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
    'use strict';

    // modules
    var GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
    var Histogram = require( 'PLINKO_PROBABILITY/common/model/Histogram' );
    var inherit = require( 'PHET_CORE/inherit' );
    var ObservableArray = require( 'AXON/ObservableArray' );
    var PropertySet = require( 'AXON/PropertySet' );
    var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
    var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );

    /**
     * Creates common model for Plinko Probability
     * @constructor
     */
    function PlinkoProbabilityCommonModel() {

      // @public
      PropertySet.call( this, {
        probability: PlinkoConstants.BINARY_PROBABILITY_RANGE.defaultValue, // {number} this can be a number between 0 and 1
        histogramMode: 'count', // {string} acceptable values are 'count' and 'fraction'
        ballMode: 'oneBall', // {string} acceptable values are 'oneBall', 'tenBalls', 'allBalls' and 'continuous'
        histogramVisible: false, // {boolean} is the histogram visible?
        isBallCapReached: false, // {boolean} is the maximum of balls reached?
        numberOfRows: PlinkoConstants.ROWS_RANGE.defaultValue, /// {number} must be an integer
        galtonBoardRadioButton: 'ball', // { string} Valid values are 'ball', 'path', and 'none'.
        isPlaying: false  // {boolean} false if no balls are being dropped true if they are
      } );

      this.launchedBallsNumber = 0; // @public {number} - number of current trial (current ball drop)
      this.ballCreationTimeElapsed = 0; // @public {number} - time elapsed since last ball creation;

      // create an observable array of the model balls
      this.balls = new ObservableArray(); // @public

      // create the model for the Galton Board which describes the position of the pegs and their visibility
      this.galtonBoard = new GaltonBoard( this.numberOfRowsProperty ); // @public

      // create the model for the histogram
      this.histogram = new Histogram( this.numberOfRowsProperty ); // @public
    }

    plinkoProbability.register( 'PlinkoProbabilityCommonModel', PlinkoProbabilityCommonModel );

    return inherit( PropertySet, PlinkoProbabilityCommonModel, {
      /**
       * time step function that is responsible for updating the position and status of the balls.
       * @public
       * @param {number} dt - a small time interval
       */
      step: function( dt ) {
      },

      /**
       * Reset of the model attributes.
       * @public
       */
      reset: function() {
        PropertySet.prototype.reset.call( this );
        this.balls.clear(); // clear all the model balls
        this.histogram.reset(); // empty out all the model bins
        this.launchedBallsNumber = 0; // reset the number of launched balls to zero
        this.ballCreationTimeElapsed = 0;
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



