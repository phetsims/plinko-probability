// Copyright 2014-2020, University of Colorado Boulder

/**
 * Common ScreenView (base type) for Plinko Probability
 *
 * @author Martin Veillette (Berea College)
 * @author Guillermo Ramos (Berea College)
 * @author Denzell Barnett (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import ScreenView from '../../../../joist/js/ScreenView.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import EraserButton from '../../../../scenery-phet/js/buttons/EraserButton.js';
import ResetAllButton from '../../../../scenery-phet/js/buttons/ResetAllButton.js';
import SoundToggleButton from '../../../../scenery-phet/js/buttons/SoundToggleButton.js';
import plinkoProbability from '../../plinkoProbability.js';
import PlinkoProbabilityConstants from '../PlinkoProbabilityConstants.js';
import BallsNode from './BallsNode.js';
import Board from './Board.js';
import HistogramNode from './HistogramNode.js';
import Hopper from './Hopper.js';
import PegSoundGeneration from './PegSoundGeneration.js';
import PlinkoProbabilityViewProperties from './PlinkoProbabilityViewProperties.js';

/**
 * @param {PlinkoProbabilityCommonModel} model
 * @param {Object} [options]
 * @constructor
 */
function PlinkoProbabilityCommonView( model, options ) {

  options = merge( {
    layoutBounds: new Bounds2( 0, 0, 1024, 618 ),
    histogramMode: 'cylinder' // {string} see HISTOGRAM_MODE_VALUES
  }, options );

  this.model = model; // @private

  ScreenView.call( this, options );

  // view-specific Properties
  const viewProperties = new PlinkoProbabilityViewProperties( {
    histogramMode: options.histogramMode
  } );
  this.viewProperties = viewProperties; // @protected

  const hopper = new Hopper( model.numberOfRowsProperty, {
    centerX: this.layoutBounds.maxX / 2 - 80,
    top: 10
  } );

  const board = new Board( {
    x: hopper.centerX,
    top: hopper.bottom + 10
  } );

  // create the model view transform based on the triangular board of the galton board (excluding the dropped shadow)
  const viewTriangularBoardBounds = new Bounds2( board.left, board.top, board.left + board.size.width, board.top + board.size.height );
  const modelTriangularBoardBounds = model.galtonBoard.bounds;
  const modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelTriangularBoardBounds, viewTriangularBoardBounds );

  // @protected
  this.viewTriangularBoardBounds = viewTriangularBoardBounds;
  this.modelViewTransform = modelViewTransform;

  const histogramModelBounds = PlinkoProbabilityConstants.HISTOGRAM_BOUNDS;
  const ballModelBounds = model.galtonBoard.bounds.union( histogramModelBounds );
  const ballViewBounds = this.modelViewTransform.modelToViewBounds( ballModelBounds ).dilated( 20 );

  // renders all the balls
  const ballsNode = new BallsNode( model.balls, model.numberOfRowsProperty, viewProperties.histogramModeProperty, modelViewTransform, {
    canvasBounds: ballViewBounds
  } );

  const histogramNode = new HistogramNode(
    viewProperties.histogramModeProperty,
    model,
    modelViewTransform,
    viewProperties.isTheoreticalHistogramVisibleProperty
  );
  this.histogramNode = histogramNode;

  const eraserButton = new EraserButton( {
    iconWidth: 22,
    scale: 1.4,
    listener: function() { model.erase(); },
    bottom: this.layoutBounds.maxY - 55,
    left: 40
  } );

  // @protected sound generator for ball hitting peg
  this.pegSoundGeneration = new PegSoundGeneration( viewProperties.isSoundEnabledProperty );

  // Reset All Button at bottom right
  const self = this;
  const resetAllButton = new ResetAllButton( {
    listener: function() {
      model.reset();
      self.reset();
    },
    right: this.layoutBounds.maxX - PlinkoProbabilityConstants.PANEL_RIGHT_PADDING,
    bottom: this.layoutBounds.maxY - 10
  } );

  // sound toggle button at bottom right
  const soundToggleButton = new SoundToggleButton( viewProperties.isSoundEnabledProperty, {
    right: resetAllButton.left - 20,
    centerY: resetAllButton.centerY,
    xMargin: 8
  } );

  // add children to the scene graph
  this.addChild( board );
  this.addChild( ballsNode );
  this.addChild( eraserButton );
  this.addChild( histogramNode );
  this.addChild( hopper );
  this.addChild( soundToggleButton );
  this.addChild( resetAllButton );

  // Hide BallsNode when the hopper mode is not 'ball'.
  // unlink unnecessary since this instance exists for the lifetime of the sim.
  model.hopperModeProperty.link( function( hopperMode ) {
    ballsNode.visible = ( hopperMode === 'ball' );
  } );

  // When switching to show bins, repaint the balls.
  // unlink unnecessary since this instance exists for the lifetime of the sim.
  viewProperties.histogramModeProperty.link( function( histogramMode ) {
    if ( histogramMode === 'cylinder' ) {
      ballsNode.invalidatePaint();
    }
  } );

  // Repaint ballsNode when balls have moved.
  // See https://github.com/phetsims/plinko-probability/issues/62
  model.ballsMovedEmitter.addListener( function() {
    ballsNode.invalidatePaint();
  } );

  // @protected used by subtypes
  this.hopper = hopper;
  this.ballsNode = ballsNode;
  this.eraserButton = eraserButton;
}

plinkoProbability.register( 'PlinkoProbabilityCommonView', PlinkoProbabilityCommonView );

inherit( ScreenView, PlinkoProbabilityCommonView, {

  /**
   * @param dt
   * @public
   */
  step: function( dt ) {

    // increment time for sound generation
    this.pegSoundGeneration.step( dt );
  },

  /**
   * Reset function. The base type implementation does nothing. But reset is called by
   * the Reset All button listener and may be overridden in subtypes.  So it seemed
   * appropriate to include a no-op function here.
   *
   * @public
   */
  reset: function() {
    this.viewProperties.reset();
    this.pegSoundGeneration.reset();
  }
} );

export default PlinkoProbabilityCommonView;