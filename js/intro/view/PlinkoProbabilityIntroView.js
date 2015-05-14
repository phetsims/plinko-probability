// Copyright 2002-2015, University of Colorado Boulder

/**
 * View for the 'Plinko Probability' intro screen.
 */
define( function( require ) {
  'use strict';

  // modules
  var BallNode = require( 'PLINKO_PROBABILITY/common/view/BallNode' );
  var Board = require( 'PLINKO_PROBABILITY/common/view/Board' );
  var Bounds2 = require( 'DOT/Bounds2' );
  //var DerivedProperty = require( 'AXON/DerivedProperty' );
  //var Color = require( 'SCENERY/util/Color' );
  var CylindersBackNode = require( 'PLINKO_PROBABILITY/intro/view/CylindersBackNode' );
  var CylindersFrontNode = require( 'PLINKO_PROBABILITY/intro/view/CylindersFrontNode' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );

  var GaltonBoardNode = require( 'PLINKO_PROBABILITY/common/view/GaltonBoardNode' );
  var HistogramNode = require( 'PLINKO_PROBABILITY/common/view/HistogramNode' );
  var Hopper = require( 'PLINKO_PROBABILITY/common/view/Hopper' );
  var HSlider = require( 'SUN/HSlider' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlayPanel = require( 'PLINKO_PROBABILITY/intro/view/PlayPanel' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Property = require( 'AXON/Property' );
  //var Range = require( 'DOT/Range' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var StatisticsDisplayAccordionBox = require( 'PLINKO_PROBABILITY/common/view/StatisticsDisplayAccordionBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var VerticalRadioButtonGroup = require( 'PLINKO_PROBABILITY/intro/view/VerticalRadioButtonGroup' );

  // strings
  // TODO: place used strings here

  // images
  var mockup01Image = require( 'image!PLINKO_PROBABILITY/mockupCropped01.png' );

  /**
   * @param {PlinkoProbabilityIntroModel} model
   * @constructor
   */
  function PlinkoProbabilityIntroView( model ) {

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
      histogramRadio: 'number', // Valid values are 'number', 'cylinder'
      ballRadio: 'oneBall', // Valid values are 'oneBall' and 'continuous'.
      expandedAccordionBox: false,
      isSoundEnabled: false,
      isTheoreticalHistogramVisible: false
    } );

    var histogramNode = new HistogramNode(
      model.numberOfRowsProperty,
      viewProperties.histogramRadioProperty,
      model,
      modelViewTransform,
      viewProperties.isTheoreticalHistogramVisibleProperty
    );

    var galtonBoardNode = new GaltonBoardNode( model, modelViewTransform, { openingAngle: 0.03 } );

    var minY = -1.70;
    var bounds = new Bounds2( -1 / 2, minY, 1 / 2, -1 );

    var cylindersBackNode = new CylindersBackNode( model.numberOfRowsProperty, bounds, modelViewTransform );
    var cylindersFrontNode = new CylindersFrontNode( model.numberOfRowsProperty, bounds, modelViewTransform );


    viewProperties.ballRadioProperty.link( function( value ) {
      //do stuff
    } );

    var histogramRadioButtonsControl = new VerticalRadioButtonGroup( viewProperties.histogramRadioProperty );

    // Add the eraser button that allows the
    var eraserButton = new EraserButton( {
      scale: 1.4,
      listener: function() {
        model.histogram.reset();
        model.balls.clear();
      }
    } );

    // create play Panel
    var playPanel = new PlayPanel( model.isPlayingProperty, model.ballModeProperty );


    // create Panel that displays sample and theoretical statistics
    var statisticsDisplayAccordionBox = new StatisticsDisplayAccordionBox(
      model,
      viewProperties.isTheoreticalHistogramVisibleProperty,
      viewProperties.expandedAccordionBoxProperty );

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
    var soundToggleButton = new SoundToggleButton( viewProperties.isSoundEnabledProperty, {
      right: resetAllButton.left - 20,
      centerY: resetAllButton.centerY
    } );

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


    // Handle the comings and goings of balls
    var ballsLayer = new Node( { layerSplit: true } );

    model.balls.addItemAddedListener( function( addedBall ) {
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
    // Create and add the view representation for this dataBall.

    this.addChild( board );
    this.addChild( eraserButton );
    this.addChild( histogramRadioButtonsControl );
    this.addChild( soundToggleButton );
    this.addChild( resetAllButton );
    this.addChild( playPanel );
    this.addChild( statisticsDisplayAccordionBox );
    this.addChild( galtonBoardNode );
    this.addChild( histogramNode );
    this.addChild( cylindersBackNode );
    this.addChild( ballsLayer );
    this.addChild( cylindersFrontNode );
    this.addChild( hopper );

    eraserButton.bottom = this.layoutBounds.maxY - 40;
    eraserButton.left = 40;
    histogramRadioButtonsControl.bottom = eraserButton.top - 10;
    histogramRadioButtonsControl.left = eraserButton.left;


    playPanel.right = this.layoutBounds.maxX - 40;
    playPanel.top = 10;

    statisticsDisplayAccordionBox.top = playPanel.bottom + 150;
    statisticsDisplayAccordionBox.right = playPanel.right;
    // galtonBoardNode.centerX=hopper.centerX;
    // altonBoardNode.top=board.top+20;

    //TODO: Delete when done with the layout
    ////////////////////////////////////////////////////////////////
    //Show the mock-up and a slider to change its transparency
    //////////////////////////////////////////////////////////////

    var mockup02OpacityProperty = new Property( 0.02 );

    var image02 = new Image( mockup01Image, { pickable: false } );

    image02.scale( this.layoutBounds.height / image02.height );

    mockup02OpacityProperty.linkAttribute( image02, 'opacity' );

    this.addChild( image02 );

    this.addChild( new HSlider( mockup02OpacityProperty, { min: 0, max: 1 }, { top: 100, left: 20 } ) );

    /////////////////////////////////////////////////////////////////////////
  }

  return inherit( ScreenView, PlinkoProbabilityIntroView, {
    step: function( dt ) {
    }
  } );
} );
