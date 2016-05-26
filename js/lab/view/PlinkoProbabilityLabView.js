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
  var Dialog = require( 'JOIST/Dialog' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var GaltonBoardNode = require( 'PLINKO_PROBABILITY/common/view/GaltonBoardNode' );
  var HistogramNode = require( 'PLINKO_PROBABILITY/common/view/HistogramNode' );
  var HistogramRadioButtonsControl = require( 'PLINKO_PROBABILITY/lab/view/HistogramRadioButtonsControl' );
  var Hopper = require( 'PLINKO_PROBABILITY/common/view/Hopper' );
  var HSlider = require( 'SUN/HSlider' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabPlayPanel = require( 'PLINKO_PROBABILITY/lab/view/LabPlayPanel' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
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
  var outOfBallsString = require( 'string!PLINKO_PROBABILITY/outOfBalls' );

  // images
  var mockup02Image = require( 'image!PLINKO_PROBABILITY/mockupCropped02.png' );

  /**
   * @param {PlinkoProbabilityLabModel} model
   * @constructor
   */
  function PlinkoProbabilityLabView( model ) {

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 1024, 618 ) } );

    var galtonBoardApexPosition = new Vector2( this.layoutBounds.maxX / 2 - 80, 70 );

    // create the hopper and the wooden Board
    var hopper = new Hopper();
    var board = new Board();

    hopper.centerX = galtonBoardApexPosition.x;
    hopper.top = 10;
    board.centerX = hopper.centerX - (board.options.bottomWidth - board.width) / 2;
    board.top = hopper.bottom + 10;

    var viewGraphBounds = new Bounds2( board.left, board.top, board.left + board.options.bottomWidth, board.top + board.options.height );
    var modelGraphBounds = model.galtonBoard.bounds;
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelGraphBounds, viewGraphBounds );

    var viewProperties = new PropertySet( {
      histogramRadio: 'number', // Valid values are 'fraction', 'number'
      ballRadio: 'oneBall', // Valid values are 'oneBall' and 'continuous'.
      expandedAccordionBox: false, // accordion box responsible for the statistics display
      isTheoreticalHistogramVisible: false // property attached to the "ideal" checkbox in the statistical accordion box
    } );

    // create the histogram node, a bar chart, at the bottom of the Galton board
    var histogramNode = new HistogramNode(
      model.numberOfRowsProperty,
      viewProperties.histogramRadioProperty,
      model,
      modelViewTransform,
      viewProperties.isTheoreticalHistogramVisibleProperty
    );

    // create the Galton board, including the pegs and dropped shadows
    var galtonBoardNode = new GaltonBoardNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, modelViewTransform );

    // create three radio buttons next to the hopper
    var ballRadioButtonsControl = new BallRadioButtonsControl( model.galtonBoardRadioButtonProperty );

    // create the two radio buttons that can toogle between 'fraction and 'number' mode
    var histogramRadioButtonsControl = new HistogramRadioButtonsControl( viewProperties.histogramRadioProperty );

    // create the eraser button
    var eraserButton = new EraserButton( {
      iconWidth: 22,
      scale: 1.4,
      listener: function() {
        model.histogram.reset();
        model.balls.clear();
        model.isBallCapReachedProperty.value = false;
        removePathLayerChildren();
      }
    } );

    // create an accordion box that displays sample and theoretical statistics related to the histogram
    var statisticsDisplayAccordionBox = new StatisticsDisplayAccordionBox(
      model,
      viewProperties.isTheoreticalHistogramVisibleProperty,
      viewProperties.expandedAccordionBoxProperty );

    // create play Panel
    var playPanel = new LabPlayPanel( model, model.ballModeProperty, { minWidth: statisticsDisplayAccordionBox.width } );

    // create slider panel that can modify properties of the galton board (number of rows and the binary probability)
    var sliderControlPanel = new SliderControlPanel( model.numberOfRowsProperty, model.probabilityProperty, { minWidth: statisticsDisplayAccordionBox.width } );

    // create the Reset All Button in the bottom right, which resets the model and view properties
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        viewProperties.reset();
        removePathLayerChildren();
      }
    } );

    // Create the Sound Toggle Button at the bottom right
    var soundToggleButton = new SoundToggleButton( model.isSoundEnabledProperty );

    // Handle the comings and goings of balls
    var ballsLayer = new Node( { layerSplit: true } );
    // Handle the comings and goings of paths
    var pathsLayer = new Node( { layerSplit: true } );


    model.balls.addItemAddedListener( function( addedBall ) {

      // remove the previous path trajectory when adding a model.ball
      removePathLayerChildren();

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

    // adding children to the scene graph
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
    this.addChild( ballsLayer );
    this.addChild( histogramNode );
    this.addChild( pathsLayer );
    this.addChild( hopper );


    // laying out the nodes
    eraserButton.bottom = this.layoutBounds.maxY - 55;
    eraserButton.left = 40;
    histogramRadioButtonsControl.bottom = eraserButton.top - 16;
    histogramRadioButtonsControl.left = eraserButton.left;
    ballRadioButtonsControl.left = hopper.right + 47;
    ballRadioButtonsControl.top = hopper.top;
    playPanel.right = this.layoutBounds.maxX - 50;
    playPanel.top = 10;
    sliderControlPanel.top = playPanel.bottom + 10;
    sliderControlPanel.right = playPanel.right;
    statisticsDisplayAccordionBox.top = sliderControlPanel.bottom + 10;
    statisticsDisplayAccordionBox.right = playPanel.right;
    resetAllButton.right = this.layoutBounds.maxX - 10;
    resetAllButton.bottom = this.layoutBounds.maxY - 10;
    soundToggleButton.right = resetAllButton.left - 20;
    soundToggleButton.centerY = resetAllButton.centerY;

    /**
     * Removes all the trajectory Paths on the screen
     */
    var removePathLayerChildren = function() {
      if ( pathsLayer.hasChildren() ) {
        pathsLayer.removeAllChildren();
      }
    };

    // no need to dispose of this link since it is present for  the lifetime of the sim
    model.numberOfRowsProperty.link( removePathLayerChildren );

    // no need to dispose of this link
    model.isBallCapReachedProperty.lazyLink( function( isBallCapReached ) {
      // pops up a dialog box when the number of balls is reached.
      if ( isBallCapReached ) {
        new Dialog( new MultiLineText( outOfBallsString, { font: new PhetFont( 50 ) } ), {
          modal: true,
          // focusable so it can be dismissed
          focusable: true
        } ).show();
        // sets the play button to active.
        playPanel.setPlayButtonVisible();
      }
    } );


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
} )
;
