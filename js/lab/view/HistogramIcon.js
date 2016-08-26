// Copyright 2014-2015, University of Colorado Boulder

/**
 * A Scenery node that depicts a histogram icon.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function HistogramIcon( options ) {

    Node.call( this );

    options = _.extend( {
      // defaults

      binNumber: 5,
      binWidth: 6,
      binHeightMax: 10,
      binStroke: 'blue',
      binLineWidth: 1,
      binFill: null
    }, options );

    // Add the bins
    for ( var i = 0; i < options.binNumber; i++ ) {

      var height = 4 * options.binHeightMax * ( i + 1 ) / options.binNumber * ( 1 - ( i ) / options.binNumber );
      var rectangle = new Rectangle( i * options.binWidth, -height, options.binWidth, height, {
        fill: options.binFill,
        lineWidth: options.binLineWidth,
        stroke: options.binStroke
      } );
      this.addChild( rectangle );
    }

    // Pass options through to the parent class.
    this.mutate( options );
  }

  plinkoProbability.register( 'HistogramIcon', HistogramIcon );

  return inherit( Node, HistogramIcon );
} );

