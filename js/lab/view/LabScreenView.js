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
  var GaltonBoardNode = require( 'PLINKO_PROBABILITY/common/view/GaltonBoardNode' );
  var HistogramModeControl = require( 'PLINKO_PROBABILITY/common/view/HistogramModeControl' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabPlayPanel = require( 'PLINKO_PROBABILITY/lab/view/LabPlayPanel' );
  var MultiLineText = require( 'SCENERY_PHET/MultiLineText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityCommonView = require( 'PLINKO_PROBABILITY/common/view/PlinkoProbabilityCommonView' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var PlinkoProbabilityQueryParameters = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityQueryParameters' );
  var SliderControlPanel = require( 'PLINKO_PROBABILITY/lab/view/SliderControlPanel' );
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

    // the galton board is different in the lab tab and in the intro tab. They need different options passed
    var galtonBoardNode = new GaltonBoardNode( model.galtonBoard, model.numberOfRowsProperty, model.probabilityProperty, this.modelViewTransform, { canvasBounds: this.viewTriangularBoardBounds } );
    this.galtonBoardNode = galtonBoardNode; // @protected required by supertype

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
    if ( PlinkoProbabilityQueryParameters.BALLS_ON_SCREEN_FLAG ) {
      model.histogram.prepopulate( PlinkoProbabilityQueryParameters.BALLS_ON_SCREEN );
    }

    // create play Panel
    var playPanel = new LabPlayPanel( model, model.ballModeProperty, { minWidth: statisticsAccordionBox.width } );

    // create slider panel that can modify properties of the galton board (number of rows and the binary probability)
    var sliderControlPanel = new SliderControlPanel( model.numberOfRowsProperty, model.probabilityProperty, {
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
    this.addChild( sliderControlPanel );
    this.addChild( statisticsAccordionBox );
    this.addChild( galtonBoardNode );
    this.addChild( pathsLayer );

    // layout the children
    histogramModeControl.bottom = this.histogramModeControlBottom;
    histogramModeControl.left = this.histogramModeControlLeft;
    playPanel.right = this.layoutBounds.maxX - PlinkoConstants.PANEL_RIGHT_PADDING; // determines slider control panel and statistical display position
    playPanel.top = 10;
    hopperModeControl.left = this.hopperRight + 47; // dependent on hopper position
    hopperModeControl.top = HOPPER_TOP;
    sliderControlPanel.top = playPanel.bottom + PlinkoConstants.PANEL_VERTICAL_SPACING;
    sliderControlPanel.right = playPanel.right;
    statisticsAccordionBox.top = sliderControlPanel.bottom + PlinkoConstants.PANEL_VERTICAL_SPACING;
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
     * resets the histogram radio property to be counter
     * @public
     * @override
     */
    reset: function() {
      PlinkoProbabilityCommonView.prototype.reset.call( this );
      this.viewProperties.histogramModeProperty.set( 'counter' );
    }
  } );
} );

