// Copyright 2014-2015, University of Colorado Boulder

/**
 * Pause button for stopping the sim.
 *
 * @author Sam Reid
 * @author Martin Veillette
 */

define( function( require ) {
  'use strict';

  // modules
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RoundButtonView = require( 'SUN/buttons/RoundButtonView' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );

  // constants
  var DEFAULT_RADIUS = PlinkoProbabilityConstants.PLAY_PAUSE_BUTTON_RADIUS;
  var PAUSE_BUTTON_BASE_COLOR = new Color( 255, 0, 0 ); //red

  /**
   * @param {Object} [options] node options
   * @constructor
   */
  function PauseButton( options ) {

    options = _.extend( {
      radius: DEFAULT_RADIUS,
      baseColor: PAUSE_BUTTON_BASE_COLOR,
      buttonAppearanceStrategy: RoundButtonView.flatAppearanceStrategy
    }, options );

    // pause symbols are sized relative to the radius
    var barWidth = options.radius * 0.2;
    var barHeight = options.radius;

    var bar = function() { return new Rectangle( 0, 0, barWidth, barHeight, { fill: 'black' } ); };
    var bar1 = bar();
    var bar2 = bar();
    var pausePath = new HBox( { children: [ bar1, bar2 ], spacing: barWidth, pickable: false} );

    // layout
    pausePath.centerX = 0;
    pausePath.centerY = 0;

    RoundPushButton.call( this, _.extend( { content: pausePath }, options ) );
  }

  plinkoProbability.register( 'PauseButton', PauseButton );

  return inherit( RoundPushButton, PauseButton );
} );