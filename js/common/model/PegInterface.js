// Copyright 2002-2015, University of Colorado Boulder

/**
 * Interface for the pegs.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var Vector2 = require( 'DOT/Vector2' );

  return {
    /**
     * Function that returns the x and y coordinates of an peg in reference to the galtonBoard bounds
     * @param {number} rowNumber
     * @param {number} columnNumber
     * @param {number} numberOfRows - the number of rows on the screen
     * @returns {Vector2}
     */
    getPosition: function( rowNumber, columnNumber, numberOfRows ) {
      return new Vector2( -rowNumber / 2 + columnNumber, -rowNumber - 2 * PlinkoConstants.PEG_HEIGHT_FRACTION_OFFSET ).divideScalar( numberOfRows + 1 );
    },
    /**
     * Function that returns the index of a peg (in the array pegs) from its row and column position
     * @param {number} rowNumber - an integer
     * @param {number} columnNumber - an integer
     * @returns {number} index
     *
     */
    getIndex: function( rowNumber, columnNumber ) {
      return rowNumber * (rowNumber + 1) / 2 + columnNumber;
    },
    /**
     *
     * @param {number} rowNumber
     * @param {number} numberOfRows
     * @returns {boolean}
     */
    getIsVisible: function( rowNumber, numberOfRows ) {
      return (rowNumber < numberOfRows);
    },
    /**
     *
     * @param {number} rowNumber
     * @param {number} columnNumber
     * @param {number} numberOfRows
     * @returns {number}
     */
    getPositionX: function( rowNumber, columnNumber, numberOfRows ) {
      return (-rowNumber / 2 + columnNumber) / (numberOfRows + 1 );
    },
    /**
     *
     * @param {number} rowNumber
     * @param {number} columnNumber
     * @param {number} numberOfRows
     * @returns {number}
     */
    getPositionY: function( rowNumber, columnNumber, numberOfRows ) {
      return (-rowNumber - 2 * PlinkoConstants.PEG_HEIGHT_FRACTION_OFFSET) / (numberOfRows + 1 );
    },
    /**
     *
     * @param {number} numberOfRows
     * @returns {number}
     */
    getSpacing: function( numberOfRows ) {
      return 1 / (numberOfRows + 1 );
    }
  };
} );