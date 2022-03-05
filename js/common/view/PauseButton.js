// Copyright 2016-2022, University of Colorado Boulder

/**
 * Pause button for stopping the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Martin Veillette
 */

import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { Path } from '../../../../scenery/js/imports.js';
import RoundPushButton from '../../../../sun/js/buttons/RoundPushButton.js';
import plinkoProbability from '../../plinkoProbability.js';
import PlinkoProbabilityConstants from '../PlinkoProbabilityConstants.js';

class PauseButton extends RoundPushButton {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
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

    assert && assert( !options.content, 'PauseButton sets content' );
    options.content = iconNode;

    super( options );
  }
}

plinkoProbability.register( 'PauseButton', PauseButton );
export default PauseButton;