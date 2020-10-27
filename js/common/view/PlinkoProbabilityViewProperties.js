// Copyright 2016-2020, University of Colorado Boulder

/**
 * View-specific properties common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import plinkoProbability from '../../plinkoProbability.js';

// constants
const HISTOGRAM_MODE_VALUES = [ 'counter', 'cylinder', 'fraction' ]; // values for histogramModeProperty

class PlinkoProbabilityViewProperties {
  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      histogramMode: 'cylinder' // {string} see HISTOGRAM_MODE_VALUES
    }, options );

    // @public
    this.histogramModeProperty = new StringProperty( options.histogramMode, {
      validValues: HISTOGRAM_MODE_VALUES
    } );
    this.expandedAccordionBoxProperty = new BooleanProperty( true );
    this.isTheoreticalHistogramVisibleProperty = new BooleanProperty( false );
    this.isSoundEnabledProperty = new BooleanProperty( false );
  }


  // @public
  reset() {
    this.histogramModeProperty.reset();
    this.expandedAccordionBoxProperty.reset();
    this.isTheoreticalHistogramVisibleProperty.reset();
    this.isSoundEnabledProperty.reset();
  }
}

plinkoProbability.register( 'PlinkoProbabilityViewProperties', PlinkoProbabilityViewProperties );

export default PlinkoProbabilityViewProperties;