// Copyright 2002-2015, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play Button and three radio buttons .
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
  var PlayButton = require( 'PLINKO/intro/view/PlayButton' );
  var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Text = require( 'SCENERY/nodes/Text' );
  //var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  //var VStrut = require( 'SUN/VStrut' );

  // strings
  var allString = require( 'string!PLINKO/all' );
  var timesString = '\u00D7'; // multiplication Sign

  /**
   *
   * @param {Function} listener
   * @param {Property.<String>} ballModeProperty
   * @param {Object} [options]
   * @constructor
   */
  function PlayPanel( listener, ballModeProperty, options ) {

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
        fill: new RadialGradient(
          -PlinkoConstants.BALL_RADIUS * 0.4,
          -PlinkoConstants.BALL_RADIUS * 0.4,
          0,
          PlinkoConstants.BALL_RADIUS * 0.1,
          -PlinkoConstants.BALL_RADIUS * 0.3,
          PlinkoConstants.BALL_RADIUS * 0.6 )
          .addColorStop( 0, PlinkoConstants.BALL_HIGHLIGHT_COLOR )
          .addColorStop( 1, PlinkoConstants.BALL_COLOR )
      } );
    }

    var fontOptions = { font: PlinkoConstants.PANEL_FONT };
    var oneBall = new HBox( {
      spacing: PlinkoConstants.BALL_RADIUS,
      children: [ createCircle(), new Text( timesString + '1', fontOptions ) ]
    } );

    var tenBalls = new HBox( {
      spacing: PlinkoConstants.BALL_RADIUS,
      children: [ createCircle(), new Text( timesString + '10', fontOptions ) ]
    } );
    var allBalls = new HBox( {
      spacing: PlinkoConstants.BALL_RADIUS,
      children: [ createCircle(), new Text( timesString + allString, fontOptions ) ]
    } );

    var ballModeRadioButtons = new VerticalAquaRadioButtonGroup( [
      { node: oneBall, property: ballModeProperty, value: 'oneBall' },
      { node: tenBalls, property: ballModeProperty, value: 'tenBalls' },
      { node: allBalls, property: ballModeProperty, value: 'allBalls' }
    ], { radius: 8 } );

    var playButton = new PlayButton( {
      listener: function() {
        listener();
      }
    } );

    var startVBox = new HBox( {
      spacing: 10,
      children: [
        playButton,
        ballModeRadioButtons
      ]
    } );

    Panel.call( this, startVBox, options );
  }

  return inherit( Panel, PlayPanel );
} );
