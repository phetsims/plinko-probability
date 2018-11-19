// Copyright 2016-2018, University of Colorado Boulder

/**
 * View-specific properties common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var StringProperty = require( 'AXON/StringProperty' );

  // constants
  var HISTOGRAM_MODE_VALUES = [ 'counter', 'cylinder', 'fraction' ]; // values for histogramModeProperty

  /**
   * @param {Object} [options]
   * @constructor
   */
  function PlinkoProbabilityViewProperties( options ) {

    options = _.extend( {
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

  return inherit( Object, PlinkoProbabilityViewProperties, {

    // @public
    reset: function() {
      this.histogramModeProperty.reset();
      this.expandedAccordionBoxProperty.reset();
      this.isTheoreticalHistogramVisibleProperty.reset();
      this.isSoundEnabledProperty.reset();
    }
  } );
} );
