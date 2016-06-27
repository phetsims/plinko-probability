// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' lab screen.
 *
 * @author Martin Veillette (Berea College)
 * @author Guillermo Ramos (Berea College)
 * @author Denzell Barnett (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var BallsLayerNode = require( 'PLINKO_PROBABILITY/common/view/BallsLayerNode' );
  var BallRadioButtonsControl = require( 'PLINKO_PROBABILITY/lab/view/BallRadioButtonsControl' );
  var Board = require( 'PLINKO_PROBABILITY/common/view/Board' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Dialog = require( 'JOIST/Dialog' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var GaltonBoardCanvasNode = require( 'PLINKO_PROBABILITY/common/view/GaltonBoardCanvasNode' );
  var HistogramNode = require( 'PLINKO_PROBABILITY/common/view/HistogramNode' );
  var Hopper = require( 'PLINKO_PROBABILITY/common/view/Hopper' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabPlayPanel = require( 'PLINKO_PROBABILITY/lab/view/LabPlayPanel' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PegSoundGeneration = require( 'PLINKO_PROBABILITY/common/view/PegSoundGeneration' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PropertySet = require( 'AXON/PropertySet' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SliderControlPanel = require( 'PLINKO_PROBABILITY/lab/view/SliderControlPanel' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StatisticsDisplayAccordionBox = require( 'PLINKO_PROBABILITY/lab/view/StatisticsDisplayAccordionBox' );
  var TrajectoryPath = require( 'PLINKO_PROBABILITY/lab/view/TrajectoryPath' );
  var VerticalRadioButtonCommon = require( 'PLINKO_PROBABILITY/common/view/VerticalRadioButtonCommon' );

  // images
  var counterDOMImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var fractionDOMImage = require( 'image!PLINKO_PROBABILITY/fraction.png' );

  // strings
  var outOfBallsString = require( 'string!PLINKO_PROBABILITY/outOfBalls' );

  /**
   * @param {PlinkoProbabilityLabModel} model
   * @constructor
   */
  function PlinkoProbabilityLabView( model ) {

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 1024, 618 ) } );

    // create the hopper and the Galton Board
    var hopper = new Hopper();
    var board = new Board();

    // hopper and Galton Board positioning
    hopper.centerX = this.layoutBounds.maxX / 2 - 80;
    hopper.top = 10;
    board.left = hopper.centerX - board.options.bottomWidth / 2;
    board.top = hopper.bottom + 10;

    // create the model view transform based on the triangular board of the galton board (excluding the dropped shadow)
    var viewTriangularBoardBounds = new Bounds2( board.left, board.top, board.left + board.options.bottomWidth, board.top + board.options.height );
    var modelTriangularBoardBounds = model.galtonBoard.bounds;
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelTriangularBoardBounds, viewTriangularBoardBounds );

    var viewProperties = new PropertySet( {
      histogramRadio: 'counter', // Valid values are 'fraction', 'counter'
      ballRadio: 'oneBall', // Valid values are 'oneBall' and 'continuous'.
      expandedAccordionBox: false, // accordion box responsible for the statistics display
      isTheoreticalHistogramVisible: false, // property attached to the "ideal" checkbox in the statistical accordion box
      isSoundEnabled: false
    } );

    // create the histogram node, a bar chart, at the bottom of the Galton board
    var histogramNode = new HistogramNode(
      viewProperties.histogramRadioProperty,
      model,
      modelViewTransform,
      viewProperties.isTheoreticalHistogramVisibleProperty
    );

    // create the sound generator for ball hitting peg
    var pegSoundGeneration = new PegSoundGeneration( viewProperties.isSoundEnabledProperty );
    this.pegSoundGeneration = pegSoundGeneration;

    // create the Galton board, including the pegs and dropped shadows
    var galtonBoardCanvasNode = new GaltonBoardCanvasNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, modelViewTransform, { canvasBounds: viewTriangularBoardBounds } );
    // create three radio buttons next to the hopper

    var ballRadioButtonsControl = new BallRadioButtonsControl( model.galtonBoardRadioButtonProperty );

    // create the two radio buttons that can toggle between 'fraction and 'counter' mode
    var histogramRadioButtonsControl = new VerticalRadioButtonCommon( viewProperties.histogramRadioProperty, counterDOMImage, fractionDOMImage, 'counter', 'fraction', {
      buttonContentYMargin: 13
    } );

    // create the eraser button
    var eraserButton = new EraserButton( {
      iconWidth: 22,
      scale: 1.4,
      listener: function() {
        model.histogram.reset();
        model.balls.clear();
        model.isBallCapReachedProperty.value = false;
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
        model.reset();  // reset the model
        viewProperties.reset(); // reset the properties
        pegSoundGeneration.reset(); // reset the time elapsed to 0

      }
    } );

    // Create the Sound Toggle Button at the bottom right
    var soundToggleButton = new SoundToggleButton( viewProperties.isSoundEnabledProperty );

    var ballCanvasBounds= viewTriangularBoardBounds.dilated( 20 ); // bounds are slightly larger than the galton board itself
    // create the ballLayerNodes  (a canvas Node) that renders all the balls
    var ballsLayerNode = new BallsLayerNode( model.balls, modelViewTransform, model.numberOfRowsProperty, viewProperties.histogramRadioProperty, model.galtonBoardRadioButtonProperty,
      { canvasBounds: ballCanvasBounds } );
    this.ballsLayerNode = ballsLayerNode;

    // create pathsLayer to keep all the TrajectoryPath
    var pathsLayer = new Node( { layerSplit: true } );


    // handle the coming and going of the balls in the model.
    model.balls.addItemAddedListener( function( addedBall ) {
      switch( model.galtonBoardRadioButtonProperty.value ) {
        case 'ball':
          // initiates sound to play when ball hits a peg
          addedBall.on( 'playSound', function( direction ) {
            pegSoundGeneration.playBallHittingPegSound( direction );
          } );
          model.balls.addItemRemovedListener( function removalListener( removedBall ) {
            if ( removedBall === addedBall ) {
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
    this.addChild( galtonBoardCanvasNode );
    this.addChild( new Node( { layerSplit: true } ) );
    this.addChild( ballsLayerNode );
    this.addChild( histogramNode );
    this.addChild( pathsLayer );
    this.addChild( hopper );


    // laying out the nodes
    eraserButton.bottom = this.layoutBounds.maxY - 55;    // eraser button position determines histogram radio buttons position
    eraserButton.left = 40;
    histogramRadioButtonsControl.bottom = eraserButton.top - 16;
    histogramRadioButtonsControl.left = eraserButton.left;
    ballRadioButtonsControl.left = hopper.right + 47;     // dependent on hopper position
    ballRadioButtonsControl.top = hopper.top;
    playPanel.right = this.layoutBounds.maxX - 50;        // determines slider control panel and statistical display position
    playPanel.top = 10;
    sliderControlPanel.top = playPanel.bottom + 10;
    sliderControlPanel.right = playPanel.right;
    statisticsDisplayAccordionBox.top = sliderControlPanel.bottom + 10;
    statisticsDisplayAccordionBox.right = playPanel.right;
    resetAllButton.right = this.layoutBounds.maxX - 10;   // determines sound toggle position
    resetAllButton.bottom = this.layoutBounds.maxY - 10;
    soundToggleButton.right = resetAllButton.left - 20;
    soundToggleButton.centerY = resetAllButton.centerY;

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
        // it is not playing anymore
        model.isPlayingProperty.set( false );
      }
    } );

  }

  plinkoProbability.register( 'PlinkoProbabilityLabView', PlinkoProbabilityLabView );

  return inherit( ScreenView, PlinkoProbabilityLabView, {
    /**
     * Repaints canvas for balls at every frame and steps through the pegSoundGenerator
     * @param {number} dt
     */
    step: function( dt ) {

      // update view of the balls
      this.ballsLayerNode.invalidatePaint();

      // increment time for sound generation
      this.pegSoundGeneration.step( dt );
    }

  } );
} );
