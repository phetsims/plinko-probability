// Copyright 2018, University of Colorado Boulder

/**
 * Content for the "Hot Keys and Help" dialog that can be brought up from the sim navigation bar.
 *
 * @author Michael Kauzmann (PhET Interaction Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var GeneralKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/GeneralKeyboardHelpSection' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var SliderKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/SliderKeyboardHelpSection' );

  /**
   * Constructor.
   * @constructor
   */
  function PlinkoProbabilityKeyboardHelpContent( ) {

    var sliderKeyboardHelpSection = new SliderKeyboardHelpSection();
    var generalNavigationHelpSection = new GeneralKeyboardHelpSection( { withGroupContent: true } );

    HBox.call( this, {
      children: [ sliderKeyboardHelpSection, generalNavigationHelpSection ],
      align: 'top',
      spacing: 30
    } );
  }

  plinkoProbability.register( 'PlinkoProbabilityKeyboardHelpContent', PlinkoProbabilityKeyboardHelpContent );

  return inherit( HBox, PlinkoProbabilityKeyboardHelpContent );
} );