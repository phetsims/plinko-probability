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
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var DEFAULT_RADIUS = 30;
  var PLAY_BUTTON_BASE_COLOR = '#00E079'; //light-green hue

  /*
   * PlayButton constructor
   *
   * @param {Object} [options] node options
   * @constructor
   */
  function PlayButton( options ) {

    options = _.extend( {
      radius: DEFAULT_RADIUS,
      baseColor: PLAY_BUTTON_BASE_COLOR
    }, options );

    // play symbol is sized relative to the radius
    var triangleHeight = options.radius;
    var triangleWidth = options.radius * 0.8;

    var playPath = new Path( new Shape().
        moveTo( 0, triangleHeight / 2 ).
        lineTo( triangleWidth, 0 ).
        lineTo( 0, -triangleHeight / 2 ).
        close(),
      { fill: 'black' } );

    var playCircle = new Circle( options.radius );
    playPath.centerX = options.radius * 0.05; // move to right slightly since we don't want it exactly centered
    playPath.centerY = 0;
    playCircle.addChild( playPath );

    RoundPushButton.call( this, _.extend( { content: playCircle }, options ) );
  }

  plinkoProbability.register( 'PlayButton', PlayButton );

  return inherit( RoundPushButton, PlayButton );
} );