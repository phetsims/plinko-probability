// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' screen.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  // var ResetAllButton = require( 'SCENERY_PHET/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ControlPanel = require( 'PLINKO/view/ControlPanel' );
  var PropertySet = require( 'AXON/PropertySet' );


  // strings
  // TODO: place used strings here

  /**
   * @param {PlinkoProbabilityModel} model
   * @constructor
   */
  function PlinkoProbabilityView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    var histogramProperties = new PropertySet( {
      fraction: true,
      number: false,
      autoScale: false,
      positionMarkerState: 'fraction' // Valid values are 'fraction', 'number', and 'autoScale'.
    } );

    var showProperties = new PropertySet( {
      ball: true,
      path: false,
      none: false,
      positionMarkerState: 'ball' // Valid values are 'ball', 'path', and 'none'.
    } );

    this.addChild( new ControlPanel( model, this, histogramProperties.positionMarkerStateProperty,
     showProperties.positionMarkerStateProperty,
     { top: 10, right: this.layoutBounds.right - 10 } ) );

    // resetAllButton.center = this.layoutBounds.center;
  }

  return inherit( ScreenView, PlinkoProbabilityView, {
    layoutBounds: new Bounds2( 0, 0, 834, 504 )
  } );
} );
