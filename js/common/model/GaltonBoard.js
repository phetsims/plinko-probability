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

       column=   -3/2 -1 -1/2  0  1/2  1  3/2
       *   *   *   *   *   *   *

       column=   -3/2 -1 -1/2  0  1/2  1  3/2
       row = 0                          *

       row = 1                      *       *

       row = 2                  *       *       *

       row = 3              *       *        *      *

       bucket=4         0       0       0       0       0

       The galton board has bounds
       (-1,0)   (0,0)    (1,0)
       ---------*---------
       |      *   *      |
       |    *       *    |
       |  *           *  |
       |*               *|
       0-----------------0
       (-1,-1)           (1,-1)

       The location of the pegs can be determined in terms of the rows and column allocation:

       The center of the top peg, ( with rowNumber =0 and columnNumber =0)  is located a (0,0);
       The horizontal y=-1, is the position of the bucket collectors. No pegs lies on this line.

       Defining the maximum number of rows as N, the vertical separation of the pegs is given by 1/(N)
       The horizontal separation between pegs is 1/(N)
       The vertical position of the peg is given by    y = -row/(N)
       whereas its horizontal position is given by     x = 2*column/(N)
       The bucket collector are located at  y =-1 and x = 2*column/(N)
       */

      //var galtonBoard = this;
      this.bounds = new Bounds2( -1, -1, 1, 0 );

      var rowNumber;
      var columnNumber;
      this.pegs = [];

      var index = 0;
      for ( rowNumber = 0; rowNumber < maxNumberOfRows; rowNumber++ ) {
        for ( columnNumber = 0; columnNumber <= rowNumber; columnNumber++ ) {

          var peg = {
            rowNumber: rowNumber,
            columnNumber: columnNumber,
            position: new Vector2( columnNumber - rowNumber * 0.5, rowNumber ),
            index: index
          };
          index++;
          this.pegs.push( peg );
        }
      }
    }

    return inherit( Object, GaltonBoard,
      {
        getPegFromRowColumn: function( row, column ) {
          var index = this.getIndexArray( row, column );
          return this.pegs[ index ];
        },

        getIndexArray: function( row, column ) {
          return column + row * (row + 1) / 2;
        },

        getPositionOnBoard: function( row, column, numberOfRows ) {
          return this.getPegFromRowColumn( row, column ).componentTimes( {
            x: 2 / numberOfRows,
            y: -1 / numberOfRows
          } );
        }
      } );

  }
)
;
