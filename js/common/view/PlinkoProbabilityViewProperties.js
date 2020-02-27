// Copyright 2016-2019, University of Colorado Boulder

/**
 * View-specific properties common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import plinkoProbability from '../../plinkoProbability.js';

// constants
const HISTOGRAM_MODE_VALUES = [ 'counter', 'cylinder', 'fraction' ]; // values for histogramModeProperty

/**
 * @param {Object} [options]
 * @constructor
 */
function PlinkoProbabilityViewProperties( options ) {

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

plinkoProbability.register( 'PlinkoProbabilityViewProperties', PlinkoProbabilityViewProperties );

export default inherit( Object, PlinkoProbabilityViewProperties, {

  // @public
  reset: function() {
    this.histogramModeProperty.reset();
    this.expandedAccordionBoxProperty.reset();
    this.isTheoreticalHistogramVisibleProperty.reset();
    this.isSoundEnabledProperty.reset();
  }
} );