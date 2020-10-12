// Copyright 2014-2020, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 *
 * @author Martin Veillette (Berea College)
 * @author Guillermo Ramos (Berea College)
 * @author Denzell Barnett (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import counterImage from '../../../images/counter_png.js';
import cylinderImage from '../../../images/cylinder_png.js';
import PlinkoProbabilityConstants from '../../common/PlinkoProbabilityConstants.js';
import HistogramModeControl from '../../common/view/HistogramModeControl.js';
import PegsNode from '../../common/view/PegsNode.js';
import PlinkoProbabilityCommonView from '../../common/view/PlinkoProbabilityCommonView.js';
import plinkoProbability from '../../plinkoProbability.js';
import CylindersBackNode from './CylindersBackNode.js';
import CylindersFrontNode from './CylindersFrontNode.js';
import IntroPlayPanel from './IntroPlayPanel.js';
import NumberBallsDisplay from './NumberBallsDisplay.js';

// constants
const MIN_PANEL_WIDTH = 220; // see #77

class IntroScreenView extends PlinkoProbabilityCommonView {

  /**
   * Creates view for intro tab
   * @param {IntroModel} model
   */
  constructor( model ) {

    super( model );
    const self = this;

    // pegs on the Galton board
    const pegsNode = new PegsNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, this.modelViewTransform, {
      rotatePegs: false, // pegs do not rotate as probability changes, so they do not have a flat surface
      canvasBounds: this.viewTriangularBoardBounds
    } );

    // cylinders (bins) below the board
    const cylindersBackNode = new CylindersBackNode( model.numberOfRowsProperty, this.modelViewTransform, model.cylinderInfo );
    const cylindersFrontNode = new CylindersFrontNode( model.numberOfRowsProperty, this.modelViewTransform, model.cylinderInfo );

    // Histogram mode radio buttons, above the eraser button
    const histogramModeControl = new HistogramModeControl( this.viewProperties.histogramModeProperty, 'counter', counterImage, 'cylinder', cylinderImage, {
      bottom: this.eraserButton.top - 16,
      left: this.eraserButton.left
    } );

    // Play panel, at upper right
    const playPanel = new IntroPlayPanel( model, {
      minWidth: MIN_PANEL_WIDTH,
      right: this.layoutBounds.maxX - PlinkoProbabilityConstants.PANEL_RIGHT_PADDING,
      top: 10
    } );

    // Number of balls panel, at right, top aligned with cylinders
    const numberBallsDisplay = new NumberBallsDisplay( model.histogram, {
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
      const ballHittingPegListener = function( direction ) {
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

    // pdom
    // set tab order
    this.pdomPlayAreaNode.accessibleOrder = [ playPanel, histogramModeControl, this.eraserButton ];
  }
}

plinkoProbability.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;