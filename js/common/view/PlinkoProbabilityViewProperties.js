// Copyright 2016-2017, University of Colorado Boulder

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
  var PropertyIO = require( 'AXON/PropertyIO' );

  // phet-io modules
  var BooleanIO = require( 'ifphetio!PHET_IO/types/BooleanIO' );
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );

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
    this.histogramModeProperty = new Property( options.histogramMode, { phetioType: PropertyIO( StringIO ) } );
    this.expandedAccordionBoxProperty = new Property( true );
    this.isTheoreticalHistogramVisibleProperty = new Property( false );
    this.isSoundEnabledProperty = new Property( false, { phetioType: PropertyIO( BooleanIO ) } );

    // validate string values
    this.histogramModeProperty.link( function( histogramMode ) {
      assert && assert( _.includes( HISTOGRAM_MODE_VALUES, histogramMode ), 'invalid histogramMode: ' + histogramMode );
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
