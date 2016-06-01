// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' intro screen.
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var BallNode = require( 'PLINKO_PROBABILITY/common/view/BallNode' );
  var Board = require( 'PLINKO_PROBABILITY/common/view/Board' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var CylindersBackNode = require( 'PLINKO_PROBABILITY/intro/view/CylindersBackNode' );
  var CylindersFrontNode = require( 'PLINKO_PROBABILITY/intro/view/CylindersFrontNode' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );

  var GaltonBoardNode = require( 'PLINKO_PROBABILITY/common/view/GaltonBoardNode' );
  var HistogramNode = require( 'PLINKO_PROBABILITY/common/view/HistogramNode' );
  var Hopper = require( 'PLINKO_PROBABILITY/common/view/Hopper' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberBallsDisplay = require( 'PLINKO_PROBABILITY/intro/view/NumberBallsDisplay' );
  var IntroPlayPanel = require( 'PLINKO_PROBABILITY/intro/view/IntroPlayPanel' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var Vector2 = require( 'DOT/Vector2' );
  var VerticalRadioButtonGroup = require( 'PLINKO_PROBABILITY/intro/view/VerticalRadioButtonGroup' );

  /**
   * @param {PlinkoProbabilityIntroModel} model
   * @constructor
   */
  function PlinkoProbabilityIntroView( model ) {

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 1024, 618 ) } );

    var galtonBoardApexPosition = new Vector2( this.layoutBounds.maxX / 2 - 80, 70 );

    // create the hopper and the wooden Board
    var hopper = new Hopper();
    var board = new Board();

    hopper.centerX = galtonBoardApexPosition.x;
    hopper.top = 10;
    // TODO: find a way to take care of the shadow offset in a less ad hoc way
    board.centerX = hopper.centerX - (board.options.bottomWidth - board.width) / 2;
    board.top = hopper.bottom + 10;

    var viewGraphBounds = new Bounds2( board.left, board.top, board.left + board.options.bottomWidth, board.top + board.options.height );
    var modelGraphBounds = model.galtonBoard.bounds;
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelGraphBounds, viewGraphBounds );

    var viewProperties = new PropertySet( {
      histogramRadio: 'cylinder', // Valid values are 'number', 'cylinder'
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

    // create the galton board (including the pegs)
    var galtonBoardNode = new GaltonBoardNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, modelViewTransform, { openingAngle: 0.03 } );

    // create the view for the cylinders. The Back and Front node will be put on a different z-layer
    var cylindersBackNode = new CylindersBackNode( model.numberOfRowsProperty, model.bounds, modelViewTransform );
    var cylindersFrontNode = new CylindersFrontNode( model.numberOfRowsProperty, model.bounds, modelViewTransform );

    // create the histogram radio buttons at the left of the histogram/cylinders
    var histogramRadioButtonsControl = new VerticalRadioButtonGroup( viewProperties.histogramRadioProperty );

    // create the eraser button
    var eraserButton = new EraserButton( {
      iconWidth: 22,
      scale: 1.4,
      listener: function() {
        model.balls.clear();
        model.histogram.reset();
        model.launchedBallsNumber = 0;
        model.resetTimer();
      }
    } );

    // create play Panel
    var playPanel = new IntroPlayPanel( model, model.ballModeProperty );

    // create the number of balls display panel
    var numberBallsDisplay = new NumberBallsDisplay( model );

    // create the Reset All Button at the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        viewProperties.reset();
      }
    } );

    // Create the Sound Toggle Button at the bottom right
    var soundToggleButton = new SoundToggleButton( model.isSoundEnabledProperty );

    // link the histogram radio buttons (to the left of the histogram) to toggle the visibility of the histogram and cylinders
    viewProperties.histogramRadioProperty.link( function( histogramRadio ) {
        switch( histogramRadio ) {
          case 'number':
            histogramNode.visible = true;
            cylindersBackNode.visible = false;
            cylindersFrontNode.visible = false;
            break;
          case 'cylinder':
            histogramNode.visible = false;
            cylindersBackNode.visible = true;
            cylindersFrontNode.visible = true;
            break;
          default:
            throw new Error( 'Unhandled Button state: ' + histogramRadio );
        }
      }
    );

    // put all the BallNodes on a separate z-layer
    var ballsLayer = new Node( { layerSplit: true } );

    // handle the coming and going of the model Balls
    model.balls.addItemAddedListener( function( addedBall ) {
      // Create and add the view representation for this addedBall
      var addedBallNode = new BallNode( addedBall.positionProperty, addedBall.ballRadius, modelViewTransform );
      ballsLayer.addChild( addedBallNode );
      model.balls.addItemRemovedListener( function removalListener( removedBall ) {
        if ( removedBall === addedBall ) {
          addedBallNode.dispose();
          ballsLayer.removeChild( addedBallNode );
          model.balls.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // add children to the scene graph
    this.addChild( board );
    this.addChild( eraserButton );
    this.addChild( histogramRadioButtonsControl );
    this.addChild( soundToggleButton );
    this.addChild( resetAllButton );
    this.addChild( playPanel );
    this.addChild( numberBallsDisplay );
    this.addChild( galtonBoardNode );
    this.addChild( cylindersBackNode );
    this.addChild( ballsLayer );
    this.addChild( histogramNode );
    this.addChild( cylindersFrontNode );
    this.addChild( hopper );

    // layout the children nodes on the scenegraph
    eraserButton.bottom = this.layoutBounds.maxY - 55;
    eraserButton.left = 40;
    histogramRadioButtonsControl.bottom = eraserButton.top - 10;
    histogramRadioButtonsControl.left = eraserButton.left;
    playPanel.right = this.layoutBounds.maxX - 40;
    playPanel.top = 10;
    numberBallsDisplay.top = playPanel.bottom + 283;
    numberBallsDisplay.right = playPanel.right;
    resetAllButton.right = this.layoutBounds.maxX - 10;
    resetAllButton.bottom = this.layoutBounds.maxY - 10;
    soundToggleButton.right = resetAllButton.left - 20;
    soundToggleButton.centerY = resetAllButton.centerY;
  }

  plinkoProbability.register( 'PlinkoProbabilityIntroView', PlinkoProbabilityIntroView );

  return inherit( ScreenView, PlinkoProbabilityIntroView );
} );
