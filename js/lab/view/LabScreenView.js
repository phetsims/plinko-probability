// Copyright 2014-2015, University of Colorado Boulder

/**
 * ScreenView for the 'Lab' screen
 *
 * @author Martin Veillette (Berea College)
 * @author Guillermo Ramos (Berea College)
 * @author Denzell Barnett (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var HopperModeControl = require( 'PLINKO_PROBABILITY/lab/view/HopperModeControl' );
  var Dialog = require( 'JOIST/Dialog' );
  var HistogramModeControl = require( 'PLINKO_PROBABILITY/common/view/HistogramModeControl' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabPlayPanel = require( 'PLINKO_PROBABILITY/lab/view/LabPlayPanel' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PegControls = require( 'PLINKO_PROBABILITY/lab/view/PegControls' );
  var PegsNode = require( 'PLINKO_PROBABILITY/common/view/PegsNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityCommonView = require( 'PLINKO_PROBABILITY/common/view/PlinkoProbabilityCommonView' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var PlinkoProbabilityQueryParameters = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityQueryParameters' );
  var StatisticsAccordionBox = require( 'PLINKO_PROBABILITY/lab/view/StatisticsAccordionBox' );
  var TrajectoryPath = require( 'PLINKO_PROBABILITY/lab/view/TrajectoryPath' );

  // images
  var counterImage = require( 'image!PLINKO_PROBABILITY/counter.png' );
  var fractionImage = require( 'image!PLINKO_PROBABILITY/fraction.png' );

  // strings
  var outOfBallsString = require( 'string!PLINKO_PROBABILITY/outOfBalls' );
  var HOPPER_TOP = 10;

  /**
   * @param {LabModel} model
   * @constructor
   */
  function LabScreenView( model ) {

    PlinkoProbabilityCommonView.call( this, model );

    var thisModel = this;

    // pegs on the Galton board
    var pegsNode = new PegsNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, this.modelViewTransform, {
      canvasBounds: this.viewTriangularBoardBounds
    } );

    // create three radio buttons next to the hopper
    var hopperModeControl = new HopperModeControl( model.hopperModeProperty );

    // create the two radio buttons that can toggle between 'fraction and 'counter' mode
    this.viewProperties.histogramModeProperty.set( 'counter' );
    var histogramModeControl = new HistogramModeControl( this.viewProperties.histogramModeProperty, 'counter', counterImage, 'fraction', fractionImage, {
      buttonContentYMargin: 13
    } );

    // create an accordion box that displays sample and theoretical statistics related to the histogram
    var statisticsAccordionBox = new StatisticsAccordionBox(
      model,
      this.viewProperties.isTheoreticalHistogramVisibleProperty,
      this.viewProperties.expandedAccordionBoxProperty );

    // we call pre populate here because the histogram would be created by now
    if ( PlinkoProbabilityQueryParameters.POPULATE_HISTOGRAM ) {
      model.histogram.prepopulate( PlinkoProbabilityQueryParameters.POPULATE_HISTOGRAM );
    }

    // create play Panel
    var playPanel = new LabPlayPanel( model, model.ballModeProperty, { minWidth: statisticsAccordionBox.width } );

    // controls that modify the pegs in the galton board
    var pegControls = new PegControls( model.numberOfRowsProperty, model.probabilityProperty, {
      minWidth: statisticsAccordionBox.width
    } );

    // create pathsLayer to keep all the TrajectoryPath
    var pathsLayer = new Node( { layerSplit: true } );

    // handle the coming and going of the balls in the model.
    model.balls.addItemAddedListener( function( addedBall ) {
      switch ( model.hopperModeProperty.value ) {
        case 'ball':
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
          break;
        case 'path':
          var addedTrajectoryPath = new TrajectoryPath( addedBall, thisModel.modelViewTransform );
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
          throw new Error( 'Unhandled galton Board Radio Button state: ' + model.hopperModeProperty.value );
      }
    } );

    // adding children to the scene graph
    this.addChild( histogramModeControl );
    this.addChild( hopperModeControl );
    this.addChild( playPanel );
    this.addChild( pegControls );
    this.addChild( statisticsAccordionBox );
    this.addChild( pegsNode );
    this.addChild( pathsLayer );

    // layout the children
    histogramModeControl.bottom = this.eraserButton.top - 16;
    histogramModeControl.left = this.eraserButton.left;
    playPanel.right = this.layoutBounds.maxX - PlinkoProbabilityConstants.PANEL_RIGHT_PADDING; // determines slider control panel and statistical display position
    playPanel.top = 10;
    hopperModeControl.left = this.hopper.right + 47;
    hopperModeControl.top = HOPPER_TOP;
    pegControls.top = playPanel.bottom + PlinkoProbabilityConstants.PANEL_VERTICAL_SPACING;
    pegControls.right = playPanel.right;
    statisticsAccordionBox.top = pegControls.bottom + PlinkoProbabilityConstants.PANEL_VERTICAL_SPACING;
    statisticsAccordionBox.right = playPanel.right;

    // no need to dispose of this link
    model.isBallCapReachedProperty.lazyLink( function( isBallCapReached ) {
      // pops up a dialog box when the number of balls is reached.
      if ( isBallCapReached ) {
        new Dialog( new MultiLineText( outOfBallsString, { font: new PhetFont( 50 ) } ), {
          modal: true,
          // focusable so it can be dismissed
          focusable: true
        } ).show();
        // sets the play button to active.
        playPanel.setPlayButtonVisible();
        // it is not playing anymore
        model.isPlayingProperty.set( false );
      }
    } );
  }

  plinkoProbability.register( 'LabScreenView', LabScreenView );

  return inherit( PlinkoProbabilityCommonView, LabScreenView, {

    /**
     * @public
     * @override
     */
    reset: function() {
      PlinkoProbabilityCommonView.prototype.reset.call( this );
      this.viewProperties.histogramModeProperty.set( 'counter' );
    }
  } );
} );

