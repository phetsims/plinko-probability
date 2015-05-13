// Copyright 2002-2015, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play Button and three radio buttons .
 *
 */
define( function( require ) {
  'use strict';

  // imports
  var BallRepresentationNode = require( 'PLINKO_PROBABILITY/common/view/BallRepresentationNode' );
  //var HStrut = require( 'SUN/HStrut' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var PlayButton = require( 'PLINKO_PROBABILITY/intro/view/PlayButton' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  //var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  //var VStrut = require( 'SUN/VStrut' );

  // strings
  var allString = require( 'string!PLINKO_PROBABILITY/all' );
  var timesString = '\u00D7'; // multiplication Sign

  /**
   *
   * @param {Function} listener
   * @param {Property.<String>} ballModeProperty
   * @param {Object} [options]
   * @constructor
   */
  function PlayPanel( isPlayingProperty, ballModeProperty, options ) {

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
      { node: oneBall, property: ballModeProperty, value: 'oneBall' },
      { node: tenBalls, property: ballModeProperty, value: 'tenBalls' },
      { node: allBalls, property: ballModeProperty, value: 'allBalls' }
    ], { radius: 8 } );

    var playButton = new PlayButton( {
      listener: function() {
        isPlayingProperty.set( !isPlayingProperty.value );
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
