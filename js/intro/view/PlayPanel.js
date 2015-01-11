// Copyright 2002-2015, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play/Pause and two radio buttons .
 *
 */
define( function( require ) {
  'use strict';

  // imports

  var Circle = require( 'SCENERY/nodes/Circle' );
  //var HStrut = require( 'SUN/HStrut' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Text = require( 'SCENERY/nodes/Text' );
  //var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  //var VStrut = require( 'SUN/VStrut' );

  // strings
  var allString = require( 'string!PLINKO/all' );
  var timesString = '\u00D7'; // multiplication Sign


  //var PANEL_OPTION_FONT = {font: new PhetFont( 14 )};

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

    function createCircle() {
      return new Circle( PlinkoConstants.BALL_RADIUS, {
        stroke: PlinkoConstants.BALL_COLOR,
        lineWidth: 2,
        fill: new RadialGradient( -PlinkoConstants.BALL_RADIUS * 0.4, -PlinkoConstants.BALL_RADIUS * 0.4, 0, PlinkoConstants.BALL_RADIUS * 0.1, -PlinkoConstants.BALL_RADIUS * 0.3, PlinkoConstants.BALL_RADIUS * 0.6 )
          .addColorStop( 0, PlinkoConstants.BALL_HIGHLIGHT_COLOR )
          .addColorStop( 1, PlinkoConstants.BALL_COLOR )
      } );
    }

    var fontOptions = {font: PlinkoConstants.PANEL_FONT};
    var oneBall = new HBox( {
      spacing: PlinkoConstants.BALL_RADIUS,
      children: [createCircle(), new Text( timesString + '1', fontOptions )]
    } );

    var tenBall = new HBox( {
      spacing: PlinkoConstants.BALL_RADIUS,
      children: [createCircle(), new Text( timesString + '10', fontOptions )]
    } );
    var allBall = new HBox( {
      spacing: PlinkoConstants.BALL_RADIUS,
      children: [createCircle(), new Text( timesString + allString, fontOptions )]
    } );

    var ballModeRadioButtons = new VerticalAquaRadioButtonGroup( [
      {node: oneBall, property: ballRadioProperty, value: 'oneBall'},
      {node: tenBall, property: ballRadioProperty, value: 'tenBall'},
      {node: allBall, property: ballRadioProperty, value: 'allBall'}
    ], {radius: 8} );


    // play button
    var playPauseButtonOptions = {
      //upFill: Constants.blueUpColor,
      //overFill: Constants.blueOverColor,
      //disabledFill: Constants.blueDisabledColor,
      //downFill: Constants.blueDownColor,
      //backgroundGradientColorStop0: Constants.buttonBorder0,
      //backgroundGradientColorStop1: Constants.buttonBorder1,
      innerButtonLineWidth: 1
    };

    //// prefer 200 hue
    //blueUpColor: new Color( 'hsl(210,70%,75%)' ),
    //  blueOverColor: new Color( 'hsl(210,90%,80%)' ),
    //  blueDisabledColor: new Color( 'rgb(180,180,180)' ),
    //  blueDownColor: new Color( 'hsl(210,80%,70%)' ),
    //  radioColor: new Color( 'hsl(210,90%,77%)' ),
    //  sliderUp: new Color( 'hsl(210,50%,63%)' ),
    //  sliderOver: new Color( 'hsl(210,70%,73%)' ),
    //  buttonBorder0: new Color( 'transparent' ),
    //  buttonBorder1: new Color( 'transparent' ),

    var playPauseButton = new PlayPauseButton( isPlayingProperty, {
      scale: 1.0,
      touchExpansion: 12,
      pauseOptions: playPauseButtonOptions,
      playOptions: playPauseButtonOptions
    } );

    var startVBox = new HBox( {
      spacing: 10,
      children: [
        playPauseButton,
        ballModeRadioButtons
      ]
    } );


    Panel.call( this, startVBox, options );
  }

  return inherit( Panel, PlayPanel );
} );
