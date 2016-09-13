// Copyright 2014-2016, University of Colorado Boulder

/**
 * Common ScreenView (base type) for Plinko Probability
 *
 * @author Martin Veillette (Berea College)
 * @author Guillermo Ramos (Berea College)
 * @author Denzell Barnett (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BallsNode = require( 'PLINKO_PROBABILITY/common/view/BallsNode' );
  var Board = require( 'PLINKO_PROBABILITY/common/view/Board' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var HistogramNode = require( 'PLINKO_PROBABILITY/common/view/HistogramNode' );
  var Hopper = require( 'PLINKO_PROBABILITY/common/view/Hopper' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var PegSoundGeneration = require( 'PLINKO_PROBABILITY/common/view/PegSoundGeneration' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );

  // constants
  var HISTOGRAM_MODE_VALUES = [ 'counter', 'cylinder', 'fraction' ]; // values for histogramModeProperty

  /**
   * @param {PlinkoProbabilityCommonModel} model
   * @param {Object} [options]
   * @constructor
   */
  function PlinkoProbabilityCommonView( model, options ) {

    options = _.extend( {
      layoutBounds: new Bounds2( 0, 0, 1024, 618 ),
      histogramMode: 'cylinder' // {string} see HISTOGRAM_MODE_VALUES
    }, options );

    var thisView = this;
    this.model = model; // @private

    ScreenView.call( this, options );

    // view-specific Properties
    var viewProperties = new PropertySet( {
      histogramMode: options.histogramMode,
      expandedAccordionBox: true,
      isTheoreticalHistogramVisible: false,
      isSoundEnabled: false
    } );
    this.viewProperties = viewProperties; // @protected

    // validate string values
    viewProperties.histogramModeProperty.link( function( histogramMode ) {
      assert && assert( _.contains( HISTOGRAM_MODE_VALUES, histogramMode ), 'invalid histogramMode: ' + histogramMode );
    } );

    var hopper = new Hopper( {
      centerX: this.layoutBounds.maxX / 2 - 80,
      top: 10
    } );

    var board = new Board( {
      x: hopper.centerX,
      top: hopper.bottom + 10
    } );

    // create the model view transform based on the triangular board of the galton board (excluding the dropped shadow)
    var viewTriangularBoardBounds = new Bounds2( board.left, board.top, board.left + board.size.width, board.top + board.size.height );
    var modelTriangularBoardBounds = model.galtonBoard.bounds;
    var modelViewTransform = ModelViewTransform2.createRectangleInvertedYMapping( modelTriangularBoardBounds, viewTriangularBoardBounds );

    // @protected
    this.viewTriangularBoardBounds = viewTriangularBoardBounds;
    this.modelViewTransform = modelViewTransform;

    var histogramModelBounds = PlinkoProbabilityConstants.HISTOGRAM_BOUNDS;
    var ballModelBounds = model.galtonBoard.bounds.union( histogramModelBounds );
    var ballViewBounds = this.modelViewTransform.modelToViewBounds( ballModelBounds ).dilated( 20 );

    // renders all the balls
    var ballsNode = new BallsNode( model.balls, model.numberOfRowsProperty, viewProperties.histogramModeProperty, modelViewTransform, {
      canvasBounds: ballViewBounds
    } );

    var histogramNode = new HistogramNode(
      viewProperties.histogramModeProperty,
      model,
      modelViewTransform,
      viewProperties.isTheoreticalHistogramVisibleProperty
    );
    this.histogramNode = histogramNode;

    var eraserButton = new EraserButton( {
      iconWidth: 22,
      scale: 1.4,
      listener: function() { model.erase(); },
      bottom: this.layoutBounds.maxY - 55,
      left: 40
    } );

    // @protected sound generator for ball hitting peg
    this.pegSoundGeneration = new PegSoundGeneration( viewProperties.isSoundEnabledProperty );

    // Reset All Button at bottom right
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        thisView.reset();
      },
      right: this.layoutBounds.maxX - PlinkoProbabilityConstants.PANEL_RIGHT_PADDING,
      bottom: this.layoutBounds.maxY - 10
    } );

    // sound toggle button at bottom right
    var soundToggleButton = new SoundToggleButton( viewProperties.isSoundEnabledProperty, {
      right: resetAllButton.left - 20,
      centerY: resetAllButton.centerY
    } );

    // add children to the scene graph
    this.addChild( board );
    this.addChild( ballsNode );
    this.addChild( eraserButton );
    this.addChild( soundToggleButton );
    this.addChild( resetAllButton );
    this.addChild( histogramNode );
    this.addChild( hopper );

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

    // @protected used for layout by subtypes
    this.hopper = hopper;
    this.eraserButton = eraserButton;
  }

  plinkoProbability.register( 'PlinkoProbabilityCommonView', PlinkoProbabilityCommonView );

  return inherit( ScreenView, PlinkoProbabilityCommonView, {

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
} );