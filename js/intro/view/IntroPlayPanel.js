// Copyright 2015, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play Button and three radio buttons.
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var BallRepresentationNode = require( 'PLINKO_PROBABILITY/common/view/BallRepresentationNode' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PlayButton = require( 'PLINKO_PROBABILITY/intro/view/PlayButton' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  var allString = require( 'string!PLINKO_PROBABILITY/all' );
  var timesString = '\u00D7'; // multiplication Sign

  /**
   *
   * @param {PlinkoProbabilityIntroModel} model
   * @param {Object} [options]
   * @constructor
   */
  function IntroPlayPanel( model, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        xMargin: 5,
        yMargin: 12,
        stroke: 'black',
        lineWidth: 1,
        minWidth: 0.1,
        titleToControlsVerticalSpace: 5
      },
      options );

    var fontOptions = { font: PlinkoConstants.PANEL_FONT };

    var oneBall = new HBox( {
      spacing: PlinkoConstants.BALL_RADIUS,
      children: [ new BallRepresentationNode( 8 ), new Text( timesString + '1', fontOptions ) ]
    } );
    var tenBalls = new HBox( {
      spacing: PlinkoConstants.BALL_RADIUS,
      children: [ new BallRepresentationNode( 8 ), new Text( timesString + '10', fontOptions ) ]
    } );
    var allBalls = new HBox( {
      spacing: PlinkoConstants.BALL_RADIUS,
      children: [ new BallRepresentationNode( 8 ), new Text( timesString + allString, fontOptions ) ]
    } );

    var ballModeRadioButtons = new VerticalAquaRadioButtonGroup( [
      { node: oneBall, property: model.ballModeProperty, value: 'oneBall' },
      { node: tenBalls, property: model.ballModeProperty, value: 'tenBalls' },
      { node: allBalls, property: model.ballModeProperty, value: 'allBalls' }
    ], {
      radius: 8,
      spacing: 8,
      touchAreaXDilation: 5
    } );

    var playButton = new PlayButton( {
      listener: function() {
        model.trigger( 'PressPlayButton' );
      }
    } );

    var playAndRadioButtonBox = new HBox( {
      spacing: 0,
      children: [
        new HStrut( 20 ),
        playButton,
        new HStrut( 20 ),
        ballModeRadioButtons,
        new HStrut( 10 )
      ]
    } );

    Panel.call( this, playAndRadioButtonBox, options );
  }

  plinkoProbability.register( 'IntroPlayPanel', IntroPlayPanel );

  return inherit( Panel, IntroPlayPanel );
} );
