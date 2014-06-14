// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' screen.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );

  // strings
  // TODO: place used strings here

  /**
   * @param {PlinkoProbabilityModel} model
   * @constructor
   */
  function PlinkoProbabilityView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      }
    } );

    this.addChild( resetAllButton );

    resetAllButton.center = this.layoutBounds.center;
  }

  return inherit( ScreenView, PlinkoProbabilityView, {
    layoutBounds: new Bounds2( 0, 0, 834, 504 )
  } );
} );
