// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' lab screen.
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var BallNode = require( 'PLINKO_PROBABILITY/common/view/BallNode' );
  var BallRadioButtonsControl = require( 'PLINKO_PROBABILITY/lab/view/BallRadioButtonsControl' );
  var Board = require( 'PLINKO_PROBABILITY/common/view/Board' );
  var Bounds2 = require( 'DOT/Bounds2' );
  //var DerivedProperty = require( 'AXON/DerivedProperty' );
  //var Color = require( 'SCENERY/util/Color' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );

  var GaltonBoardNode = require( 'PLINKO_PROBABILITY/common/view/GaltonBoardNode' );
  var HistogramNode = require( 'PLINKO_PROBABILITY/common/view/HistogramNode' );
  var HistogramRadioButtonsControl = require( 'PLINKO_PROBABILITY/lab/view/HistogramRadioButtonsControl' );
  var Hopper = require( 'PLINKO_PROBABILITY/common/view/Hopper' );
  var HSlider = require( 'SUN/HSlider' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var LabPlayPanel = require( 'PLINKO_PROBABILITY/lab/view/LabPlayPanel' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  //var Range = require( 'DOT/Range' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SliderControlPanel = require( 'PLINKO_PROBABILITY/lab/view/SliderControlPanel' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StatisticsDisplayAccordionBox = require( 'PLINKO_PROBABILITY/lab/view/StatisticsDisplayAccordionBox' );
  var TrajectoryPath = require( 'PLINKO_PROBABILITY/common/view/TrajectoryPath' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  // TODO: place used strings here

  // images
  var mockup02Image = require( 'image!PLINKO_PROBABILITY/mockupCropped02.png' );

  /**
   * @param {PlinkoProbabilityLabModel} model
   * @constructor
   */
  function PlinkoProbabilityLabView( model ) {

    var thisView = this;
    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 1024, 618 ) } );

    var galtonBoardApexPosition = new Vector2( this.layoutBounds.maxX / 2 - 80, 70 );

    // create the hopper and the wooden Board
    var hopper = new Hopper();
    var board = new Board();

    hopper.centerX = galtonBoardApexPosition.x;
    hopper.top = 10;
    // TODO: find a way to take care of the shadow offset in a less ad hoc way
    board.centerX = hopper.centerX;
    board.top = hopper.bottom + 10;

    var viewGraphBounds = board.getBounds();
    var modelGraphBounds = model.galtonBoard.bounds;
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelGraphBounds, viewGraphBounds );

    var viewProperties = new PropertySet( {
      histogramRadio: 'number', // Valid values are 'fraction', 'number'
      ballRadio: 'oneBall', // Valid values are 'oneBall' and 'continuous'.
      expandedAccordionBox: false,
      isTheoreticalHistogramVisible: false
    } );

    var histogramNode = new HistogramNode(
      model.numberOfRowsProperty,
      viewProperties.histogramRadioProperty,
      model,
      modelViewTransform,
      viewProperties.isTheoreticalHistogramVisibleProperty
    );

    var galtonBoardNode = new GaltonBoardNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, modelViewTransform );


    viewProperties.ballRadioProperty.link( function( value ) {
      //do stuff
    } );

    var ballRadioButtonsControl = new BallRadioButtonsControl( model.galtonBoardRadioButtonProperty );

    var histogramRadioButtonsControl = new HistogramRadioButtonsControl( viewProperties.histogramRadioProperty );

    // Add the eraser button that allows the
    var eraserButton = new EraserButton( {
      scale: 1.4,
      listener: function() {
        model.histogram.reset();
        model.balls.clear();
      }
    } );

    // create Panel that displays sample and theoretical statistics
    var statisticsDisplayAccordionBox = new StatisticsDisplayAccordionBox(
      model,
      viewProperties.isTheoreticalHistogramVisibleProperty,
      viewProperties.expandedAccordionBoxProperty );
    var statisticsDisplayAccordionBoxWidth = statisticsDisplayAccordionBox.right - statisticsDisplayAccordionBox.left;


    // create play Panel
    var playPanel = new LabPlayPanel( model.isPlayingProperty, model.ballModeProperty, { minWidth: statisticsDisplayAccordionBoxWidth } );


    // create slider Panel
    var sliderControlPanel = new SliderControlPanel( model.numberOfRowsProperty, model.probabilityProperty, { minWidth: statisticsDisplayAccordionBoxWidth } );


    // create the Reset All Button in the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        viewProperties.reset();
      },
      right: thisView.layoutBounds.maxX - 10,
      bottom: thisView.layoutBounds.maxY - 10
    } );

    // Create the Sound Toggle Button in the bottom right
    var soundToggleButton = new SoundToggleButton( model.isSoundEnabledProperty, {
      right: resetAllButton.left - 20,
      centerY: resetAllButton.centerY
    } );

    // Handle the comings and goings of balls
    var ballsLayer = new Node( { layerSplit: true } );
    // Handle the comings and goings of paths
    var pathsLayer = new Node( { layerSplit: true } );

    model.galtonBoardRadioButtonProperty.link( function() {
      model.balls.clear();
    } );

    model.balls.addItemAddedListener( function( addedBall ) {

      switch( model.galtonBoardRadioButtonProperty.value ) {
        case 'ball':
          var addedBallNode = new BallNode( addedBall.positionProperty, addedBall.ballRadius, modelViewTransform );
          ballsLayer.addChild( addedBallNode );
          model.balls.addItemRemovedListener( function removalListener( removedBall ) {
            if ( removedBall === addedBall ) {
              addedBallNode.dispose();
              ballsLayer.removeChild( addedBallNode );
              model.balls.removeItemRemovedListener( removalListener );
            }
          } );
          break;
        case 'path':
          var addedTrajectoryPath = new TrajectoryPath( addedBall, modelViewTransform );
          pathsLayer.addChild( addedTrajectoryPath );
          model.balls.addItemRemovedListener( function removalListener( removedBall ) {
            if ( removedBall === addedBall ) {
              pathsLayer.removeChild( addedTrajectoryPath );
              model.balls.removeItemRemovedListener( removalListener );
            }
          } );
          break;
        case 'none':
          break;
        default:
          throw new Error( 'Unhandled galton Board Radio Button state: ' + model.galtonBoardRadioButtonProperty.value );
      }
    } );
    // Create and add the view representation for this dataBall.


    this.addChild( board );
    this.addChild( eraserButton );
    this.addChild( histogramRadioButtonsControl );
    this.addChild( ballRadioButtonsControl );
    this.addChild( soundToggleButton );
    this.addChild( resetAllButton );
    this.addChild( playPanel );
    this.addChild( sliderControlPanel );
    this.addChild( statisticsDisplayAccordionBox );
    this.addChild( galtonBoardNode );
    this.addChild( histogramNode );
    this.addChild( ballsLayer );
    this.addChild( pathsLayer );
    this.addChild( hopper );

    eraserButton.bottom = this.layoutBounds.maxY - 40;
    eraserButton.left = 40;
    histogramRadioButtonsControl.bottom = eraserButton.top - 10;
    histogramRadioButtonsControl.left = eraserButton.left;


    ballRadioButtonsControl.left = hopper.right + 20;
    ballRadioButtonsControl.top = hopper.top;
    playPanel.right = this.layoutBounds.maxX - 50;
    playPanel.top = 10;
    sliderControlPanel.top = playPanel.bottom + 10;
    sliderControlPanel.right = playPanel.right;
    statisticsDisplayAccordionBox.top = sliderControlPanel.bottom + 10;
    statisticsDisplayAccordionBox.right = playPanel.right;
    // galtonBoardNode.centerX=hopper.centerX;
    // altonBoardNode.top=board.top+20;

    //TODO: Delete when done with the layout
    ////////////////////////////////////////////////////////////////
    //Show the mock-up and a slider to change its transparency
    //////////////////////////////////////////////////////////////

    var mockup02OpacityProperty = new Property( 0.02 );

    var image02 = new Image( mockup02Image, { pickable: false } );

    image02.scale( this.layoutBounds.height / image02.height );

    mockup02OpacityProperty.linkAttribute( image02, 'opacity' );

    this.addChild( image02 );

    this.addChild( new HSlider( mockup02OpacityProperty, { min: 0, max: 1 }, { top: 100, left: 20 } ) );

    /////////////////////////////////////////////////////////////////////////
  }

  plinkoProbability.register( 'PlinkoProbabilityLabView', PlinkoProbabilityLabView );

  return inherit( ScreenView, PlinkoProbabilityLabView, {
    step: function( dt ) {
    }
  } );
} );
