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
  var PegInterface = require( 'PLINKO_PROBABILITY/common/model/PegInterface' );
  //var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  //var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {number} maxNumberOfRows - maximum number of rows for the simulation
   * @constructor
   */

  function GaltonBoard( maxNumberOfRows, numberOfRowsProperty ) {

    var galtonBoard = this;
    this.bounds = new Bounds2( -1 / 2, -1, 1 / 2, 0 );

    var rowNumber; // {number} a non negative integer
    var columnNumber; // {number} a non negative  integer
    this.pegs = [];

    for ( rowNumber = 0; rowNumber <= maxNumberOfRows; rowNumber++ ) {
      for ( columnNumber = 0; columnNumber <= rowNumber; columnNumber++ ) {
        var peg = {
          rowNumber: rowNumber, // an integer starting at one
          columnNumber: columnNumber // an integer starting at zero
        };
        this.pegs.push( peg );
      }
    }
    // see chipper/seedrandom-2.2.js on how to use
    Math.seedrandom( "123" ); // use a seed reproducibility


    numberOfRowsProperty.link( function( numberOfRows ) {
      galtonBoard.spacing = PegInterface.getSpacing( numberOfRows );
      galtonBoard.pegs.forEach( function( peg) {
        peg.position = PegInterface.getPosition( peg.rowNumber, peg.columnNumber, numberOfRows );
        peg.isVisible = PegInterface.getIsVisible( peg.rowNumber, numberOfRows );
      } );
    } );
  }

  return inherit( Object, GaltonBoard );
});
