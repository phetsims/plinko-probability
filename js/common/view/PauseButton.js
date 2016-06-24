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
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RoundPushButton = require( 'SUN/buttons/RoundPushButton' );

  // constants
  var DEFAULT_RADIUS = PlinkoConstants.PLAY_PAUSE_BUTTON_RADIUS;

  /**
   * @param {Object} [options] node options
   * @constructor
   */
  function PauseButton( options ) {

    options = _.extend( {
      radius: DEFAULT_RADIUS
    }, options );

    // pause symbols are sized relative to the radius
    var barWidth = options.radius * 0.2;
    var barHeight = options.radius;


    var bar = function() { return new Rectangle( 0, 0, barWidth, barHeight, { fill: 'black' } ); };
    var bar1 = bar();
    var bar2 = bar();
    var pausePath = new HBox( { children: [ bar1, bar2 ], spacing: barWidth } );

    // put the pause symbols inside a circle
    var pausedCircle = new Circle( options.radius );
    pausePath.centerX = 0;
    pausePath.centerY = 0;
    pausedCircle.addChild( pausePath );

    RoundPushButton.call( this, _.extend( { content: pausedCircle }, options ) );
  }

  plinkoProbability.register( 'PauseButton', PauseButton );

  return inherit( RoundPushButton, PauseButton );
} );