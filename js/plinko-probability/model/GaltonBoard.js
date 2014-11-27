// Copyright 2002-2014, University of Colorado Boulder

/**
 * Model for the Galton Board ( also known as a bean machine). It consists in a triangular lattice of pegs
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
    'use strict';

    // modules

    //var Bounds2 = require( 'DOT/Bounds2' );
    var inherit = require( 'PHET_CORE/inherit' );
    //var Vector2 = require( 'DOT/Vector2' );

    /**
     * @param {number} maxNumberOfRows
     * @constructor
     */
    function GaltonBoard( maxNumberOfRows ) {

      var galtonBoard = this;

      var rowNumber;
      var columnNumber;
      this.pegPositionArray = [];

      var index = 0;
      for ( rowNumber = 0; rowNumber < maxNumberOfRows; rowNumber++ ) {
        for ( columnNumber = 0; i <= rowNumber; columnNumber++ ) {

          var peg = {
            rowNumber: rowNumber,
            columnNumber: columnNumber,
            positionX: columnNumber - rowNumber * 0.5,
            positionY: rowNumber,
            index: index
          };
          index++;
          this.pegPositionArray.push( peg );
        }
      }
    }

    return inherit( Object, GaltonBoard,
      {
        getPegFromRowColumn: function( row, column ) {
          var index = this.getIndexArray( row, column );
          return this.pegPositionArray[index];
        },

        getIndexArray: function( row, column ) {
          return column + row * (row + 1) / 2;
        }

      } );

  }
)
;
