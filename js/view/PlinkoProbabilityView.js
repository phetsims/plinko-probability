// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' screen.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  // var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ControlPanel = require( 'PLINKO/view/ControlPanel' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );



  // strings
  // TODO: place used strings here

  /**
   * @param {PlinkoProbabilityModel} model
   * @constructor
   */
  function PlinkoProbabilityView( model ) {
    ScreenView.call( this, { renderer: 'svg' } );

    var histogramRadioProperty = new Property( 'fraction' ); //Valid values are 'fraction', 'number', and 'autoScale'.

    var showRadioProperty = new Property( 'ball' ); // Valid values are 'ball', 'path', and 'none'.

    var ballRadioProperty = new Property( 'oneBall' ) // Valid values are 'oneBall' and 'continous'.

    ballRadioProperty.link( function( value ) {
      //do stuff
    } );

    this.addChild( new ControlPanel( model, this, histogramRadioProperty,
     showRadioProperty, ballRadioProperty,
     { top: 10, right: this.layoutBounds.right - 10 } ) );

    // resetAllButton.center = this.layoutBounds.center;
  }

  return inherit( ScreenView, PlinkoProbabilityView, {
    layoutBounds: new Bounds2( 0, 0, 834, 504 )
  } );
} );
