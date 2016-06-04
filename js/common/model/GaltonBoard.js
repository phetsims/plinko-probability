// Copyright 2014-2015, University of Colorado Boulder

/**
 * Model for the Galton Board ( also known as a bean machine). It consists in a triangular lattice of pegs
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PegInterface = require( 'PLINKO_PROBABILITY/common/model/PegInterface' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );

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
    numberOfRowsProperty.link( function( numberOfRows ) {
      galtonBoard.spacing = PegInterface.getSpacing( numberOfRows );
      galtonBoard.pegs.forEach( function( peg ) {
        // update the position of the pegs on the Galton Board.
        peg.position = PegInterface.getPosition( peg.rowNumber, peg.columnNumber, numberOfRows );
        // for performance reasons, we don't throw out the pegs, we simply update their visibility
        peg.isVisible = PegInterface.getIsVisible( peg.rowNumber, numberOfRows );
      } );
    } );
  }

  plinkoProbability.register( 'GaltonBoard', GaltonBoard );

  return inherit( Object, GaltonBoard );
} );
