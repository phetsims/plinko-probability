// Copyright 2002-2013, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' screen.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var BallNode = require( 'PLINKO/plinko-probability/view/BallNode' );
  var BallRadioButtonsControl = require( 'PLINKO/plinko-probability/view/BallRadioButtonsControl' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var PlayPanel = require( 'PLINKO/plinko-probability/view/PlayPanel' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var GaltonBoardNode = require( 'PLINKO/plinko-probability/view/GaltonBoardNode' );
  var HistogramNode = require( 'PLINKO/plinko-probability/view/HistogramNode' );
  var HSlider = require( 'SUN/HSlider' );
  var Hopper = require( 'PLINKO/plinko-probability/view/Hopper' );
  var Board = require( 'PLINKO/plinko-probability/view/Board' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );

  //var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StatisticsDisplayNode = require( 'PLINKO/plinko-probability/view/StatisticsDisplayNode' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SliderControlPanel = require( 'PLINKO/plinko-probability/view/SliderControlPanel' );
  var Vector2 = require( 'DOT/Vector2' );


  // strings
  // TODO: place used strings here

  // images
  var mockup01Image = require( 'image!PLINKO/mockup01.png' );
  var mockup02Image = require( 'image!PLINKO/mockup02.png' );

  /**
   * @param {PlinkoProbabilityModel} model
   * @constructor
   */
  function PlinkoProbabilityView( model ) {

    var thisView = this;
    ScreenView.call( this, {renderer: 'svg', layoutBounds: new Bounds2( 0, 0, 1024, 618 )} );
    //ScreenView.call( this, {renderer: 'svg', layoutBounds: new Bounds2( 0, 0, 768, 504 )} );


    var hopper = new Hopper();
    this.addChild( hopper );
    var board = new Board();
    this.addChild( board );

    hopper.centerX = this.layoutBounds.maxX / 2 - 80;
    hopper.top = 10;
    board.centerX = hopper.centerX;
    board.top = hopper.bottom + 10;
    var viewGraphBounds = new Bounds2( 100, 350, 300, 410 );
    var modelGraphBounds = new Bounds2( 0, 0, 10, 10 );
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelGraphBounds, viewGraphBounds );
    var mvt = ModelViewTransform2.createSinglePointXYScaleMapping( new Vector2( 0, 0 ), new Vector2( 300, 100 ), 20, 10 );
    thisView.modelViewTransform = modelViewTransform; // Make the modelViewTransform available to descendant types.


    var histogramNode = new HistogramNode( {xRange: new Range( 0, 20 ), yRange: new Range( 0, 20 )}, model.histogram, modelViewTransform );


    var galtonBoardNode = new GaltonBoardNode( model, mvt );


    //var histogramRadioProperty = new Property( 'fraction' ); //Valid values are 'fraction', 'number', and 'autoScale'.

    var showRadioProperty = new Property( 'ball' ); // Valid values are 'ball', 'path', and 'none'.

    var ballRadioProperty = new Property( 'oneBall' ); // Valid values are 'oneBall' and 'continuous'.

    ballRadioProperty.link( function( value ) {
      //do stuff
    } );

    var ballRadioButtonsControl = new BallRadioButtonsControl( showRadioProperty );


    // Add the button that allows the graph to be cleared of all dataPoints.
    var eraserButton = new EraserButton( {
      left: 20,
      top: this.layoutBounds.maxY - 70,
      scale: 1.4,
      listener: function() {
        // TODO hooked the listener;
      }
    } );


    // Handle the comings and goings of balls
    this.ballsLayer = new Node();
    this.addChild( this.ballsLayer );

    model.balls.addItemAddedListener( function( addedBall ) {

      //   var mvt = ModelViewTransform2.createSinglePointXYScaleMapping( new Vector2( 0, 0 ), new Vector2( 300, 100 ), 10, -10 );

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

    // create play Panel
    var playPanel = new PlayPanel( model.isPlayingProperty, ballRadioProperty );

    // create slider Panel
    var sliderControlPanel = new SliderControlPanel( model.numberOfRowsForSliderProperty, model.probabilityProperty );

    // create Panel that displays sample and theoretical statistics
    var statisticsDisplayNode = new StatisticsDisplayNode( model );


    // Create and add the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  thisView.layoutBounds.maxX - 10,
      bottom: thisView.layoutBounds.maxY - 10
    } );

    // Create and add the Sound Toggle Button in the bottom right
    var soundToggleButton = new SoundToggleButton( model.isSoundEnabledProperty, {
      right: resetAllButton.left - 20,
      centerY: resetAllButton.centerY
    } );

    this.addChild( eraserButton );
    this.addChild( ballRadioButtonsControl );
    this.addChild( soundToggleButton );
    this.addChild( resetAllButton );
    this.addChild( playPanel );
    this.addChild( sliderControlPanel );
    this.addChild( statisticsDisplayNode );
    this.addChild( galtonBoardNode );
    this.addChild( histogramNode );

    ballRadioButtonsControl.left = this.layoutBounds.maxX / 2;
    ballRadioButtonsControl.top = 20;
    playPanel.right = this.layoutBounds.maxX - 30;
    playPanel.top = 10;
    sliderControlPanel.top = playPanel.bottom + 10;
    sliderControlPanel.right = playPanel.right;
    statisticsDisplayNode.top = sliderControlPanel.bottom + 10;
    statisticsDisplayNode.right = playPanel.right;


    //TODO to erase
    ////////////////////////////////////////////////////////////////
    //Show the mock-up and a slider to change its transparency
    //////////////////////////////////////////////////////////////
    var mockup01OpacityProperty = new Property( 0.02 );
    var mockup02OpacityProperty = new Property( 0.02 );

    var image01 = new Image( mockup01Image, {pickable: false} );
    var image02 = new Image( mockup02Image, {pickable: false} );

    image01.scale( this.layoutBounds.height / image01.height );
    image02.scale( this.layoutBounds.height / image02.height );

    mockup01OpacityProperty.linkAttribute( image01, 'opacity' );
    mockup02OpacityProperty.linkAttribute( image02, 'opacity' );
    this.addChild( image01 );
    this.addChild( image02 );

    this.addChild( new HSlider( mockup02OpacityProperty, {min: 0, max: 1}, {top: 100, left: 20} ) );
    this.addChild( new HSlider( mockup01OpacityProperty, {min: 0, max: 1}, {top: 10, left: 20} ) );
    /////////////////////////////////////////////////////////////////////////
  }

  return inherit( ScreenView, PlinkoProbabilityView, {
    step: function( dt ) {
    }

    //layoutBounds: new Bounds2( 0, 0, 834, 504 )
  } );
} );
