// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' screen.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BallNode = require( 'PLINKO/plinko-probability/view/BallNode' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var ControlPanel = require( 'PLINKO/plinko-probability/view/ControlPanel' );
  var EraserButton = require( 'PLINKO/plinko-probability/view/EraserButton' );
  var GaltonBoardNode = require( 'PLINKO/plinko-probability/view/GaltonBoardNode' );
  var HistogramNode = require( 'PLINKO/plinko-probability/view/HistogramNode' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var StatisticsDisplayNode = require( 'PLINKO/plinko-probability/view/StatisticsDisplayNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Vector2 = require( 'DOT/Vector2' );


  // strings
  // TODO: place used strings here

  /**
   * @param {PlinkoProbabilityModel} model
   * @constructor
   */
  function PlinkoProbabilityView( model ) {

    var thisView = this;
    ScreenView.call( this, {renderer: 'svg'} );

    var viewGraphBounds = new Bounds2( 100, 350, 300, 410 );
    var modelGraphBounds = new Bounds2( 0, 0, 20, 20 );
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelGraphBounds, viewGraphBounds );

    thisView.modelViewTransform = modelViewTransform; // Make the modelViewTransform available to descendant types.


    var histogramNode = new HistogramNode( {xRange: new Range( 0, 20 ), yRange: new Range( 0, 20 )}, modelViewTransform );
    this.addChild( histogramNode );

    var galtonBoardNode = new GaltonBoardNode( model );
    this.addChild( galtonBoardNode );

    var histogramRadioProperty = new Property( 'fraction' ); //Valid values are 'fraction', 'number', and 'autoScale'.

    var showRadioProperty = new Property( 'ball' ); // Valid values are 'ball', 'path', and 'none'.

    var ballRadioProperty = new Property( 'oneBall' ); // Valid values are 'oneBall' and 'continuous'.

    ballRadioProperty.link( function( value ) {
      //do stuff
    } );


    // Add the button that allows the graph to be cleared of all dataPoints.
    var eraserButton = new EraserButton( {
      right: thisView.layoutBounds.maxX / 2,
      top: 20,
      listener: function() {
        // TODO hooked the listener;
      }
    } );
    this.addChild( eraserButton );


// play button
    var playPauseButtonOptions = {
      //upFill: Constants.blueUpColor,
      //overFill: Constants.blueOverColor,
      //disabledFill: Constants.blueDisabledColor,
      //downFill: Constants.blueDownColor,
      //backgroundGradientColorStop0: Constants.buttonBorder0,
      //backgroundGradientColorStop1: Constants.buttonBorder1,
      innerButtonLineWidth: 1
    };
    var playPauseButton = new PlayPauseButton( model.isPlayingProperty, {
      x:       thisView.layoutBounds.maxX / 2 - 10,
      centerY: thisView.layoutBounds.maxY - 30,
      scale: 1.0,
      touchExpansion: 12,
      pauseOptions: playPauseButtonOptions,
      playOptions: playPauseButtonOptions
    } );
    this.addChild( playPauseButton );


    // Handle the comings and goings of balls
    this.ballsLayer = new Node();
    this.addChild( this.ballsLayer );

    model.balls.addItemAddedListener( function( addedBall ) {

      var mvt = ModelViewTransform2.createSinglePointXYScaleMapping( new Vector2( 0, 0 ), new Vector2( 300, 100 ), 10, -10 );

      // Create and add the view representation for this dataBall.
      var addedBallNode = new BallNode( addedBall, mvt );
      thisView.ballsLayer.addChild( addedBallNode );

      // Add the removal listener for if and when this dataPoint is removed from the model.
      model.balls.addItemRemovedListener( function removalListener( removedBall ) {
        if ( removedBall === addedBall ) {
          thisView.ballsLayer.removeChild( addedBallNode );
          model.balls.removeItemRemovedListener( removalListener );
        }
      } );
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
    step: function( dt ) {
    },

    layoutBounds: new Bounds2( 0, 0, 834, 504 )
  } );
} );
