// Copyright 2016-2017, University of Colorado Boulder

/**
 * Pause button for stopping the sim.
 *
 * @author Sam Reid
 * @author Martin Veillette
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
  function PauseButton( options ) {

    options = _.extend( {
      radius: PlinkoProbabilityConstants.PLAY_PAUSE_BUTTON_RADIUS,
      baseColor: 'red',
      iconColor: 'black',
      buttonAppearanceStrategy: PlinkoProbabilityConstants.PLAY_PAUSE_BUTTON_APPEARANCE_STRATEGY
    }, options );

    // pause symbol is sized relative to the radius
    const barWidth = options.radius * 0.2;
    const barHeight = options.radius;

    const iconShape = new Shape()
      .rect( 0, 0, barWidth, barHeight )
      .rect( 2 * barWidth, 0, barWidth, barHeight );

    const iconNode = new Path( iconShape, {
      fill: options.iconColor
    } );

    assert && assert( !options.content );
    options.content = iconNode;
    
    RoundPushButton.call( this, options );
  }

  plinkoProbability.register( 'PauseButton', PauseButton );

  return inherit( RoundPushButton, PauseButton );
} );