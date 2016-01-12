// Copyright 2015, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play/Pause and two radio buttons .
 *
 */
define( function( require ) {
  'use strict';

  // imports
  var BallRepresentationNode = require( 'PLINKO_PROBABILITY/common/view/BallRepresentationNode' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  //var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  //var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  //var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  //var Text = require( 'SCENERY/nodes/Text' );
  //var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  //var VStrut = require( 'SCENERY/nodes/VStrut' );

  var BALL_RADIUS = 8;

  /**
   *
   * @param {Property.<boolean>} isPlayingProperty
   * @param {Property.<String>} ballRadioProperty
   * @param {Object} [options]
   * @constructor
   */
  function PlayPanel( isPlayingProperty, ballRadioProperty, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        xMargin: 10,
        yMargin: 10,
        stroke: 'black',
        lineWidth: 1,
        minWidth: 0.1,
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
      touchXPadding: 5,
      align: 'left'
    } );

    // play button
    var playPauseButtonOptions = {
      innerButtonLineWidth: 1
    };

    var playPauseButton = new PlayPauseButton( isPlayingProperty, {
      scale: 1.0,
      touchAreaDilation: 12,
      pauseOptions: playPauseButtonOptions,
      playOptions: playPauseButtonOptions
    } );

    var startVBox = new HBox( {
      spacing: 20,
      children: [
        playPauseButton,
        ballModeRadioButtons
      ]
    } );

    Panel.call( this, startVBox, options );
  }

  return inherit( Panel, PlayPanel );
} );
