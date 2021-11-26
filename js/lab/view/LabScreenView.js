// Copyright 2014-2021, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen
 *
 * @author Martin Veillette (Berea College)
 * @author Guillermo Ramos (Berea College)
 * @author Denzell Barnett (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node } from '../../../../scenery/js/imports.js';
import counterImage from '../../../images/counter_png.js';
import fractionImage from '../../../images/fraction_png.js';
import PlinkoProbabilityConstants from '../../common/PlinkoProbabilityConstants.js';
import PlinkoProbabilityQueryParameters from '../../common/PlinkoProbabilityQueryParameters.js';
import HistogramModeControl from '../../common/view/HistogramModeControl.js';
import PegsNode from '../../common/view/PegsNode.js';
import PlinkoProbabilityCommonView from '../../common/view/PlinkoProbabilityCommonView.js';
import plinkoProbability from '../../plinkoProbability.js';
import HopperModeControl from './HopperModeControl.js';
import LabPlayPanel from './LabPlayPanel.js';
import OutOfBallsDialog from './OutOfBallsDialog.js';
import PegControls from './PegControls.js';
import StatisticsAccordionBox from './StatisticsAccordionBox.js';
import TrajectoryPath from './TrajectoryPath.js';

// constants
const PANEL_FIXED_WIDTH = 220; // determined empirically

class LabScreenView extends PlinkoProbabilityCommonView {

  /**
   * @param {LabModel} model
   */
  constructor( model ) {

    super( model, {
      histogramMode: 'counter'
    } );
    // pegs on the Galton board
    const pegsNode = new PegsNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, this.modelViewTransform, {
      canvasBounds: this.viewTriangularBoardBounds
    } );

    // radio buttons to right of the hopper
    const hopperModeControl = new HopperModeControl( model.hopperModeProperty, {
      left: this.hopper.right + 47,
      top: this.hopper.top
    } );

    // radio buttons that can toggle between 'fraction and 'counter' mode
    const histogramModeControl = new HistogramModeControl( this.viewProperties.histogramModeProperty, 'counter', counterImage, 'fraction', fractionImage, {
      bottom: this.eraserButton.top - 16,
      left: this.eraserButton.left
    } );

    // we call pre populate here because the histogram would be created by now
    if ( PlinkoProbabilityQueryParameters.histogramBallsLab > 0 ) {
      model.histogram.prepopulate( PlinkoProbabilityQueryParameters.histogramBallsLab );
    }

    // Play panel, at top right
    const playPanel = new LabPlayPanel( model, {
      minWidth: PANEL_FIXED_WIDTH,
      maxWidth: PANEL_FIXED_WIDTH,
      right: this.layoutBounds.maxX - PlinkoProbabilityConstants.PANEL_RIGHT_PADDING,
      top: 10
    } );

    // controls that modify the pegs in the galton board, below the Play panel
    const pegControls = new PegControls( model.numberOfRowsProperty, model.probabilityProperty, {
      minWidth: PANEL_FIXED_WIDTH,
      maxWidth: PANEL_FIXED_WIDTH,
      top: playPanel.bottom + PlinkoProbabilityConstants.PANEL_VERTICAL_SPACING,
      right: playPanel.right
    } );

    // statistics panel, below peg controls
    const statisticsAccordionBox = new StatisticsAccordionBox( model,
      this.viewProperties.isTheoreticalHistogramVisibleProperty, {
        expandedProperty: this.viewProperties.expandedAccordionBoxProperty,
        minWidth: PANEL_FIXED_WIDTH,
        maxWidth: PANEL_FIXED_WIDTH,
        top: pegControls.bottom + PlinkoProbabilityConstants.PANEL_VERTICAL_SPACING,
        right: playPanel.right
      } );

    // create pathsLayer to keep all the TrajectoryPath
    const pathsLayer = new Node( { layerSplit: true } );

    // rendering order
    this.addChild( histogramModeControl );
    this.addChild( hopperModeControl );
    this.addChild( playPanel );
    this.addChild( pegControls );
    this.addChild( statisticsAccordionBox );
    this.addChild( pegsNode );
    this.addChild( pathsLayer );

    // handle the coming and going of the balls in the model.
    model.balls.addItemAddedListener( addedBall => {
      let removalListener;
      switch( model.hopperModeProperty.get() ) {

        case 'ball': {
          // initiates sound to play when ball hits a peg
          const ballHittingPegListener = direction => {
            this.pegSoundGeneration.playBallHittingPegSound( direction );
          };
          addedBall.ballHittingPegEmitter.addListener( ballHittingPegListener );
          removalListener = removedBall => {
            if ( removedBall === addedBall ) {
              addedBall.ballHittingPegEmitter.removeListener( ballHittingPegListener );
              model.balls.removeItemRemovedListener( removalListener );
            }
          };
          model.balls.addItemRemovedListener( removalListener );
          break;
        }

        case 'path': {
          const addedTrajectoryPath = new TrajectoryPath( addedBall, this.modelViewTransform );
          pathsLayer.addChild( addedTrajectoryPath );
          removalListener = removedBall => {
            if ( removedBall === addedBall ) {
              pathsLayer.removeChild( addedTrajectoryPath );
              model.balls.removeItemRemovedListener( removalListener );
            }
          };
          model.balls.addItemRemovedListener( removalListener );
          break;
        }

        case 'none':
          break;

        default:
          throw new Error( `invalid hopperMode: ${model.hopperModeProperty.get()}` );
      }
    } );

    // OutOfBallsDialog, created lazily because Dialog requires sim bounds during construction
    let dialog = null;

    // no need to dispose of this link
    model.isBallCapReachedProperty.lazyLink( isBallCapReached => {

      // when the max number of balls is reached...
      if ( isBallCapReached ) {

        // pop up a dialog
        if ( !dialog ) {
          dialog = new OutOfBallsDialog();
        }
        dialog.show();

        // makes the play button visible
        playPanel.playButtonVisibleProperty.set( true );

        // it is not playing anymore
        model.isPlayingProperty.set( false );
      }
    } );

    // pdom
    this.pdomPlayAreaNode.pdomOrder = [ playPanel, pegControls, statisticsAccordionBox, hopperModeControl, histogramModeControl, this.eraserButton ];
  }
}

plinkoProbability.register( 'LabScreenView', LabScreenView );
export default LabScreenView;