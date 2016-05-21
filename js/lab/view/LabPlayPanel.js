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
  var PlayButton = require( 'PLINKO_PROBABILITY/intro/view/PlayButton' );
  var PauseButton = require( 'PLINKO_PROBABILITY/intro/view/PauseButton' );
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
   * @param model
   * @param {Property.<String>} ballRadioProperty
   * @param {Object} [options]
   * @constructor
   */
  function LabPlayPanel( model, ballRadioProperty, options ) {

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

    var oneBall = new BallRepresentationNode( BALL_RADIUS );

    var threeDots = new HBox( {
      spacing: 2,
      children: [
        new HStrut( BALL_RADIUS ),
        new Circle( 1, { fill: 'black' } ),
        new Circle( 1, { fill: 'black' } ),
        new Circle( 1, { fill: 'black' } )
      ]
    } );

    var continuous = new HBox( {
      align: 'bottom',
      spacing: -BALL_RADIUS * 1.0, // negative spacing
      children: [
        new BallRepresentationNode( BALL_RADIUS ),
        new BallRepresentationNode( BALL_RADIUS ),
        new BallRepresentationNode( BALL_RADIUS ),
        new BallRepresentationNode( BALL_RADIUS ),
        new BallRepresentationNode( BALL_RADIUS ),
        threeDots
      ]
    } );

    var ballModeRadioButtons = new VerticalAquaRadioButtonGroup( [
      { node: oneBall, property: ballRadioProperty, value: 'oneBall' },
      { node: continuous, property: ballRadioProperty, value: 'continuous' }
    ], {
      radius: 8,
      touchAreaXDilation: 5,
      align: 'left',
      spacing: 10
    } );

    var playButton = new PlayButton( {
      listener: function() {
        //  model.trigger( 'PressPlayButton' );
        if ( ballRadioProperty.value === 'continuous' ) {
          playButton.visible = false;
          pauseButton.visible = true;
        }
        Timer.clearInterval( model.continuousTimer );
        model.play();
      }
    } );

    var pauseButton = new PauseButton( {
      baseColor: 'red',
      listener: function() {
        pauseButton.visible = false;
        playButton.visible = true;
        Timer.clearInterval( model.continuousTimer );
      }
    } );

    var playPlayPauseButton = new Node();

    playPlayPauseButton.addChild( playButton );
    playPlayPauseButton.addChild( pauseButton );

    // link the ballRadioProperty to the state of the playPauseButton
    ballRadioProperty.link( function() {
      playButton.visible = true;
      pauseButton.visible = false;
      Timer.clearInterval( model.continuousTimer );
      }
    );

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

  return inherit( Panel, LabPlayPanel );
} );
