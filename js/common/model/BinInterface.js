// Copyright 2015, University of Colorado Boulder

/**
 * Interface for the bins.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );

  // constants
  var BOUNDS = PlinkoConstants.HISTOGRAM_BOUNDS;
  
  var BinInterface = {
    /**
     * Function that returns the center x coordinate of a bin with index binIndex 
     * @param {number} binIndex - index associated with the bin, the index may range from 0 to numberOfBins-1 
     * @param {number} numberOfBins - the number of bins on the screen
     * @returns {number}
     */
    getBinCenterX: function( binIndex, numberOfBins ) {
      assert && assert( binIndex < numberOfBins );
      return ((binIndex + 1 / 2) / numberOfBins) * BOUNDS.width + BOUNDS.minX;
    },

    /**
     * Function that returns the left position of a bin
     * @param {number} binIndex
     * @param {number} numberOfBins - the number of bins on the screen
     * @returns {number}
     */
    getBinLeft: function( binIndex, numberOfBins ) {
      assert && assert( binIndex < numberOfBins );
      return (binIndex / numberOfBins) * BOUNDS.width + BOUNDS.minX;
    },

    /**
     * Function that returns the right position of a bin
     * @param {number} binIndex
     * @param {number} numberOfBins - the number of bins on the screen
     * @returns {number}
     */
    getBinRight: function( binIndex, numberOfBins ) {
      assert && assert( binIndex < numberOfBins );
      return ((binIndex + 1 ) / numberOfBins) * BOUNDS.width + BOUNDS.minX;
    },

    /**
     * Function that returns the width of a bin
     * @param {number} numberOfBins
     * @returns {number}
     */
    getBinWidth: function( numberOfBins ) {
      return (1 / numberOfBins) * BOUNDS.width;
    },

    /**
     * Function that returns the minimum X value, i.e. the leftmost position of all the bins
     * @returns {number}
     */
    getMinX: function() {
      return BOUNDS.minX;
    },

    /**
     * Function that returns the maximum X value, i.e. the rightmost position of all the bins
     * @returns {number}
     */
    getMaxX: function() {
      return BOUNDS.maxX;
    },

    /**
     * Function that returns the center X value of the bins, i.e. the center position of all the bins
     * @returns {number}
     */
    getCenterX: function() {
      return BOUNDS.centerX;
    },

    /**
     * Function that returns the center X value of the bins, i.e. the center position of all the bins
     * @returns {number}
     */
    getCenterY: function() {
      return BOUNDS.centerY;
    },

    /**
     * Function that returns the minimum Y value, i.e. the bottom position of all the bins
     * @returns {number}
     */
    getMinY: function() {
      return BOUNDS.minY;
    },

    /**
     * Function that returns the maximum Y value, i.e. the topmost position of all the bins
     * @returns {number}
     */
    getMaxY: function() {
      return BOUNDS.maxY;
    },

    /**
     * Function that returns the middle position of the bin with index value.
     * This is useful to determine the x-position of the label attached to the bin
     * @param {number} value
     * @param {number} numberOfBins - the number of bins on the screen
     * @returns {number}
     */
    getValuePosition: function( value, numberOfBins ) {
      assert && assert( value < numberOfBins );
      return ((value + 1 / 2) / numberOfBins) * BOUNDS.width + BOUNDS.minX;
    }
  };
  
  plinkoProbability.register( 'BinInterface', BinInterface );

  return BinInterface;
} );
