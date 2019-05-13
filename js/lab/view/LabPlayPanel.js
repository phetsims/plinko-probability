// Copyright 2015-2018, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play/Pause and two radio buttons .
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var BallNode = require( 'PLINKO_PROBABILITY/common/view/BallNode' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var BooleanToggleNode = require( 'SUN/BooleanToggleNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PauseButton = require( 'PLINKO_PROBABILITY/common/view/PauseButton' );
  var PlayButton = require( 'PLINKO_PROBABILITY/common/view/PlayButton' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // constants
  var BALL_RADIUS = PlinkoProbabilityConstants.BALL_RADIUS;

  /**
   * @param {LabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function LabPlayPanel( model, options ) {

    var self = this;

    options = _.extend( {
      align: 'center',
      xMargin: 10,
      yMargin: 10,
      stroke: 'black',
      lineWidth: 1,
      minWidth: 0,
      titleToControlsVerticalSpace: 5
    }, options );

    // create the icon for oneBall mode, a representation for a ball
    var oneBall = new BallNode( BALL_RADIUS );

    // create an ellipsis (the punctuation mark, not the geometrical shape)
    var threeDots = new HBox( {
      spacing: 2,
      children: [
        new HStrut( BALL_RADIUS ),
        new Circle( 1, { fill: 'black' } ),
        new Circle( 1, { fill: 'black' } ),
        new Circle( 1, { fill: 'black' } )
      ]
    } );

    // the ball size is not necessarily twice the radius
    var ballWidth = new BallNode( BALL_RADIUS ).width;

    // create the icon for the continuous mode
    var continuous = new HBox( {
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
    var ballModeRadioButtons = new VerticalAquaRadioButtonGroup( model.ballModeProperty, [
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
    var playButton = new PlayButton( {
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
    var pauseButton = new PauseButton( {
      listener: function() {
        self.playButtonVisibleProperty.set( true ); // make the play button visible
        model.isPlayingProperty.set( false ); // set isPlayingProperty to false signifying that no balls are being dropped
      }
    } );

    var playPlayPauseButton = new BooleanToggleNode( playButton, pauseButton, this.playButtonVisibleProperty );

    // link the ballModeProperty to the state of the playPauseButton
    model.ballModeProperty.link( function() {
      model.isPlayingProperty.set( false ); // if the radio buttons change then we would like to change the playing property
      self.playButtonVisibleProperty.set( true );
    } );

    // create the content of the panel, with the play pause button and the radio buttons
    var startVBox = new HBox( {
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

