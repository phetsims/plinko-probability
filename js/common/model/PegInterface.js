// Copyright 2015, University of Colorado Boulder

/**
 * Interface for the pegs. The interface provide many convenience function to
 * determine the position of pegs on the Galton board.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Vector2 = require( 'DOT/Vector2' );

  // in model coordinates, the galton board is defined as three points of a triangle
  // the apex of the galton board located at the origin (0,0)
  // the left corner located at (-1/2,-1)
  // the tight corner located at (1/2,-1)
  // the position of the center of the pegs can be determined by the following methods

  var PegInterface = {
    /**
     * Function that returns the x and y coordinates of a peg in reference to the galton board
     * @public (read-only)
     * @param {number} rowNumber - integer starting at zero
     * @param {number} columnNumber - index of the column, integer starting at zero
     * @param {number} numberOfRows - the number of rows on the screen
     * @returns {Vector2}
     */
    getPosition: function( rowNumber, columnNumber, numberOfRows ) {
      return new Vector2( -rowNumber / 2 + columnNumber, -rowNumber - 2 * PlinkoConstants.PEG_HEIGHT_FRACTION_OFFSET ).divideScalar( numberOfRows + 1 );
    },
    /**
     * Function that returns the visibility status of a peg on the galton board
     * @public (read-only)
     * @param {number} rowNumber - index of row, integer starting at zero
     * @param {number} numberOfRows - number of rows
     * @returns {boolean}
     */
    getIsVisible: function( rowNumber, numberOfRows ) {
      return (rowNumber < numberOfRows);
    },
    /**
     * Function that returns the X position of a peg with index rowNumber and column Number
     * The position is given in the model view (with respect to the galton board)
     * @public
     * @param {number} rowNumber
     * @param {number} columnNumber
     * @param {number} numberOfRows
     * @returns {number}
     */
    getPositionX: function( rowNumber, columnNumber, numberOfRows ) {
      return (-rowNumber / 2 + columnNumber) / (numberOfRows + 1 );
    },
    /**
     * Function that returns the Y position of a peg with index rowNumber and column Number
     * The position is given in the model view (with respect to the galton board)
     * @public (read-only)
     * @param {number} rowNumber
     * @param {number} columnNumber
     * @param {number} numberOfRows
     * @returns {number}
     */
    getPositionY: function( rowNumber, columnNumber, numberOfRows ) {
      return (-rowNumber - 2 * PlinkoConstants.PEG_HEIGHT_FRACTION_OFFSET) / (numberOfRows + 1 );
    },
    /**
     * Function that returns the horizontal spacing between two pegs on the same row
     * The distance is given in the model view (with respect to the galton board)
     * @public (read-only)
     * @param {number} numberOfRows
     * @returns {number}
     */
    getSpacing: function( numberOfRows ) {
      return 1 / (numberOfRows + 1 );
    }
  };

  plinkoProbability.register( 'PegInterface', PegInterface );

  return PegInterface;
} );