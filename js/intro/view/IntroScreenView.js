// Copyright 2014-2015, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 *
 * @author Martin Veillette (Berea College)
 * @author Guillermo Ramos (Berea College)
 * @author Denzell Barnett (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var CylindersBackNode = require( 'PLINKO_PROBABILITY/intro/view/CylindersBackNode' );
  var CylindersFrontNode = require( 'PLINKO_PROBABILITY/intro/view/CylindersFrontNode' );
  var GaltonBoardNode = require( 'PLINKO_PROBABILITY/common/view/GaltonBoardNode' );
  var HistogramModeControl = require( 'PLINKO_PROBABILITY/common/view/HistogramModeControl' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroPlayPanel = require( 'PLINKO_PROBABILITY/intro/view/IntroPlayPanel' );
  var NumberBallsDisplay = require( 'PLINKO_PROBABILITY/intro/view/NumberBallsDisplay' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityCommonView = require( 'PLINKO_PROBABILITY/common/view/PlinkoProbabilityCommonView' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );

  // images
  var counterImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var cylinderImage = require( 'image!PLINKO_PROBABILITY/cylinder.png' );

  /**
   * Creates view for intro tab
   * @param {IntroModel} model
   * @constructor
   */
  function IntroScreenView( model ) {

    PlinkoProbabilityCommonView.call( this, model );

    // create the galton board (including the pegs)
    var galtonBoardNode = new GaltonBoardNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, this.modelViewTransform, {
      openingAngle: 0.01,
      canvasBounds: this.viewTriangularBoardBounds
    } );

    this.galtonBoardNode = galtonBoardNode; // @protected required by supertype

    // create the view for the cylinders. The Back and Front node will be put on a different z-layer
    var cylindersBackNode = new CylindersBackNode( model.numberOfRowsProperty, this.modelViewTransform, model.cylinderInfo );
    var cylindersFrontNode = new CylindersFrontNode( model.numberOfRowsProperty, this.modelViewTransform, model.cylinderInfo );

    // create the histogram radio buttons at the left of the histogram/cylinders
    this.viewProperties.histogramModeProperty.set( 'cylinder' );
    var histogramModeControl = new HistogramModeControl( this.viewProperties.histogramModeProperty, 'counter', counterImage, 'cylinder', cylinderImage );

    // create play Panel
    var playPanel = new IntroPlayPanel( model.updateBallsToCreateNumber.bind( model ), model.ballModeProperty, model.isBallCapReachedProperty );

    // create the number of balls display panel
    var numberBallsDisplay = new NumberBallsDisplay( model.histogram );

    // link the histogram radio buttons (to the left of the histogram) to toggle the visibility of the histogram and cylinders
    // link is present fot the lifetime of the sim
    var thisModel = this;
    this.viewProperties.histogramModeProperty.link( function( histogramMode ) {
        switch( histogramMode ) {
          case 'counter':
            thisModel.histogramNode.visible = true;
            cylindersBackNode.visible = false;
            cylindersFrontNode.visible = false;
            break;
          case 'cylinder':
            thisModel.histogramNode.visible = false;
            cylindersBackNode.visible = true;
            cylindersFrontNode.visible = true;
            break;
          default:
            throw new Error( 'Unhandled Button state: ' + histogramMode );
        }
      }
    );

    // handle the coming and going of the model Balls
    model.balls.addItemAddedListener( function( addedBall ) {
      // initiates sound to play when ball hits a peg
      var ballHittingPegListener = function( direction ) {
        thisModel.pegSoundGeneration.playBallHittingPegSound( direction );
      };
      addedBall.ballHittingPegEmitter.addListener( ballHittingPegListener );
      model.balls.addItemRemovedListener( function removalListener( removedBall ) {
        if ( removedBall === addedBall ) {
          addedBall.ballHittingPegEmitter.removeListener( ballHittingPegListener );
          model.balls.removeItemRemovedListener( removalListener );

        }
      } );
    } );

    // add children to the scene graph
    this.addChild( histogramModeControl );
    this.addChild( playPanel );
    this.addChild( numberBallsDisplay );
    this.addChild( galtonBoardNode );
    this.addChild( cylindersBackNode );
    this.moveChildToBack( cylindersBackNode );
    this.addChild( cylindersFrontNode );

    // layout the children nodes on the scene graph
    histogramModeControl.bottom = this.histogramModeControlBottom;
    histogramModeControl.left = this.histogramModeControlLeft;
    playPanel.right = this.layoutBounds.maxX - PlinkoProbabilityConstants.PANEL_RIGHT_PADDING;
    playPanel.top = PlinkoProbabilityConstants.PANEL_VERTICAL_SPACING;
    numberBallsDisplay.top = playPanel.bottom + 245;
    numberBallsDisplay.right = playPanel.right;
  }

  plinkoProbability.register( 'IntroScreenView', IntroScreenView );

  return inherit( PlinkoProbabilityCommonView, IntroScreenView );
} );
