// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for Plinko Probability
 */

define( function( require ) {
  'use strict';

  var Ball = require( 'PLINKO/plinko-probability/model/Ball' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ObservableArray = require( 'AXON/ObservableArray' );


  function PlinkoProbabilityModel() {

    PropertySet.call( this, {
      numberOfRows: 23,
      probability: 0.5,
      fraction: false,
      number: false,
      autoScale: false,
      ball: false,
      path: false,
      none: false,
      pegHorizontalDistance: 1,
      pegDiagonalDistance: 1 / Math.sqrt( 2 ),
      pegInterval: 0.05,
      histogramVisible: false,
      isPlaying: false
    } );

    this.balls = new ObservableArray();

    this.trialNumber = 0; //number of current trial (current ball drop)
    this.mean = 0;  ///mean of the sample (near zero for p = 0.5)
    this.sumOfSquares = 0; //sum of squares of trials, used to compute the variance
    this.variance = 0; // (unbiased) sample variance
    this.standardDeviation = 0; //standard deviation (a.k.a. sigma) the square root of the variance
    this.standardDeviationOfMean = 0; ////standard deviation of the mean

    //Minimum Number of Rows
    this.minNumberOfRows = 1;
    //Maximum Number of Rows
    this.maxNumberOfRows = 40;

    this.addNewBall();
  }

  return inherit( PropertySet, PlinkoProbabilityModel, {
    step: function( dt ) {
      if ( dt > 1000 ) {
        dt = 1000;
      }
      for ( var i = 0; i < this.balls.length; i++ ) {
        this.balls.get( i ).step( dt, this.probability, this.numberOfRows );
      }
    },

    reset: function() {
      PropertySet.prototype.reset.call( this );
    },


    addNewBall: function() {
      this.balls.push( new Ball() );
    },

    //choose a random step direction: +1 with prob p or -1 with prob q = 1-p
    nextStep: function() {
      var step;
      var randNbr = Math.random();
      if ( randNbr < this.probability ) {
        step = 1;
      }
      else {
        step = -1;
      }
      //var step = 2*(Math.floor(2*Math.random()) - 1/2);  //step is +1 or -1 with equal probability
      return step;
    },


    getTheoreticalAverage: function() {
      return this.numberOfRows * this.probability;
    },

    getTheoreticalStandardDeviation: function() {
      return Math.sqrt( this.numberOfRows * this.probability * (1 - this.probability) );
    },

    /**
     * http://en.wikipedia.org/wiki/Binomial_coefficient
     *
     * @param {number} n, the number of rows of pegs
     * @param {number} k, the bin number
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
     *http://en.wikipedia.org/wiki/Binomial_distribution
     *
     * @param {number} n , the number of rows of pegs
     * @param {number} k , the bin number
     * @param {number} p, probability of getting k
     * @returns {number} P(n,k,p)= ("n choose k") * p^k * p^(n-k)
     */
    getBinomialProbability: function( n, k, p ) {
      var binomialCoefficient = this.getBinomialCoefficient( n, k );
      var statisticalWeight = Math.pow( p, k ) * Math.pow( 1 - p, n - k );
      return binomialCoefficient * statisticalWeight;
    },

    /**
     * http://en.wikipedia.org/wiki/Binomial_distribution
     *
     * @returns {number}
     */
    getBinomialDistribution: function() {
      var binomialCoefficientsArray = [];
      var k;
      // let's not try to be clever and let's go forward with the brute force approach
      for ( k = 0; k < this.numberOfRows; k++ ) {
        binomialCoefficientsArray.push( this.getBinomialProbability( this.numberOfRows, k, this.probability ) );
      }
      return binomialCoefficientsArray;
    },

    getUpdateStatistics: function( binIndex ) {
      var N = this.trialNumber;
      this.average = ((N - 1) * this.average + binIndex) / N;
      this.sumOfSquares += binIndex * binIndex;
      this.variance = (this.sumOfSquares - N * this.average * this.average) / (N - 1);
      this.standardDeviation = Math.sqrt( this.variance );
      this.standardDeviationOfMean = this.standardDeviation / Math.sqrt( N );
    },

    resetStatistics: function() {
      this.trialNumber = 0;
      this.average = 0;
      this.sumOfSquares = 0;
      this.variance = 0;
      this.standardDeviation = 0;
      this.standardDeviationOfMean = 0;
    }

  } );

} );

