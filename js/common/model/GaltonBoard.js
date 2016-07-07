// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the Galton Board ( also known as a bean machine). It consists in a triangular lattice of pegs
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Property.<number>} numberOfRowsProperty - number of rows of pegs
   * @constructor
   */
  function GaltonBoard( numberOfRowsProperty ) {

    var galtonBoard = this;

    // @public
    this.bounds = PlinkoConstants.GALTON_BOARD_BOUNDS;

    var rowNumber; // {number} a non negative integer
    var columnNumber; // {number} a non negative  integer
    this.pegs = []; // @public (read-only)

    // creates all the pegs (up to the maximum number of possible rows)
    for ( rowNumber = 0; rowNumber <= PlinkoConstants.ROWS_RANGE.max; rowNumber++ ) {
      for ( columnNumber = 0; columnNumber <= rowNumber; columnNumber++ ) {
        var peg = {
          rowNumber: rowNumber, // an integer starting at zero
          columnNumber: columnNumber // an integer starting at zero
        };
        this.pegs.push( peg );
      }
    }

    // link the numberOrRows to adjust the spacing between pegs (and size)
    // link is present for the lifetime of the sum
    numberOfRowsProperty.link( function( numberOfRows ) {

      galtonBoard.pegs.forEach( function( peg ) {
        // for performance reasons, we don't throw out the pegs, we simply update their visibility
        peg.isVisible = galtonBoard.getIsVisible( peg.rowNumber, numberOfRows );  // @public (read-only)
        if ( peg.isVisible ) {
          // update the position of the pegs on the Galton Board.
          peg.position = galtonBoard.getPosition( peg.rowNumber, peg.columnNumber, numberOfRows ); // @public (read-only)
        }
      } );
    } );
  }

  plinkoProbability.register( 'GaltonBoard', GaltonBoard );

  return inherit( Object, GaltonBoard, {

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
       * @public (read-only)
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
    }
  );
} );
