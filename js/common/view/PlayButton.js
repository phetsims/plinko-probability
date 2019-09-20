// Copyright 2015-2019, University of Colorado Boulder

/**
 * Play button for starting an action
 *
 * @author Sam Reid
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Path = require( 'SCENERY/nodes/Path' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  const RoundPushButton = require( 'SUN/buttons/RoundPushButton' );
  const Shape = require( 'KITE/Shape' );

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
    const triangleHeight = options.radius;
    const triangleWidth = options.radius * 0.8;

    const triangleShape = new Shape()
      .moveTo( 0, triangleHeight / 2 )
      .lineTo( triangleWidth, 0 )
      .lineTo( 0, -triangleHeight / 2 )
      .close();

    const triangleNode = new Path( triangleShape, {
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