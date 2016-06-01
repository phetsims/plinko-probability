// Copyright 2015, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play/Pause and two radio buttons .
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var BallRepresentationNode = require( 'PLINKO_PROBABILITY/common/view/BallRepresentationNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  //var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayButton = require( 'PLINKO_PROBABILITY/common/view/PlayButton' );
  var PauseButton = require( 'PLINKO_PROBABILITY/common/view/PauseButton' );
  //var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  //var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  //var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var Timer = require( 'PHET_CORE/Timer' );
  //var VStrut = require( 'SCENERY/nodes/VStrut' );

  var BALL_RADIUS = 8;

  /**
   *
   * @param {PlinkoProbabilityLabModel} model
   * @param {Property.<String>} ballRadioProperty
   * @param {Object} [options]
   * @constructor
   */
  function LabPlayPanel( model, ballRadioProperty, options ) {

    //TODO hoist constants
    var self = this;
    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        xMargin: 10,
        yMargin: 10,
        stroke: 'black',
        lineWidth: 1,
        minWidth: 0,
        titleToControlsVerticalSpace: 5
      },
      options );

    // create the icon for oneBall mode, a representation for a ball
    var oneBall = new BallRepresentationNode( BALL_RADIUS );

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

    // create the icon for the continuous mode
    var continuous = new HBox( {
      align: 'bottom',
      spacing: -BALL_RADIUS, // negative spacing
      children: [
        new BallRepresentationNode( BALL_RADIUS ),
        new BallRepresentationNode( BALL_RADIUS ),
        new BallRepresentationNode( BALL_RADIUS ),
        new BallRepresentationNode( BALL_RADIUS ),
        new BallRepresentationNode( BALL_RADIUS ),
        threeDots
      ]
    } );

    // create the vertical radio group buttons for the one ball and continuous mode.
    var ballModeRadioButtons = new VerticalAquaRadioButtonGroup( [
      { node: oneBall, property: ballRadioProperty, value: 'oneBall' },
      { node: continuous, property: ballRadioProperty, value: 'continuous' }
    ], {
      radius: 8,
      touchAreaXDilation: 5,
      align: 'left',
      spacing: 10
    } );


    // create the play button
    this.playButton = new PlayButton( {
      listener: function() {
        //  model.trigger( 'PressPlayButton' );
        if ( model.isBallCapReached ) {
          model.isBallCapReachedProperty.notifyObserversStatic();
        }
        else {
          if ( ballRadioProperty.value === 'continuous' ) {
            self.togglePlayPauseButtonVisibility();
            model.isPlayingProperty.set( true ); //set isPlayingProperty to true signifying that balls are being dropped
          }

          Timer.clearInterval( model.continuousTimer );
          model.play();
        }
      }
    } );

    // create the pause button
    this.pauseButton = new PauseButton( {
      baseColor: 'red',
      listener: function() {
        self.togglePlayPauseButtonVisibility();
        Timer.clearInterval( model.continuousTimer );
        model.isPlayingProperty.set( false ); // set isPlayingProperty to false signifying that no balls are being dropped
      }
    } );

    // link the ballRadioProperty to the state of the playPauseButton
    ballRadioProperty.link( function() {
        self.setPlayButtonVisible();
        Timer.clearInterval( model.continuousTimer );
      }
    );

    // create a separate node to hold the play and pause button
    var playPlayPauseButton = new Node();

    // add the play and pause button
    playPlayPauseButton.addChild( this.playButton );
    playPlayPauseButton.addChild( this.pauseButton );


    // create the content of the panel, with the play pause button and the radio buttons
    var startVBox = new HBox( {
      spacing: 20,
      children: [
        playPlayPauseButton,
        ballModeRadioButtons
      ]
    } );

    Panel.call( this, startVBox, options );
  }

  plinkoProbability.register( 'LabPlayPanel', LabPlayPanel );

  return inherit( Panel, LabPlayPanel, {
    /**
     * toggle the visibility of the play and pause button
     * @public
     */
    togglePlayPauseButtonVisibility: function() {
      assert && assert( this.playButton.visible !== this.pauseButton.visible, 'the visibility of the play and pause buttons should alternate' );
      this.playButton.visible = !this.playButton.visible;
      this.pauseButton.visible = !this.pauseButton.visible;
    },

    /**
     * sets the visibility of the play pause button to play
     * @public
     */
    setPlayButtonVisible: function() {
      this.playButton.visible = true;
      this.pauseButton.visible = false;
    },
    /**
     * sets the visibility of the play/pause button to pause
     * @public
     */
    setPauseButtonVisible: function() {
      this.playButton.visible = false;
      this.pauseButton.visible = true;
    }


  } );
} );
