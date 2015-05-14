// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model of a histogram that keeps track of the number of counts in each bin
 * and some associated statistics
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  var Events = require( 'AXON/Events' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );

  /**
   *
   * @param {Property.<number>} numberOfRowsProperty
   * @constructor
   */
  function Histogram( numberOfRowsProperty ) {

    Events.call( this );

    this.numberOfRowsProperty = numberOfRowsProperty;
    var thisHistogram = this;

    this.bins = [];

    this.setBinsToZero();

    numberOfRowsProperty.link( function( numberOfRows ) {
      thisHistogram.reset();
    } );
  }

  return inherit( Events, Histogram, {
    reset: function() {
      this.setBinsToZero();
      this.resetStatistics();
      this.trigger( 'histogramUpdated' );
      this.trigger( 'statisticsUpdated' );

    },

    setBinsToZero: function() {
      this.bins = [];
      for ( var i = 0; i < PlinkoConstants.ROWS_RANGE.max + 1; i++ ) {
        this.bins.push( 0 );
      }
    },

    /**
     * Update the histogram statistic due to adding one ball in bin 'binIndex'
     *
     * @param {number} binIndex - the bin index associated with the landed ball.
     */
    updateStatistics: function( binIndex ) {
      this.landedBallsNumber++;

      // convenience variable
      var N = this.landedBallsNumber;

      this.average = ((N - 1) * this.average + binIndex) / N;
      this.sumOfSquares += binIndex * binIndex;
      // the variance and standard deviations exist only when the number of ball is larger than 1
      if ( N > 1 ) {
        this.variance = (this.sumOfSquares - N * this.average * this.average) / (N - 1);
        this.standardDeviation = Math.sqrt( this.variance );
        this.standardDeviationOfMean = this.standardDeviation / Math.sqrt( N );
      }
      else {
        this.variance = 0;
        this.standardDeviation = 0;
        this.standardDeviationOfMean = 0;
      }
    },

    /**
     *
     * Calculate the statistics from the histogram (from scratch)
     *
     */
    calculateStatistics: function() {
      this.resetStatistics();

      var self = this;

      var sum = 0;
      this.bins.forEach( function( bin, index ) {
        self.landedBallsNumber += bin;
        sum += bin * index;
        self.sumOfSquares += bin * index * index;
      } );

      this.average = sum / this.landedBallsNumber;

      var N = this.landedBallsNumber;

      // the variance and standard deviations exist only when the number of ball is larger than 1
      if ( N > 1 ) {
        this.variance = (this.sumOfSquares - N * this.average * this.average) / (N - 1);
        this.standardDeviation = Math.sqrt( this.variance );
        this.standardDeviationOfMean = this.standardDeviation / Math.sqrt( N );
      }
      else {
        this.variance = 0;
        this.standardDeviation = 0;
        this.standardDeviationOfMean = 0;
      }

    },

    /**
     *  Resets all the statistics data to zero
     */
    resetStatistics: function() {
      this.landedBallsNumber = 0;
      this.average = 0;
      this.sumOfSquares = 0;
      this.variance = 0;
      this.standardDeviation = 0;
      this.standardDeviationOfMean = 0;
    },

    /**
     * Add an additional ball to the histogram to the appropriate bin and update all the relevant statistics
     * @param {Ball} ball
     */
    addBallToHistogram: function( ball ) {
      this.bins[ ball.binIndex ]++;
      this.updateStatistics( ball.binIndex );
      this.trigger( 'histogramUpdated' );
      this.trigger( 'statisticsUpdated' );
    },


    /**
     * Add an array to the the histogram and update all the relevant statistics
     * @param {Array.<number>} array
     */
    addToHistogram: function( numberBalls, probability ) {

      var numberOfRows = this.numberOfRowsProperty.value;
      for ( var i = 0; i < numberBalls; i++ ) {
        var columnNumber = 0;
        var rowNumber;
        var direction;
        for ( rowNumber = 0; rowNumber < numberOfRows; rowNumber++ ) {
          direction = (Math.random() < probability) ? 1 : 0;
          columnNumber += direction;
        }
        this.bins[ columnNumber ]++;
      }
      this.calculateStatistics();

      this.trigger( 'histogramUpdated' );
      this.trigger( 'statisticsUpdated' );
    },


    /**
     * Function that returns the number of counts in a bin
     * The count is a non-negative integer
     * @param {number} binIndex
     * @returns {number}
     */
    getBinCount: function( binIndex ) {
      return this.bins[ binIndex ]; // an integer
    },

    /**
     * Function that returns the fractional occupation of a bin
     * The fraction is smaller than one
     * @param {number} binIndex - an integer
     * @returns {number}
     */
    getFractionalBinCount: function( binIndex ) {
      if ( this.landedBallsNumber ) {
        return this.bins[ binIndex ] / this.landedBallsNumber; // fraction is smaller than one
      }
      else {
        return 0;
      }
    },

    /**
     * Function that returns the fractional normalized occupation of a bin, i.e. that
     * at least one bin has value
     * The fraction is smaller than one
     * @param {number} binIndex - an integer
     * @returns {number}
     */
    getFractionalNormalizedBinCount: function( binIndex ) {
      var maxValue = _.max( this.bins );
      if ( this.landedBallsNumber ) {
        return this.bins[ binIndex ] / maxValue; // fraction is smaller than one
      }
      else {
        return 0;
      }
    }


  } );
} );

