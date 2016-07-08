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
  var Emitter = require( 'AXON/Emitter' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Random = require( 'DOT/Random' );

  // constants
  var BOUNDS = PlinkoConstants.HISTOGRAM_BOUNDS;

  // convenience variable
  var random = new Random();

  /**
   *
   * @param {Property.<number>} numberOfRowsProperty
   * @constructor
   */
  function Histogram( numberOfRowsProperty ) {


    var thisHistogram = this;

    this.bins = []; // @public {Object[]}
    this.average = 0; // @public (read-only)
    this.standardDeviation = 0; // @public (read-only)
    this.standardDeviationOfMean = 0; // @public (read-only)
    this.landedBallsNumber = 0; // @public (read-only)

    // convenience variables
    this.sumOfSquares = 0; // @private
    this.variance = 0; // @private
    this.numberOfRowsProperty = numberOfRowsProperty; // @private

    // initialized all the bins to zero.
    this.setBinsToZero();

    // emitters;
    this.histogramUpdatedEmitter = new Emitter(); // @public

    // link is present for the lifetime of the sim
    numberOfRowsProperty.link( function() {
      thisHistogram.reset(); // if the number of rows change then reset the histogram
    } );
  }

  plinkoProbability.register( 'Histogram', Histogram );

  return inherit( Object, Histogram, {
    /**
     * @public
     * sets all the binCounts to 0 and resets the statistics
     */
    reset: function() {
      this.setBinsToZero();
      this.resetStatistics();
      this.histogramUpdatedEmitter.emit();
    },
    /**
     * Used in the "ballsOnScreen" query parameter to set an initial amount of balls within the histogram.
     * @public
     * @param ballsOnScreen {number} - user inputted query parameter for the amount of balls the histogram is initiallized with
     */
    prepopulate: function( ballsOnScreen ) {

      // temporarily stores the binCount for each bin in an empty array.
      var tempBins = [];
      for ( var tempBinIndex = 0; tempBinIndex < (this.numberOfRowsProperty.value + 1); tempBinIndex++ ) {
        tempBins[ tempBinIndex ] = 0;
      }

      // determines probability of balls falling through galton board
      for ( var ballIndex = 0; ballIndex < ballsOnScreen; ballIndex++ ) {
        var columnNumber = 0;
        // the path of the balls through the pegs of the galton board  is determined for the prepopulated balls only
        for ( var rowNumber = 0; rowNumber <= this.numberOfRowsProperty.value; rowNumber++ ) {
          var direction = (random.random() > 0.5) ? 'left' : 'right';

          // increment the column number of the next row, but not for the last row
          if ( rowNumber < this.numberOfRowsProperty.value ) {
            columnNumber += (direction === 'left') ? 0 : 1;
          }
        }
        // updates the binCount of a bin at a specific index
        tempBins[ columnNumber ]++;

      }

      // takes values in temporary bin array and translates them into our bin array
      for ( tempBinIndex = 0; tempBinIndex < (this.numberOfRowsProperty.value + 1); tempBinIndex++ ) {
        this.bins[ tempBinIndex ] = {
          binCount: tempBins[ tempBinIndex ],  // number of balls that will be in the bin (including those currently falling through the galton board)
          visibleBinCount: tempBins[ tempBinIndex ],  // number of balls that are in the bin
          orientation: 0 // 0 is center, 1 is right, -1 is left
        };
      }

      // now we update the view and generate our statistics
      this.initialStatistics();
      this.histogramUpdatedEmitter.emit();

    },

    /**
     * Sets the value of all bins in the histogram to zero.
     * @private
     */
    setBinsToZero: function() {
      this.bins = []; // reset the bin array to an empty array
      var binInfo;
      var maxBins = PlinkoConstants.ROWS_RANGE.max + 1;
      for ( var i = 0; i < maxBins; i++ ) {
        binInfo = {
          binCount: 0,  // number of balls that will be in the bin (including those currently falling through the galton board)
          visibleBinCount: 0,  // number of balls that are in the bin
          orientation: 0 // 0 is center, 1 is right, -1 is left
        };
        this.bins.push( binInfo );
      }
    },

    /**
     * Updates the array elements for the number of balls in a bin and the horizontal final position of the last ball.
     *
     * @param {IntroBall|LabBall} ball
     * @public
     */
    updateBinCountAndOrientation: function( ball ) {
      this.bins[ ball.binIndex ].binCount++;
      this.bins[ ball.binIndex ].orientation = ball.binOrientation;
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

      // the variance and standard deviations exist only when the number of balls is larger than 1
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
     * Determines the histogram's statistics due to adding an initial amount of balls on screen via the "ballOnScreen" query parameter
     * @private
     */
    initialStatistics: function() {
      var totalNumberOfBalls = 0;
      var sum = 0;
      var sumOfSquares = 0;

      this.bins.forEach( function( bin, binIndex ) {
        totalNumberOfBalls += bin.binCount;
        sum += bin.binCount * binIndex;
        sumOfSquares += bin.binCount * binIndex * binIndex;
      } );

      // create readable statistics for the statistics accordion box
      this.sumOfSquares = sumOfSquares;
      this.landedBallsNumber = totalNumberOfBalls;
      this.average = sum / totalNumberOfBalls;
      this.variance = (sumOfSquares - (this.average * this.average * totalNumberOfBalls)) / (totalNumberOfBalls - 1);
      this.standardDeviation = Math.sqrt( this.variance );
      this.standardDeviationOfMean = this.standardDeviation / Math.sqrt( totalNumberOfBalls );
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
     * @param {IntroBall|LabBall} ball
     * @public
     */
    addBallToHistogram: function( ball ) {
      // @private
      this.bins[ ball.binIndex ].visibleBinCount++;
      this.updateStatistics( ball.binIndex );
      this.histogramUpdatedEmitter.emit();
    },

    /**
     * Function that returns the number of counts in a bin
     * The count is a non-negative integer
     * @param {number} binIndex
     * @returns {number}
     * @public
     */
    getBinCount: function( binIndex ) {
      return this.bins[ binIndex ].visibleBinCount; // an integer
    },

    /**
     * Function that returns the fractional occupation of a bin
     * The fraction is smaller than one but the sum of all fractions add up to one
     * @param {number} binIndex - an integer
     * @returns {number}
     * @public (read-only)
     */
    getFractionalBinCount: function( binIndex ) {
      if ( this.landedBallsNumber > 0 ) {
        return this.bins[ binIndex ].visibleBinCount / this.landedBallsNumber; // fraction is smaller than one
      }
      else {
        // no balls are present
        return 0;
      }
    },

    /**
     * Function that returns an array of the fractional 'normalized 'occupation of a bin, i.e.
     * the fractional normalized account is done with respect to the bin with the largest count
     * Hence at least one element of the array will return a value of 1 (unless the array is completely
     * filled with zeros in which case it returns an array of zeros)
     * @returns {Array.<number>}
     * @public (read-only)
     */
    getNormalizedSampleDistribution: function() {
      var maxCount = this.getMaximumBinCount();
      // we don't want to divide by zero; if maxCount is zero, then bin.visibleCount is zero anyway.
      var divisionFactor = Math.max( maxCount, 1 );
      var normalizedArray = this.bins.map( function( bin ) {
        return bin.visibleBinCount / divisionFactor;
      } );
      return normalizedArray;
    },

    /**
     * Function that returns the maximum value of all the balls in the bins
     * This includes the balls that still traveling through the GaltonBoard
     * @returns {number}
     * @public (read-only)
     */
    getMaximumActualBinCount: function() {
      var maxCount = 0;
      this.bins.forEach( function( binElement ) {
        maxCount = Math.max( maxCount, binElement.binCount );
      } );
      return maxCount;
    },

    /**
     * Function that returns the maximum visible value of the balls in the bins
     * This does not include the balls that are still traveling through the GaltonBoard
     * @returns {number}
     * @public (read-only)
     */
    getMaximumBinCount: function() {
      var maxCount = 0;
      this.bins.forEach( function( binElement ) {
        maxCount = Math.max( maxCount, binElement.visibleBinCount );
      } );
      return maxCount;
    },


    /**
     * Function that returns the center x coordinate of a bin with index binIndex
     * @public (read-only)
     * @param {number} binIndex - index associated with the bin, the index may range from 0 to numberOfBins-1
     * @param {number} numberOfBins - the number of bins on the screen
     * @returns {number}
     */
    getBinCenterX: function( binIndex, numberOfBins ) {
      assert && assert( binIndex < numberOfBins, 'The binIndex must be smaller than the total number of bins' );
      return ((binIndex + 1 / 2) / numberOfBins) * BOUNDS.width + BOUNDS.minX;
    },

    /**
     * Function that returns the left position of a bin
     * @public (read-only)
     * @param {number} binIndex
     * @param {number} numberOfBins - the number of bins on the screen
     * @returns {number}
     */
    getBinLeft: function( binIndex, numberOfBins ) {
      assert && assert( binIndex < numberOfBins, 'The binIndex must be smaller than the total number of bins' );
      return (binIndex / numberOfBins) * BOUNDS.width + BOUNDS.minX;
    },

    /**
     * Function that returns the minimum X value, i.e. the leftmost position of all the bins
     * @public (read-only)
     * @returns {number}
     */
    getMinX: function() {
      return BOUNDS.minX;
    },

    /**
     * Function that returns the center X value of the bins, i.e. the center position of all the bins
     * @public (read-only)
     * @returns {number}
     */
    getCenterX: function() {
      return BOUNDS.centerX;
    },

    /**
     * Function that returns the minimum Y value, i.e. the bottom position of all the bins
     * @public (read-only)
     * @returns {number}
     */
    getMinY: function() {
      return BOUNDS.minY;
    },

    /**
     * Function that returns the x position (in model coordinates() associated with
     * the average (mean) value of the histogram.
     * @public (read-only)
     * @param {number} value
     * @param {number} numberOfBins - the number of bins on the screen
     * @returns {number}
     */
    getValuePosition: function( value, numberOfBins ) {
      assert && assert( value < numberOfBins && value >= 0, 'the average should range from 0 and the max number of bins -1' );
      return ((value + 1 / 2) / numberOfBins) * BOUNDS.width + BOUNDS.minX;
    }
  } );
} );

