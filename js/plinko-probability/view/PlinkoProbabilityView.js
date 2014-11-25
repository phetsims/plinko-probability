// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' screen.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ControlPanel = require( 'PLINKO/plinko-probability/view/ControlPanel' );
  var GaltonBoardNode = require( 'PLINKO/plinko-probability/view/GaltonBoardNode' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var StatisticsDisplayNode = require( 'PLINKO/plinko-probability/view/StatisticsDisplayNode' );
  var ScreenView = require( 'JOIST/ScreenView' );


  // strings
  // TODO: place used strings here

  /**
   * @param {PlinkoProbabilityModel} model
   * @constructor
   */
  function PlinkoProbabilityView( model ) {

    var thisView = this;
    ScreenView.call( this, {renderer: 'svg'} );

    var galtonBoardNode = new GaltonBoardNode( model );
    this.addChild( galtonBoardNode );

    var histogramRadioProperty = new Property( 'fraction' ); //Valid values are 'fraction', 'number', and 'autoScale'.

    var showRadioProperty = new Property( 'ball' ); // Valid values are 'ball', 'path', and 'none'.

    var ballRadioProperty = new Property( 'oneBall' ); // Valid values are 'oneBall' and 'continuous'.

    ballRadioProperty.link( function( value ) {
      //do stuff
    } );

    this.addChild( new ControlPanel( model, histogramRadioProperty,
      showRadioProperty, ballRadioProperty,
      {top: 10, right: this.layoutBounds.right - 10} ) );

    var statisticsDisplayNode = new StatisticsDisplayNode( model );
    this.addChild( statisticsDisplayNode );

    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  thisView.layoutBounds.maxX - 10,
      bottom: thisView.layoutBounds.maxY - 10
    } );

    thisView.addChild( resetAllButton );

  }

  return inherit( ScreenView, PlinkoProbabilityView, {
    layoutBounds: new Bounds2( 0, 0, 834, 504 )
  } );
} );
