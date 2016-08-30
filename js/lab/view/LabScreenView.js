// Copyright 2014-2016, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen
 *
 * @author Martin Veillette (Berea College)
 * @author Guillermo Ramos (Berea College)
 * @author Denzell Barnett (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dialog = require( 'JOIST/Dialog' );
  var HistogramModeControl = require( 'PLINKO_PROBABILITY/common/view/HistogramModeControl' );
  var HopperModeControl = require( 'PLINKO_PROBABILITY/lab/view/HopperModeControl' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabPlayPanel = require( 'PLINKO_PROBABILITY/lab/view/LabPlayPanel' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PegControls = require( 'PLINKO_PROBABILITY/lab/view/PegControls' );
  var PegsNode = require( 'PLINKO_PROBABILITY/common/view/PegsNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityCommonView = require( 'PLINKO_PROBABILITY/common/view/PlinkoProbabilityCommonView' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var PlinkoProbabilityQueryParameters = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityQueryParameters' );
  var StatisticsAccordionBox = require( 'PLINKO_PROBABILITY/lab/view/StatisticsAccordionBox' );
  var Text = require( 'SCENERY/nodes/Text' );
  var TrajectoryPath = require( 'PLINKO_PROBABILITY/lab/view/TrajectoryPath' );

  // images
  var counterImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var fractionImage = require( 'image!PLINKO_PROBABILITY/fraction.png' );

  // strings
  var outOfBallsString = require( 'string!PLINKO_PROBABILITY/outOfBalls' );

  // constants
  var PANEL_FIXED_WIDTH = 220; // determined empirically

  /**
   * @param {LabModel} model
   * @constructor
   */
  function LabScreenView( model ) {

    var thisView = this;

    PlinkoProbabilityCommonView.call( this, model, {
      histogramMode: 'counter'
    } );

    // pegs on the Galton board
    var pegsNode = new PegsNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, this.modelViewTransform, {
      canvasBounds: this.viewTriangularBoardBounds
    } );

    // radio buttons to right of the hopper
    var hopperModeControl = new HopperModeControl( model.hopperModeProperty, {
      left: this.hopper.right + 47,
      top: this.hopper.top
    } );

    // radio buttons that can toggle between 'fraction and 'counter' mode
    var histogramModeControl = new HistogramModeControl( this.viewProperties.histogramModeProperty, 'counter', counterImage, 'fraction', fractionImage, {
      buttonContentYMargin: 13,
      bottom: this.eraserButton.top - 16,
      left: this.eraserButton.left
    } );

    // we call pre populate here because the histogram would be created by now
    if ( PlinkoProbabilityQueryParameters.POPULATE_HISTOGRAM ) {
      model.histogram.prepopulate( PlinkoProbabilityQueryParameters.POPULATE_HISTOGRAM );
    }

    // Play panel, at top right
    var playPanel = new LabPlayPanel( model, model.ballModeProperty, {
      minWidth: PANEL_FIXED_WIDTH,
      maxWidth: PANEL_FIXED_WIDTH,
      right: this.layoutBounds.maxX - PlinkoProbabilityConstants.PANEL_RIGHT_PADDING,
      top: 10
    } );

    // controls that modify the pegs in the galton board, below the Play panel
    var pegControls = new PegControls( model.numberOfRowsProperty, model.probabilityProperty, {
      minWidth: PANEL_FIXED_WIDTH,
      maxWidth: PANEL_FIXED_WIDTH,
      top: playPanel.bottom + PlinkoProbabilityConstants.PANEL_VERTICAL_SPACING,
      right: playPanel.right
    } );

    // statistics panel, below peg controls
    var statisticsAccordionBox = new StatisticsAccordionBox( model,
      this.viewProperties.isTheoreticalHistogramVisibleProperty,
      this.viewProperties.expandedAccordionBoxProperty, {
        minWidth: PANEL_FIXED_WIDTH,
        maxWidth: PANEL_FIXED_WIDTH,
        top: pegControls.bottom + PlinkoProbabilityConstants.PANEL_VERTICAL_SPACING,
        right: playPanel.right
      } );

    // create pathsLayer to keep all the TrajectoryPath
    var pathsLayer = new Node( { layerSplit: true } );

    // rendering order
    this.addChild( histogramModeControl );
    this.addChild( hopperModeControl );
    this.addChild( playPanel );
    this.addChild( pegControls );
    this.addChild( statisticsAccordionBox );
    this.addChild( pegsNode );
    this.addChild( pathsLayer );

    // handle the coming and going of the balls in the model.
    model.balls.addItemAddedListener( function( addedBall ) {
      switch( model.hopperModeProperty.value ) {

        case 'ball':
          // initiates sound to play when ball hits a peg
          var ballHittingPegListener = function( direction ) {
            thisView.pegSoundGeneration.playBallHittingPegSound( direction );
          };
          addedBall.ballHittingPegEmitter.addListener( ballHittingPegListener );
          model.balls.addItemRemovedListener( function removalListener( removedBall ) {
            if ( removedBall === addedBall ) {
              addedBall.ballHittingPegEmitter.removeListener( ballHittingPegListener );
              model.balls.removeItemRemovedListener( removalListener );
            }
          } );
          break;

        case 'path':
          var addedTrajectoryPath = new TrajectoryPath( addedBall, thisView.modelViewTransform );
          pathsLayer.addChild( addedTrajectoryPath );
          model.balls.addItemRemovedListener( function removalListener( removedBall ) {
            if ( removedBall === addedBall ) {
              pathsLayer.removeChild( addedTrajectoryPath );
              model.balls.removeItemRemovedListener( removalListener );
            }
          } );
          break;

        case 'none':
          break;

        default:
          throw new Error( 'Unhandled hopperMode: ' + model.hopperModeProperty.value );
      }
    } );

    //TODO test this
    // no need to dispose of this link
    model.isBallCapReachedProperty.lazyLink( function( isBallCapReached ) {

      // pops up a dialog box when the number of balls is reached.
      if ( isBallCapReached ) {

        var messageNode = new Text( outOfBallsString, {
          font: new PhetFont( 25 ),
          maxWidth: 350
        } );

        // WORKAROUND: Intermediate panel needed to workaround problem that occurs when using
        // xMargin and yMargin options for Dialog, see https://github.com/phetsims/joist/issues/346
        var dialogContent = new Panel( messageNode, {
          fill: null,
          stroke: null,
          xMargin: 40,
          yMargin: 30
        } );

        new Dialog( dialogContent, {
          modal: true,
          focusable: true // so it can be dismissed
        } ).show();

        //TODO this isn't working
        // sets the play button to active.
        playPanel.setPlayButtonVisible();

        // it is not playing anymore
        model.isPlayingProperty.set( false );
      }
    } );
  }

  plinkoProbability.register( 'LabScreenView', LabScreenView );

  return inherit( PlinkoProbabilityCommonView, LabScreenView );
} );

