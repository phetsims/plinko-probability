// Copyright 2015-2020, University of Colorado Boulder

/**
 * Model of a histogram that keeps track of the number of counts in each bin
 * and some associated statistics
 *
 * @author Martin Veillette (Berea College)
 */

import Emitter from '../../../../axon/js/Emitter.js';
import inherit from '../../../../phet-core/js/inherit.js';
import plinkoProbability from '../../plinkoProbability.js';
import PlinkoProbabilityConstants from '../PlinkoProbabilityConstants.js';

// constants
const BOUNDS = PlinkoProbabilityConstants.HISTOGRAM_BOUNDS;

/**
 * @param {Property.<number>} numberOfRowsProperty
 * @constructor
 */
function Histogram( numberOfRowsProperty ) {

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
  const self = this;
  numberOfRowsProperty.link( function() {
    self.reset(); // if the number of rows change then reset the histogram
  } );
}

plinkoProbability.register( 'Histogram', Histogram );

inherit( Object, Histogram, {

  /**
   * sets all the binCounts to 0 and resets the statistics
   * @public
   */
  reset: function() {
    this.setBinsToZero();
    this.resetStatistics();
    this.histogramUpdatedEmitter.emit();
  },

  /**
   * Used in the "ballsOnScreen" query parameter to set an initial amount of balls within the histogram.
   *
   * @param ballsOnScreen {number} - user inputted query parameter for the amount of balls the histogram is initialized with
   * @public
   */
  prepopulate: function( ballsOnScreen ) {

    // temporarily stores the binCount for each bin in an empty array.
    const tempBins = [];
    for ( var tempBinIndex = 0; tempBinIndex < ( this.numberOfRowsProperty.get() + 1 ); tempBinIndex++ ) {
      tempBins[ tempBinIndex ] = 0;
    }

    // determines probability of balls falling through galton board
    for ( let ballIndex = 0; ballIndex < ballsOnScreen; ballIndex++ ) {
      let columnNumber = 0;
      // the path of the balls through the pegs of the galton board  is determined for the prepopulated balls only
      for ( let rowNumber = 0; rowNumber <= this.numberOfRowsProperty.get(); rowNumber++ ) {
        const direction = ( phet.joist.random.nextBoolean() ? 'left' : 'right' );

        // increment the column number of the next row, but not for the last row
        if ( rowNumber < this.numberOfRowsProperty.get() ) {
          columnNumber += ( direction === 'left' ) ? 0 : 1;
        }
      }
      // updates the binCount of a bin at a specific index
      tempBins[ columnNumber ]++;

    }

    // takes values in temporary bin array and translates them into our bin array
    for ( tempBinIndex = 0; tempBinIndex < ( this.numberOfRowsProperty.get() + 1 ); tempBinIndex++ ) {
      this.bins[ tempBinIndex ] = {
        binCount: tempBins[ tempBinIndex ], // number of balls that will be in the bin (including those currently falling through the galton board)
        visibleBinCount: tempBins[ tempBinIndex ], // number of balls that are in the bin
        orientation: 0 // 0 is center, 1 is right, -1 is left
      };
    }

    // now we update the view and generate our statistics
    this.initializeStatistics();
    this.histogramUpdatedEmitter.emit();
  },

  /**
   * Sets the value of all bins in the histogram to zero.
   *
   * @private
   */
  setBinsToZero: function() {
    this.bins = []; // reset the bin array to an empty array
    let binInfo;
    const maxBins = PlinkoProbabilityConstants.ROWS_RANGE.max + 1;
    for ( let i = 0; i < maxBins; i++ ) {
      binInfo = {
        binCount: 0, // number of balls that will be in the bin (including those currently falling through the galton board)
        visibleBinCount: 0, // number of balls that are in the bin
        orientation: 0 // 0 is center, 1 is right, -1 is left
      };
      this.bins.push( binInfo );
    }
  },

  /**
   * Updates the array elements for the number of balls in a bin and the horizontal final position of the last ball.
   *
   * @param {Ball} ball
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
    const N = this.landedBallsNumber;

    this.average = ( ( N - 1 ) * this.average + binIndex ) / N;
    this.sumOfSquares += binIndex * binIndex;

    // the variance and standard deviations exist only when the number of balls is larger than 1
    if ( N > 1 ) {
      this.variance = ( this.sumOfSquares - N * this.average * this.average ) / ( N - 1 );
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
   * Initializes statistics based on what's in the bins.
   * @private
   */
  initializeStatistics: function() {

    let totalNumberOfBalls = 0;
    let sum = 0;
    let sumOfSquares = 0;

    this.bins.forEach( function( bin, binIndex ) {
      totalNumberOfBalls += bin.binCount;
      sum += bin.binCount * binIndex;
      sumOfSquares += bin.binCount * binIndex * binIndex;
    } );

    this.sumOfSquares = sumOfSquares;
    this.landedBallsNumber = totalNumberOfBalls;
    this.average = sum / totalNumberOfBalls;
    this.variance = ( sumOfSquares - ( this.average * this.average * totalNumberOfBalls ) ) / ( totalNumberOfBalls - 1 );
    this.standardDeviation = Math.sqrt( this.variance );
    this.standardDeviationOfMean = this.standardDeviation / Math.sqrt( totalNumberOfBalls );
  },

  /**
   * Resets all the statistics data to zero
   *
   * @private
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
   * Add an additional ball to the appropriate bin and update all the relevant statistics
   *
   * @param {Ball} ball
   * @public
   */
  addBallToHistogram: function( ball ) {
    this.bins[ ball.binIndex ].visibleBinCount++;
    this.updateStatistics( ball.binIndex );
    this.histogramUpdatedEmitter.emit();
  },

  /**
   * Function that returns the number of counts in a bin
   * The count is a non-negative integer
   *
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
   *
   * @param {number} binIndex - an integer
   * @returns {number}
   * @public
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
   *
   * @returns {Array.<number>}
   * @public
   */
  getNormalizedSampleDistribution: function() {
    const maxCount = this.getMaximumBinCount();
    // we don't want to divide by zero; if maxCount is zero, then bin.visibleCount is zero anyway.
    const divisionFactor = Math.max( maxCount, 1 );
    const normalizedArray = this.bins.map( function( bin ) {
      return bin.visibleBinCount / divisionFactor;
    } );
    return normalizedArray;
  },

  /**
   * Function that returns the maximum value of all the balls in the bins
   * This includes the balls that still traveling through the GaltonBoard
   *
   * @returns {number}
   * @public
   */
  getMaximumActualBinCount: function() {
    let maxCount = 0;
    this.bins.forEach( function( binElement ) {
      maxCount = Math.max( maxCount, binElement.binCount );
    } );
    return maxCount;
  },

  /**
   * Function that returns the maximum visible value of the balls in the bins
   * This does not include the balls that are still traveling through the GaltonBoard
   *
   * @returns {number}
   * @public
   */
  getMaximumBinCount: function() {
    let maxCount = 0;
    this.bins.forEach( function( binElement ) {
      maxCount = Math.max( maxCount, binElement.visibleBinCount );
    } );
    return maxCount;
  },

  /**
   * Function that returns the center x coordinate of a bin with index binIndex
   *
   * @param {number} binIndex - index associated with the bin, the index may range from 0 to numberOfBins-1
   * @param {number} numberOfBins - the number of bins on the screen
   * @returns {number}
   * @public
   */
  getBinCenterX: function( binIndex, numberOfBins ) {
    assert && assert( binIndex < numberOfBins, 'The binIndex must be smaller than the total number of bins' );
    return ( ( binIndex + 1 / 2 ) / numberOfBins ) * BOUNDS.width + BOUNDS.minX;
  },

  /**
   * Function that returns the left position of a bin
   *
   * @param {number} binIndex
   * @param {number} numberOfBins - the number of bins on the screen
   * @returns {number}
   * @public
   */
  getBinLeft: function( binIndex, numberOfBins ) {
    assert && assert( binIndex < numberOfBins, 'The binIndex must be smaller than the total number of bins' );
    return ( binIndex / numberOfBins ) * BOUNDS.width + BOUNDS.minX;
  },

  /**
   * Function that returns the minimum X value, i.e. the leftmost position of all the bins
   *
   * @returns {number}
   * @public
   */
  getMinX: function() {
    return BOUNDS.minX;
  },

  /**
   * Function that returns the center X value of the bins, i.e. the center position of all the bins
   *
   * @returns {number}
   * @public
   */
  getCenterX: function() {
    return BOUNDS.centerX;
  },

  /**
   * Function that returns the minimum Y value, i.e. the bottom position of all the bins
   *
   * @public
   * @returns {number}
   */
  getMinY: function() {
    return BOUNDS.minY;
  },

  /**
   * Function that returns the x position (in model coordinates) associated with
   * the average (mean) value of the histogram.
   *
   * @param {number} value
   * @param {number} numberOfBins - the number of bins on the screen
   * @returns {number}
   * @public
   */
  getValuePosition: function( value, numberOfBins ) {
    assert && assert( value < numberOfBins && value >= 0, 'the average should range from 0 and the max number of bins -1' );
    return ( ( value + 1 / 2 ) / numberOfBins ) * BOUNDS.width + BOUNDS.minX;
  }
} );

export default Histogram;