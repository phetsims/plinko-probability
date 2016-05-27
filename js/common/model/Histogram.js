// Copyright 2015, University of Colorado Boulder

/**
 * Model of a histogram that keeps track of the number of counts in each bin
 * and some associated statistics
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
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

    var thisHistogram = this;
    this.binCountAndPreviousPosition = []; //@public
    // @private
    this.bins = [];
    this.sumOfSquares = 0;
    this.variance = 0;

    // @public
    this.average = 0;
    this.standardDeviation = 0;
    this.standardDeviationOfMean = 0;
    this.landedBallsNumber = 0;

    this.setBinsToZero();

    this.numberOfRowsProperty = numberOfRowsProperty;

    numberOfRowsProperty.link( function() {
      thisHistogram.reset(); // if the number of rows change then reset the histogram
    } );
  }

  plinkoProbability.register( 'Histogram', Histogram );

  return inherit( Events, Histogram, {
    /**
     * @public
     * sets all the binCounts to 0 and resets the statistics
     */
    reset: function() {
      this.setBinsToZero();
      this.resetStatistics();
      this.trigger( 'histogramUpdated' );
      this.trigger( 'statisticsUpdated' );
    },
    /**
     * Sets the value of all bins in the histogram to zero.
     * @private
     */
    setBinsToZero: function() {
      this.bins = []; // reset the viewable bin array to an empty array
      this.binCountAndPreviousPosition = []; // resets the bin count and previous position
      var binInfo; // object with a count and direction
      for ( var i = 0; i < PlinkoConstants.ROWS_RANGE.max + 1; i++ ) {
        this.bins.push( 0 );
        binInfo = {
          binCount: 0,
          direction: 0 // 0 is center, 1 is right, -1 is left
        };
        this.binCountAndPreviousPosition.push( binInfo );
      }
    },

    /**
     * Updates the array elements for the number of balls in a bin and the horizontal final position of the last ball.
     *
     * @param {Ball} ball
     * @public
     */
    updateBinCountAndPreviousPosition: function( ball ) {
      this.binCountAndPreviousPosition[ ball.binIndex ].binCount++;
      this.binCountAndPreviousPosition[ ball.binIndex ].direction = ball.binDirection;
    },

    /**
     * Update the histogram statistic due to adding one ball in bin 'binIndex'
     *
     * @param {number} binIndex - the bin index associated with the landed ball.
     * @private
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
     * Calculate the statistics from the histogram bins (from scratch instead of a delta update)
     * @private
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
     *  @private
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
     * @public
     */
    addBallToHistogram: function( ball ) {
      // @private
      this.bins[ ball.binIndex ]++;
      this.updateStatistics( ball.binIndex );
      this.trigger( 'histogramUpdated' );
      this.trigger( 'statisticsUpdated' );
    },

    /**
     * Function that returns the number of counts in a bin
     * The count is a non-negative integer
     * @param {number} binIndex
     * @returns {number}
     * @public
     */
    getBinCount: function( binIndex ) {
      return this.bins[ binIndex ]; // an integer
    },

    /**
     * Function that returns the fractional occupation of a bin
     * The fraction is smaller than one
     * @param {number} binIndex - an integer
     * @returns {number}
     * @public
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
     * @public
     */
    getFractionalNormalizedBinCount: function( binIndex ) {
      var maxValue = _.max( this.bins );
      if ( this.landedBallsNumber ) {
        return this.bins[ binIndex ] / maxValue; // fraction is smaller than one
      }
      else {
        return 0;
      }
    },

    /**
     * Function that returns the maximum value of the all the bins
     * @returns {number}
     * @public
     */
    getMaximumBinCount: function() {
      return _.max( this.bins );
    }

  } );
} );

