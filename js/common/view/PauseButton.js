// Copyright 2016-2017, University of Colorado Boulder

/**
 * Pause button for stopping the sim.
 *
 * @author Sam Reid
 * @author Martin Veillette
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
  function PauseButton( options ) {

    options = _.extend( {
      radius: PlinkoProbabilityConstants.PLAY_PAUSE_BUTTON_RADIUS,
      baseColor: 'red',
      iconColor: 'black',
      buttonAppearanceStrategy: PlinkoProbabilityConstants.PLAY_PAUSE_BUTTON_APPEARANCE_STRATEGY
    }, options );

    // pause symbol is sized relative to the radius
    var barWidth = options.radius * 0.2;
    var barHeight = options.radius;

    var iconShape = new Shape()
      .rect( 0, 0, barWidth, barHeight )
      .rect( 2 * barWidth, 0, barWidth, barHeight );

    var iconNode = new Path( iconShape, {
      fill: options.iconColor
    } );

    assert && assert( !options.content );
    options.content = iconNode;
    
    RoundPushButton.call( this, options );
  }

  plinkoProbability.register( 'PauseButton', PauseButton );

  return inherit( RoundPushButton, PauseButton );
} );