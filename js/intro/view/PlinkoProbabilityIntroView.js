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
  var VerticalRadioButtonCommon = require( 'PLINKO_PROBABILITY/common/view/VerticalRadioButtonCommon' );

  // images
  var counterDOMImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var containerDOMImage = require( 'image!PLINKO_PROBABILITY/container.png' );

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
      histogramRadio: 'cylinder', // Valid values are 'counter', 'cylinder'
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
    var cylindersBackNode = new CylindersBackNode( model.numberOfRowsProperty, modelViewTransform, model.cylinderInfo );
    var cylindersFrontNode = new CylindersFrontNode( model.numberOfRowsProperty, modelViewTransform, model.cylinderInfo );

    // create the histogram radio buttons at the left of the histogram/cylinders
    var histogramRadioButtonsControl = new VerticalRadioButtonCommon( viewProperties.histogramRadioProperty, counterDOMImage, containerDOMImage, 'counter', 'cylinder' );

    // create the eraser button
    var eraserButton = new EraserButton( {
      iconWidth: 22,
      scale: 1.4,
      listener: function() {
        model.balls.clear(); // clear the balls on the galton board
        model.histogram.reset(); // reset the histogram statistics
        model.launchedBallsNumber = 0; // reset the number of launched balls
        model.ballsToCreateNumber = 0; // reset the ball creation queue
      }
    } );

    // create play Panel
    var playPanel = new IntroPlayPanel( model.play.bind( model ), model.ballModeProperty );

    // create the number of balls display panel
    var numberBallsDisplay = new NumberBallsDisplay( model.histogram );

    // create the Reset All Button at the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset(); // reset the model
        viewProperties.reset(); // reset the properties
      }
    } );

    // Create the Sound Toggle Button at the bottom right
    var soundToggleButton = new SoundToggleButton( model.isSoundEnabledProperty );

    // link the histogram radio buttons (to the left of the histogram) to toggle the visibility of the histogram and cylinders
    viewProperties.histogramRadioProperty.link( function( histogramRadio ) {
        switch( histogramRadio ) {
          case 'counter':
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

    // layout the children nodes on the scene graph
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
