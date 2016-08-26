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
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroPlayPanel = require( 'PLINKO_PROBABILITY/intro/view/IntroPlayPanel' );
  var NumberBallsDisplay = require( 'PLINKO_PROBABILITY/intro/view/NumberBallsDisplay' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityCommonView = require( 'PLINKO_PROBABILITY/common/view/PlinkoProbabilityCommonView' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var VerticalRadioButtonCommon = require( 'PLINKO_PROBABILITY/common/view/VerticalRadioButtonCommon' );

  // images
  var counterDOMImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var containerDOMImage = require( 'image!PLINKO_PROBABILITY/container.png' );

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
    this.viewProperties.histogramRadioProperty.set( 'cylinder' );
    var histogramRadioButtonsControl = new VerticalRadioButtonCommon( this.viewProperties.histogramRadioProperty, counterDOMImage, containerDOMImage, 'counter', 'cylinder' );

    // create play Panel
    var playPanel = new IntroPlayPanel( model.updateBallsToCreateNumber.bind( model ), model.ballModeProperty, model.isBallCapReachedProperty );

    // create the number of balls display panel
    var numberBallsDisplay = new NumberBallsDisplay( model.histogram );

    // link the histogram radio buttons (to the left of the histogram) to toggle the visibility of the histogram and cylinders
    // link is present fot the lifetime of the sim
    var thisModel = this;
    this.viewProperties.histogramRadioProperty.link( function( histogramRadio ) {
        switch( histogramRadio ) {
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
            throw new Error( 'Unhandled Button state: ' + histogramRadio );
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
    this.addChild( histogramRadioButtonsControl );
    this.addChild( playPanel );
    this.addChild( numberBallsDisplay );
    this.addChild( galtonBoardNode );
    this.addChild( cylindersBackNode );
    this.moveChildToBack( cylindersBackNode );
    this.addChild( cylindersFrontNode );

    // layout the children nodes on the scene graph
    histogramRadioButtonsControl.bottom = this.histogramRadioButtonsControlBottom;
    histogramRadioButtonsControl.left = this.histogramRadioButtonsControlLeft;
    playPanel.right = this.layoutBounds.maxX - PlinkoConstants.PANEL_RIGHT_PADDING;
    playPanel.top = PlinkoConstants.PANEL_VERTICAL_SPACING;
    numberBallsDisplay.top = playPanel.bottom + 245;
    numberBallsDisplay.right = playPanel.right;
  }

  plinkoProbability.register( 'IntroScreenView', IntroScreenView );

  return inherit( PlinkoProbabilityCommonView, IntroScreenView );
} );
