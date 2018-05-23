// Copyright 2015-2016, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play Button and three radio buttons.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var BallNode = require( 'PLINKO_PROBABILITY/common/view/BallNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PlayButton = require( 'PLINKO_PROBABILITY/common/view/PlayButton' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // constants
  var BALL_RADIUS = PlinkoProbabilityConstants.BALL_RADIUS;

  // strings
  var timesString = '\u00D7'; // multiplication Sign

  /**
   * @param {Function} updateBallsToCreateNumber - function that update the number of balls to be created
   * @param {Property.<string>} ballModeProperty - see PlinkoProbabilityCommonModel
   * @param {Property.<boolean>} isBallCapReachedProperty - describes maximum amount of balls
   * @param {Object} [options]
   * @constructor
   */
  function IntroPlayPanel( updateBallsToCreateNumber, ballModeProperty, isBallCapReachedProperty, options ) {

    options = _.extend( {
      align: 'center',
      xMargin: 7,
      yMargin: 15,
      stroke: 'black',
      lineWidth: 1,
      minWidth: 0.1,
      titleToControlsVerticalSpace: 5
    }, options );

    var fontOptions = { font: PlinkoProbabilityConstants.PANEL_FONT, maxWidth: 190 };

    // Creation of radio button icons
    var oneBall = new HBox( {
      spacing: BALL_RADIUS / 2,
      children: [ new BallNode( BALL_RADIUS ), new Text( timesString + '1', fontOptions ) ]
    } );
    var tenBalls = new HBox( {
      spacing: BALL_RADIUS / 2,
      children: [ new BallNode( BALL_RADIUS ), new Text( timesString + '10', fontOptions ) ]
    } );
    var allBalls = new HBox( {
      spacing: BALL_RADIUS / 2,
      children: [ new BallNode( BALL_RADIUS ), new Text( timesString + '100', fontOptions ) ]
    } );

    // Creation of radio button group for ball setting
    var ballModeRadioButtons = new VerticalAquaRadioButtonGroup( [
      { node: oneBall, property: ballModeProperty, value: 'oneBall' },
      { node: tenBalls, property: ballModeProperty, value: 'tenBalls' },
      { node: allBalls, property: ballModeProperty, value: 'allBalls' }
    ], {
      radius: 8,      // radius of radio button circle
      spacing: 10,     // vertical spacing between each radio button
      touchAreaXDilation: 5
    } );

    //Creation of play button
    var playButton = new PlayButton( {
      listener: updateBallsToCreateNumber,
      enabled: true
    } );

    // Disables play button if maximum amount of balls are dropped
    isBallCapReachedProperty.lazyLink( function( isBallCapReached ) {
      playButton.enabled = !isBallCapReached;
    } );

    //Creation of play button panel box
    var playAndRadioButtonBox = new HBox( {
      spacing: 0,
      children: [
        new HStrut( 20 ),     // spacing between left panel margin and play button
        playButton,
        new HStrut( 25 ),     // spacing between play button and radio buttons
        ballModeRadioButtons,
        new HStrut( 10 )      // spacing between radio buttons and right margin
      ]
    } );

    Panel.call( this, playAndRadioButtonBox, options );
  }

  plinkoProbability.register( 'IntroPlayPanel', IntroPlayPanel );

  return inherit( Panel, IntroPlayPanel );
} );
