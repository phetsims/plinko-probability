// Copyright 2015-2020, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play/Pause and two radio buttons .
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const BallNode = require( 'PLINKO_PROBABILITY/common/view/BallNode' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const BooleanToggleNode = require( 'SUN/BooleanToggleNode' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HStrut = require( 'SCENERY/nodes/HStrut' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Panel = require( 'SUN/Panel' );
  const PauseButton = require( 'PLINKO_PROBABILITY/common/view/PauseButton' );
  const PlayButton = require( 'PLINKO_PROBABILITY/common/view/PlayButton' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // constants
  const BALL_RADIUS = PlinkoProbabilityConstants.BALL_RADIUS;

  /**
   * @param {LabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function LabPlayPanel( model, options ) {

    const self = this;

    options = merge( {
      align: 'center',
      xMargin: 10,
      yMargin: 10,
      stroke: 'black',
      lineWidth: 1,
      minWidth: 0,
      titleToControlsVerticalSpace: 5
    }, options );

    // create the icon for oneBall mode, a representation for a ball
    const oneBall = new BallNode( BALL_RADIUS );

    // create an ellipsis (the punctuation mark, not the geometrical shape)
    const threeDots = new HBox( {
      spacing: 2,
      children: [
        new HStrut( BALL_RADIUS ),
        new Circle( 1, { fill: 'black' } ),
        new Circle( 1, { fill: 'black' } ),
        new Circle( 1, { fill: 'black' } )
      ]
    } );

    // the ball size is not necessarily twice the radius
    const ballWidth = new BallNode( BALL_RADIUS ).width;

    // create the icon for the continuous mode
    const continuous = new HBox( {
      align: 'bottom',
      spacing: -ballWidth / 2, // negative spacing
      children: [
        new BallNode( BALL_RADIUS ),
        new BallNode( BALL_RADIUS ),
        new BallNode( BALL_RADIUS ),
        new BallNode( BALL_RADIUS ),
        new BallNode( BALL_RADIUS ),
        threeDots
      ]
    } );

    // create the vertical radio group buttons for the one ball and continuous mode.
    const ballModeRadioButtons = new VerticalAquaRadioButtonGroup( model.ballModeProperty, [
      { node: oneBall, value: 'oneBall' },
      { node: continuous, value: 'continuous' }
    ], {
      radioButtonOptions: { radius: 8 },
      touchAreaXDilation: 5,
      align: 'left',
      spacing: 13 // vertical spacing between radio buttons
    } );

    // @public true makes the play button visible, false makes the pause button visible
    this.playButtonVisibleProperty = new BooleanProperty( true );

    // create the play button
    const playButton = new PlayButton( {
      listener: function() {
        if ( model.isBallCapReachedProperty.get() ) {
          model.isBallCapReachedProperty.notifyListenersStatic();
        }
        else {
          if ( model.ballModeProperty.get() === 'continuous' ) {
            self.playButtonVisibleProperty.set( false ); // make the pause button visible
            model.isPlayingProperty.set( true ); //set isPlayingProperty to true signifying that balls are being dropped
          }
          else {
            model.addNewBall(); // if it is not continuous then we assume it is at 'oneBall'
          }
        }
      }
    } );

    // create the pause button
    const pauseButton = new PauseButton( {
      listener: function() {
        self.playButtonVisibleProperty.set( true ); // make the play button visible
        model.isPlayingProperty.set( false ); // set isPlayingProperty to false signifying that no balls are being dropped
      }
    } );

    const playPlayPauseButton = new BooleanToggleNode( playButton, pauseButton, this.playButtonVisibleProperty );

    // link the ballModeProperty to the state of the playPauseButton
    model.ballModeProperty.link( function() {
      model.isPlayingProperty.set( false ); // if the radio buttons change then we would like to change the playing property
      self.playButtonVisibleProperty.set( true );
    } );

    // create the content of the panel, with the play pause button and the radio buttons
    const startVBox = new HBox( {
      spacing: 20,
      children: [
        playPlayPauseButton,
        ballModeRadioButtons
      ]
    } );

    Panel.call( this, startVBox, options );

    // Disables play button if maximum amount of balls are dropped
    model.isBallCapReachedProperty.lazyLink( function( isBallCapReached ) {
      playButton.enabled = !isBallCapReached;
    } );
  }

  plinkoProbability.register( 'LabPlayPanel', LabPlayPanel );

  return inherit( Panel, LabPlayPanel );
} );

