// Copyright 2014-2025, University of Colorado Boulder

/**
 * A Scenery node that depicts a histogram icon.
 *
 * @author Martin Veillette (Berea College)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import plinkoProbability from '../../plinkoProbability.js';

class HistogramIcon extends Node {
  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    super();

    options = merge( {
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
}

plinkoProbability.register( 'HistogramIcon', HistogramIcon );

export default HistogramIcon;