// Copyright 2016, University of Colorado Boulder

/**
 * View-specific properties common to all screens.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Property = require( 'AXON/Property' );

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
    this.histogramModeProperty = new Property( options.histogramMode );
    this.expandedAccordionBoxProperty = new Property( true );
    this.isTheoreticalHistogramVisibleProperty = new Property( false );
    this.isSoundEnabledProperty = new Property( false );

    // validate string values
    this.histogramModeProperty.link( function( histogramMode ) {
      assert && assert( _.contains( HISTOGRAM_MODE_VALUES, histogramMode ), 'invalid histogramMode: ' + histogramMode );
    } );
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
