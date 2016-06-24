// Copyright 2014-2015, University of Colorado Boulder

/**
 * Sound generator for the for when the balls hit the pegs.
 *
 * @author Denzell Barnett (Berea College)
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Sound = require( 'VIBE/Sound' );

  // audio
  var bonk1Audio = require( 'audio!PLINKO_PROBABILITY/bonk-1-for-plinko' );
  var bonk2Audio = require( 'audio!PLINKO_PROBABILITY/bonk-2-for-plinko' );

  /**
   * @param {Property.<boolean>} isSoundEnabledProperty
   * @constructor
   */
  function PegSoundGeneration( isSoundEnabledProperty ) {
    // Audio for ball hitting pegs
    this.bonk1Sound = new Sound( bonk1Audio );  // @private
    this.bonk2Sound = new Sound( bonk2Audio );  // @private
    this.soundTimeElapsed = 0;  // @private - number used to keep track of the last sound playing
    this.isSoundEnabledProperty = isSoundEnabledProperty; // @private
  }

  plinkoProbability.register( 'PegSoundGeneration', PegSoundGeneration );

  return inherit( Object, PegSoundGeneration, {

    /**
     * Reset of the model attributes.
     * @public
     */
    reset: function() {
      this.soundTimeElapsed = 0;
    },

    /**
     * interates through view based on dt
     * @param {number} dt - change in time
     * @public
     */
    step: function( dt ) {
      this.soundTimeElapsed += dt;
    },

    /**
     * Play sound that depends on the direction of the ball
     * @param {string} direction - acceptable values are 'left' and 'right'
     * @public
     */
    playBallHittingPegSound: function( direction ) {
      assert && assert( direction === 'left' || direction === 'right', 'direction should be left or right' );
      // play sound if the previous sound was played more than some elapsed time
      if ( this.isSoundEnabledProperty.value && (this.soundTimeElapsed > PlinkoConstants.SOUND_TIME_INTERVAL) ) {
        // will play sound based on ball's motion, left or right
        ( direction === 'left') ? this.bonk1Sound.play() : this.bonk2Sound.play();
        this.soundTimeElapsed = 0; // reset the time elapsed since last sound to zero
      }
    }

  } );
} );