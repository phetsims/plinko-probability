// Copyright 2014-2016, University of Colorado Boulder

/**
 * Pause button for stopping the sim.
 *
 * @author Sam Reid
 * @author Martin Veillette
 */

define( function( require ) {
  'use strict';

  // modules
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RoundButtonView = require( 'SUN/buttons/RoundButtonView' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );

  /**
   * @param {Object} [options] node options
   * @constructor
   */
  function PauseButton( options ) {

    options = _.extend( {
      radius: PlinkoProbabilityConstants.PLAY_PAUSE_BUTTON_RADIUS,
      baseColor: 'red',
      barColor: 'black',
      buttonAppearanceStrategy: RoundButtonView.flatAppearanceStrategy
    }, options );

    // pause symbols are sized relative to the radius
    var barWidth = options.radius * 0.2;
    var barHeight = options.radius;

    var createBar = function() {
      return new Rectangle( 0, 0, barWidth, barHeight, { fill: options.barColor } );
    };

    var pausePath = new HBox( {
      children: [ createBar(), createBar() ],
      spacing: barWidth
    } );

    RoundPushButton.call( this, _.extend( { content: pausePath }, options ) );
  }

  plinkoProbability.register( 'PauseButton', PauseButton );

  return inherit( RoundPushButton, PauseButton );
} );