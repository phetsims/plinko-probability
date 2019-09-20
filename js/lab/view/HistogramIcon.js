// Copyright 2014-2019, University of Colorado Boulder

/**
 * A Scenery node that depicts a histogram icon.
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function HistogramIcon( options ) {

    Node.call( this );

    options = _.extend( {
      binNumber: 5,
      binWidth: 6,
      binHeightMax: 10,
      binStroke: 'blue',
      binLineWidth: 1,
      binFill: null
    }, options );

    // Add the bins
    for ( let i = 0; i < options.binNumber; i++ ) {

      const height = 4 * options.binHeightMax * ( i + 1 ) / options.binNumber * ( 1 - ( i ) / options.binNumber );
      const rectangle = new Rectangle( i * options.binWidth, -height, options.binWidth, height, {
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

