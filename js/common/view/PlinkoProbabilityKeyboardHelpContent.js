// Copyright 2018, University of Colorado Boulder

/**
 * Content for the "Hot Keys and Help" dialog that can be brought up from the sim navigation bar.
 *
 * @author Michael Kauzmann (PhET Interaction Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var GeneralNavigationHelpContent = require( 'SCENERY_PHET/keyboard/help/GeneralNavigationHelpContent' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var SliderControlsHelpContent = require( 'SCENERY_PHET/keyboard/help/SliderControlsHelpContent' );

  /**
   * Constructor.
   * @constructor
   */
  function PlinkoProbabilityKeyboardHelpContent( ) {

    var sliderControlsHelpContent = new SliderControlsHelpContent();
    var generalNavigationHelpContent = new GeneralNavigationHelpContent( { withGroupContent: true } );

    HBox.call( this, {
      children: [ sliderControlsHelpContent, generalNavigationHelpContent ],
      align: 'top',
      spacing: 30
    } );
  }

  plinkoProbability.register( 'PlinkoProbabilityKeyboardHelpContent', PlinkoProbabilityKeyboardHelpContent );

  return inherit( HBox, PlinkoProbabilityKeyboardHelpContent );
} );