// Copyright 2014-2018, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 *
 * @author Martin Veillette (Berea College)
 * @author Guillermo Ramos (Berea College)
 * @author Denzell Barnett (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CylindersBackNode = require( 'PLINKO_PROBABILITY/intro/view/CylindersBackNode' );
  var CylindersFrontNode = require( 'PLINKO_PROBABILITY/intro/view/CylindersFrontNode' );
  var HistogramModeControl = require( 'PLINKO_PROBABILITY/common/view/HistogramModeControl' );
  var inherit = require( 'PHET_CORE/inherit' );
  var IntroPlayPanel = require( 'PLINKO_PROBABILITY/intro/view/IntroPlayPanel' );
  var NumberBallsDisplay = require( 'PLINKO_PROBABILITY/intro/view/NumberBallsDisplay' );
  var PegsNode = require( 'PLINKO_PROBABILITY/common/view/PegsNode' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityCommonView = require( 'PLINKO_PROBABILITY/common/view/PlinkoProbabilityCommonView' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );

  // images
  var counterImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var cylinderImage = require( 'image!PLINKO_PROBABILITY/cylinder.png' );

  // constants
  var MIN_PANEL_WIDTH = 220; // see #77

  /**
   * Creates view for intro tab
   * @param {IntroModel} model
   * @constructor
   */
  function IntroScreenView( model ) {

    var self = this;

    PlinkoProbabilityCommonView.call( this, model );

    // pegs on the Galton board
    var pegsNode = new PegsNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, this.modelViewTransform, {
      rotatePegs: false, // pegs do not rotate as probability changes, so they do not have a flat surface
      canvasBounds: this.viewTriangularBoardBounds
    } );

    // cylinders (bins) below the board
    var cylindersBackNode = new CylindersBackNode( model.numberOfRowsProperty, this.modelViewTransform, model.cylinderInfo );
    var cylindersFrontNode = new CylindersFrontNode( model.numberOfRowsProperty, this.modelViewTransform, model.cylinderInfo );

    // Histogram mode radio buttons, above the eraser button
    var histogramModeControl = new HistogramModeControl( this.viewProperties.histogramModeProperty, 'counter', counterImage, 'cylinder', cylinderImage, {
      bottom: this.eraserButton.top - 16,
      left: this.eraserButton.left
    } );

    // Play panel, at upper right
    var playPanel = new IntroPlayPanel( model, {
      minWidth: MIN_PANEL_WIDTH,
      right: this.layoutBounds.maxX - PlinkoProbabilityConstants.PANEL_RIGHT_PADDING,
      top: 10
    } );

    // Number of balls panel, at right, top aligned with cylinders
    var numberBallsDisplay = new NumberBallsDisplay( model.histogram, {
      minWidth: MIN_PANEL_WIDTH,
      top: 360, // hack to align with StatisticsAccordionBox in LabScreenView, see #77
      right: playPanel.right
    } );

    // rendering order
    this.addChild( playPanel );
    this.addChild( histogramModeControl );
    this.addChild( numberBallsDisplay );
    this.addChild( pegsNode );
    this.addChild( cylindersBackNode );
    this.moveChildToBack( cylindersBackNode );
    this.addChild( cylindersFrontNode );

    // link the histogram radio buttons to toggle the visibility of the histogram and cylinders
    // link is present fot the lifetime of the sim
    this.viewProperties.histogramModeProperty.link( function( histogramMode ) {
      self.ballsNode.invalidatePaint();
      switch( histogramMode ) {
        case 'counter':
          self.histogramNode.visible = true;
          cylindersBackNode.visible = false;
          cylindersFrontNode.visible = false;
          break;
        case 'cylinder':
          self.histogramNode.visible = false;
          cylindersBackNode.visible = true;
          cylindersFrontNode.visible = true;
          break;
        default:
          throw new Error( 'unsupported histogramMode: ' + histogramMode );
      }
    } );

    // handle the coming and going of the model Balls
    model.balls.addItemAddedListener( function( addedBall ) {
      
      // play sound when ball hits a peg
      var ballHittingPegListener = function( direction ) {
        self.pegSoundGeneration.playBallHittingPegSound( direction );
      };
      
      addedBall.ballHittingPegEmitter.addListener( ballHittingPegListener );
      
      model.balls.addItemRemovedListener( function removalListener( removedBall ) {
        if ( removedBall === addedBall ) {
          addedBall.ballHittingPegEmitter.removeListener( ballHittingPegListener );
          model.balls.removeItemRemovedListener( removalListener );
        }
      } );
    } );

    // a11y
    // set tab order
    this.playAreaNode.accessibleOrder = [ playPanel, histogramModeControl, this.eraserButton ];
  }

  plinkoProbability.register( 'IntroScreenView', IntroScreenView );

  return inherit( PlinkoProbabilityCommonView, IntroScreenView );
} );
