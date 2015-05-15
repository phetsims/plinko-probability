// Copyright 2002-2015, University of Colorado Boulder

/**
 * Interface for the bins.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );

  // constants
  var BOUNDS = PlinkoConstants.HISTOGRAM_BOUNDS;

  return {
    /**
     * Function that returns the x and y coordinates of a peg in reference to the galtonBoard bounds
     * @param {number} binIndex
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

    getMinX: function() {
      return BOUNDS.minX;
    },

    getMaxX: function() {
      return BOUNDS.maxX;
    },

    getCenterX: function() {
      return BOUNDS.centerX;
    },

    getCenterY: function() {
      return BOUNDS.centerY;
    },

    getMinY: function() {
      return BOUNDS.minY;
    },

    getMaxY: function() {
      return BOUNDS.maxY;
    }
  };
} );
