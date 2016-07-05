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
  function PlinkoProbabilityCommonView( model ) {

    ScreenView.call( this, { layoutBounds: new Bounds2( 0, 0, 1024, 618 ) } );

    // create the hopper and the wooden Board
    var hopper = new Hopper();
    var board = new Board();

    // layout the hopper and the board
    hopper.centerX = this.layoutBounds.maxX / 2 - 80;
    hopper.top = 10;
    board.left = hopper.centerX - board.options.bottomWidth / 2;
    board.top = hopper.bottom + 10;

    // @protected
    // needed to layout the position of the ball radio buttons in the lab tab
    this.hopperRight = hopper.right;

    // create the model view transform based on the triangular board of the galton board (excluding the dropped shadow)
    var viewTriangularBoardBounds = new Bounds2( board.left, board.top, board.left + board.options.bottomWidth, board.top + board.options.height );
    var modelTriangularBoardBounds = model.galtonBoard.bounds;
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelTriangularBoardBounds, viewTriangularBoardBounds );

    // @protected
    this.viewTriangularBoardBounds = viewTriangularBoardBounds;
    this.modelViewTransform = modelViewTransform;

    var viewProperties = new PropertySet( {
      histogramRadio: 'cylinder', // Valid values are 'counter', 'cylinder' to be determined by the view of each tab
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
    this.histogramNode = histogramNode;

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


    // add children to the scene graph
    this.addChild( board );
    this.addChild( eraserButton );
    this.addChild( soundToggleButton );
    this.addChild( resetAllButton );
    this.addChild( histogramNode );
    this.addChild( hopper );

    // layout the children nodes on the scene graph
    eraserButton.bottom = this.layoutBounds.maxY - 55;
    eraserButton.left = 40;

    // needed to layout the radioButtons of each tab
    this.histogramRadioButtonsControlBottom = eraserButton.top - 16;
    this.histogramRadioButtonsControlLeft= eraserButton.left;
    resetAllButton.right = this.layoutBounds.maxX - 10;
    resetAllButton.bottom = this.layoutBounds.maxY - 10;
    soundToggleButton.right = resetAllButton.left - 20;
    soundToggleButton.centerY = resetAllButton.centerY;
  }

  plinkoProbability.register( 'PlinkoProbabilityCommonView', PlinkoProbabilityCommonView );

  return inherit( ScreenView, PlinkoProbabilityCommonView, {
    step: function( dt ) {
      // Checks if the galtonBoard has been initially painted and if not then paint it.
      if ( !this.galtonBoardCanvasNode.isInitiallyPainted ) {
        this.galtonBoardCanvasNode.invalidatePaint();
      }
      // update view on model step
      this.ballsLayerNode.invalidatePaint();

      // increment time for sound generation
      this.pegSoundGeneration.step( dt );
    }
  } );

} );