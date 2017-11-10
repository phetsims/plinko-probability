// Copyright 2015-2017, University of Colorado Boulder

/**
 * Play button for starting an action
 *
 * @author Sam Reid
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  var Shape = require( 'KITE/Shape' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function PlayButton( options ) {

    options = _.extend( {
      radius: PlinkoProbabilityConstants.PLAY_PAUSE_BUTTON_RADIUS,
      baseColor: 'rgb( 0, 224, 121 )', // light green
      iconColor: 'black',
      buttonAppearanceStrategy: PlinkoProbabilityConstants.PLAY_PAUSE_BUTTON_APPEARANCE_STRATEGY
    }, options );

    // triangle is sized relative to the radius
    var triangleHeight = options.radius;
    var triangleWidth = options.radius * 0.8;

    var triangleShape = new Shape()
      .moveTo( 0, triangleHeight / 2 )
      .lineTo( triangleWidth, 0 )
      .lineTo( 0, -triangleHeight / 2 )
      .close();

    var triangleNode = new Path( triangleShape, {
      fill: options.iconColor
    } );

    // move to right slightly, since we don't want it exactly centered
    options.xContentOffset = 0.1 * triangleNode.width;

    assert && assert( !options.content );
    options.content = triangleNode;

    RoundPushButton.call( this, options );
  }

  plinkoProbability.register( 'PlayButton', PlayButton );

  return inherit( RoundPushButton, PlayButton );
} );