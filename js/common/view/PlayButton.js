// Copyright 2015, University of Colorado Boulder

/**
 * Play button for starting an action
 *
 * @author Sam Reid
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var RoundButtonView = require( 'SUN/buttons/RoundButtonView' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var PLAY_BUTTON_BASE_COLOR = new Color( 0, 224, 121 ); //light-green hue
  var DEFAULT_RADIUS = PlinkoProbabilityConstants.PLAY_PAUSE_BUTTON_RADIUS;

  /**
   * Play Button constructor
   *
   * @param {Object} [options] node options
   * @constructor
   */
  function PlayButton( options ) {

    options = _.extend( {
      radius: DEFAULT_RADIUS,
      baseColor: PLAY_BUTTON_BASE_COLOR,
      buttonAppearanceStrategy: RoundButtonView.flatAppearanceStrategy
    }, options );

    // play symbol is sized relative to the radius
    var triangleHeight = options.radius;
    var triangleWidth = options.radius * 0.8;

    // create the Path of the triangle
    var playPath = new Path( new Shape().moveTo( 0, triangleHeight / 2 ).lineTo( triangleWidth, 0 ).lineTo( 0, -triangleHeight / 2 ).close(),
      { fill: 'black', pickable: false } );

    // layout
    playPath.centerX = options.radius * 0.05; // move to right slightly since we don't want it exactly centered
    playPath.centerY = 0;

    RoundPushButton.call( this, _.extend( { content: playPath }, options ) );
  }

  plinkoProbability.register( 'PlayButton', PlayButton );

  return inherit( RoundPushButton, PlayButton );
} );