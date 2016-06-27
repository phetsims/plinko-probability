// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' intro screen.
 *
 * @author Martin Veillette (Berea College)
 * @author Guillermo Ramos (Berea College)
 * @author Denzell Barnett (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var BallsLayerNode = require( 'PLINKO_PROBABILITY/common/view/BallsLayerNode' );
  var Board = require( 'PLINKO_PROBABILITY/common/view/Board' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var CylindersBackNode = require( 'PLINKO_PROBABILITY/intro/view/CylindersBackNode' );
  var CylindersFrontNode = require( 'PLINKO_PROBABILITY/intro/view/CylindersFrontNode' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var GaltonBoardCanvasNode = require( 'PLINKO_PROBABILITY/common/view/GaltonBoardCanvasNode' );
  var HistogramNode = require( 'PLINKO_PROBABILITY/common/view/HistogramNode' );
  var Hopper = require( 'PLINKO_PROBABILITY/common/view/Hopper' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroPlayPanel = require( 'PLINKO_PROBABILITY/intro/view/IntroPlayPanel' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var NumberBallsDisplay = require( 'PLINKO_PROBABILITY/intro/view/NumberBallsDisplay' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PegSoundGeneration = require( 'PLINKO_PROBABILITY/common/view/PegSoundGeneration' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var VerticalRadioButtonCommon = require( 'PLINKO_PROBABILITY/common/view/VerticalRadioButtonCommon' );

  // images
  var counterDOMImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var containerDOMImage = require( 'image!PLINKO_PROBABILITY/container.png' );

  /**
   * Creates view for intro tab
   * @param {PlinkoProbabilityIntroModel} model
   * @constructor
   */
  function PlinkoProbabilityIntroView( model ) {

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 1024, 618 ) } );

    // create the hopper and the wooden Board
    var hopper = new Hopper();
    var board = new Board();

    // layout the hopper and the board
    hopper.centerX = this.layoutBounds.maxX / 2 - 80;
    hopper.top = 10;
    board.left = hopper.centerX - board.options.bottomWidth / 2;
    board.top = hopper.bottom + 10;

    // create the model view transform based on the triangular board of the galton board (excluding the dropped shadow)
    var viewTriangularBoardBounds = new Bounds2( board.left, board.top, board.left + board.options.bottomWidth, board.top + board.options.height );
    var modelTriangularBoardBounds = model.galtonBoard.bounds;
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelTriangularBoardBounds, viewTriangularBoardBounds );

    var viewProperties = new PropertySet( {
      histogramRadio: 'cylinder', // Valid values are 'counter', 'cylinder'
      ballRadio: 'oneBall', // Valid values are 'oneBall', 'tenBalls' and 'allBalls'.
      expandedAccordionBox: false,
      isTheoreticalHistogramVisible: false,
      isSoundEnabled: false
    } );

    this.viewProperties = viewProperties; // @private

    var histogramNode = new HistogramNode(
      viewProperties.histogramRadioProperty,
      model,
      modelViewTransform,
      viewProperties.isTheoreticalHistogramVisibleProperty
    );

    // create the galton board (including the pegs)
    var galtonBoardCanvasNode = new GaltonBoardCanvasNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, modelViewTransform, {
      openingAngle: 0.01,
      canvasBounds: viewTriangularBoardBounds
    } );

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
        model.isBallCapReachedProperty.set( false );
      }
    } );

    // create the sound generator for ball hitting peg
    var pegSoundGeneration = new PegSoundGeneration( viewProperties.isSoundEnabledProperty );
    this.pegSoundGeneration = pegSoundGeneration;

    // create play Panel
    var playPanel = new IntroPlayPanel( model.updateBallsToCreateNumber.bind( model ), model.ballModeProperty, model.isBallCapReachedProperty );

    // create the number of balls display panel
    var numberBallsDisplay = new NumberBallsDisplay( model.histogram );

    // create the Reset All Button at the bottom right, which resets the model
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset(); // reset the model
        viewProperties.reset(); // reset the properties
        pegSoundGeneration.reset(); // reset the time elapsed to 0
      }
    } );

    // create the Sound Toggle Button at the bottom right
    var soundToggleButton = new SoundToggleButton( viewProperties.isSoundEnabledProperty );

    // link the histogram radio buttons (to the left of the histogram) to toggle the visibility of the histogram and cylinders
    // link is present fot the lifetime of the sim
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

    // 
    var histogramModelBounds = PlinkoConstants.HISTOGRAM_BOUNDS;
    var ballModelBounds = model.galtonBoard.bounds.union( histogramModelBounds );
    var ballViewBounds = modelViewTransform.modelToViewBounds( ballModelBounds ).dilated( 20 );

    // put all the Balls on a separate z-layer
    var ballsLayerNode = new BallsLayerNode( model.balls, modelViewTransform, model.numberOfRowsProperty, viewProperties.histogramRadioProperty, new Property( 'ball' ),
      { canvasBounds: ballViewBounds } );
    this.ballsLayerNode = ballsLayerNode;

    // handle the coming and going of the model Balls
    model.balls.addItemAddedListener( function( addedBall ) {
      // initiates sound to play when ball hits a peg
      addedBall.on( 'playSound', function( direction ) {
        pegSoundGeneration.playBallHittingPegSound( direction );
      } );
      model.balls.addItemRemovedListener( function removalListener( removedBall ) {
        if ( removedBall === addedBall ) {
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
    this.addChild( galtonBoardCanvasNode );
    this.addChild( cylindersBackNode );
    this.addChild( ballsLayerNode );
    this.addChild( histogramNode );
    this.addChild( cylindersFrontNode );
    this.addChild( hopper );

    // layout the children nodes on the scene graph
    eraserButton.bottom = this.layoutBounds.maxY - 55;
    eraserButton.left = 40;
    histogramRadioButtonsControl.bottom = eraserButton.top - 16;
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

  return inherit( ScreenView, PlinkoProbabilityIntroView, {
    step: function( dt ) {
      // update view on model step
      this.ballsLayerNode.invalidatePaint();

      // increment time for sound generation
      this.pegSoundGeneration.step( dt );

    }
  } );

} );
