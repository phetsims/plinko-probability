// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model for the Galton Board ( also known as a bean machine). It consists in a triangular lattice of pegs
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
    'use strict';

    // modules
    var Bounds2 = require( 'DOT/Bounds2' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Vector2 = require( 'DOT/Vector2' );

    /**
     * @param {number} maxNumberOfRows - maximum number of rows for the simulation
     * @constructor
     */
    function GaltonBoard( maxNumberOfRows ) {

      /*

       The pegs are labeled in terms of their row and columns;
       The leftmost column of every row is column 0

       row = 0                          *

       row = 1                      *        *

       row = 2                  *       *        *

       row = 3              *       *        *        *

       bucket=4     |       |       |        |        |       |  (edges)

       The galton board has bounds given as bounds2( -1,-1,1,0)

       (-1,0)   (0,0)    (1,0)
       ----------*----------
       |       *   *       |
       |     *       *     |
       |   *           *   |
       |-------------------|
       (-1,-1)           (1,-1)

       The location of the pegs can be determined in terms of the rows and column allocation:

       The center of the top peg, ( with rowNumber =0 and columnNumber =0)  is located a (0,0);
       The horizontal y=-1, is the position of edges of the bucket collectors. No pegs lies on this line.

       Defining the maximum number of rows as N, the vertical separation of the pegs is given by 1/(N)
       The horizontal separation between pegs is 1/(N+1)
       The vertical position of the peg is given by    y = -row/(N)
       whereas its horizontal position is given by     x = (2*column-rowNumber)/(N+1)
       The bucket collector are located at  y =-1 and x = (2*column/(N+1) - 1
       */

      //var galtonBoard = this;
      this.bounds = new Bounds2( -1, -1, 1, 0 );

      var rowNumber; // {number} a non negative integer
      var columnNumber; // {number} a non negative  integer
      this.pegs = [];

      var index = 0;
      for ( rowNumber = 0; rowNumber < maxNumberOfRows; rowNumber++ ) {
        for ( columnNumber = 0; columnNumber <= rowNumber; columnNumber++ ) {

          var peg = {
            rowNumber: rowNumber, // an integer starting at zero
            columnNumber: columnNumber, // an integer starting at zero
            unnormalizedPosition: new Vector2( columnNumber - rowNumber * 0.5, rowNumber ), //
            index: index
          };
          index++;
          this.pegs.push( peg );
        }
      }
    }

    return inherit( Object, GaltonBoard,
      {
        /**
         *
         * @param {number} row - a non negative integer
         * @param {number} column - an integer or half integer
         * @returns {Object} peg
         */
        getPegFromRowColumn: function( row, column ) {
          var index = this.getIndexArray( row, column );
          return this.pegs[ index ];
        },

        /**
         * Function that returns the index of a peg (in the array pegs) from its row and column position
         * @param {number} row - a non negative  integer
         * @param {number} column - an integer
         * @returns {number} index
         */
        getIndexArray: function( row, column ) {
          return column + row * (row + 1) / 2;
        },

        /**
         * Function that returns the x and y coordinates of an peg in reference to the galtonBoard bounds
         * The position is normalized
         * @param {number} row
         * @param {number} column
         * @param {number} numberOfRows - the number of rows on the screen
         * @returns {Vector2}
         */
        getOnBoardPosition: function( row, column, numberOfRows ) {
          return this.getPegFromRowColumn( row, column ).unnormalizedPosition.componentTimes( {
            x: 2 / numberOfRows,
            y: -1 / numberOfRows
          } );
        },

        /**
         * Function that returns the position of a bucket
         * The x position is defined as the center X of the bucket
         * whereas the y-position is the top position
         * The position is normalized.
         * @param {number} column
         * @param {number} numberOfRows - the number of rows on the screen
         * @returns {Vector2}
         */
        getBucketPosition: function( column, numberOfRows ) {
          return this.getOnBoardPosition( numberOfRows, column, numberOfRows );
        }
      } );

  }
)
;
