// Copyright 2015, University of Colorado Boulder

/**
 * Interface for the bins.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );

  // constants
  var BOUNDS = PlinkoConstants.HISTOGRAM_BOUNDS;

  var BinInterface = {

    /**
     * Function that returns the center x coordinate of a bin with index binIndex
     * @public (read-only)
     * @param {number} binIndex - index associated with the bin, the index may range from 0 to numberOfBins-1
     * @param {number} numberOfBins - the number of bins on the screen
     * @returns {number}
     */
    getBinCenterX: function( binIndex, numberOfBins ) {
      assert && assert( binIndex <= numberOfBins );
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
      assert && assert( binIndex <= numberOfBins );
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
      assert && assert( value <= numberOfBins && value >= 0, 'the average should be between 0 and the max number of bins' );
      return ((value + 1 / 2) / numberOfBins) * BOUNDS.width + BOUNDS.minX;
    }
  };

  plinkoProbability.register( 'BinInterface', BinInterface );

  return BinInterface;
} );
