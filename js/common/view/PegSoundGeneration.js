// Copyright 2016-2021, University of Colorado Boulder

/**
 * Sound generator for the for when the balls hit the pegs.
 *
 * @author Denzell Barnett (Berea College)
 * @author Martin Veillette (Berea College)
 */

import Sound from '../../../../vibe/js/Sound.js';
import bonk1Sound from '../../../sounds/bonk-1-for-plinko_mp3.js';
import bonk2Sound from '../../../sounds/bonk-2-for-plinko_mp3.js';
import plinkoProbability from '../../plinkoProbability.js';
import PlinkoProbabilityConstants from '../PlinkoProbabilityConstants.js';

class PegSoundGeneration {
  /**
   * @param {Property.<boolean>} isSoundEnabledProperty
   */
  constructor( isSoundEnabledProperty ) {

    // Audio for ball hitting pegs
    this.bonk1Sound = new Sound( bonk1Sound );  // @private
    this.bonk2Sound = new Sound( bonk2Sound );  // @private
    this.soundTimeElapsed = 0;  // @private - number used to keep track of the last sound playing
    this.isSoundEnabledProperty = isSoundEnabledProperty; // @private
  }


  // @public
  reset() {
    this.soundTimeElapsed = 0;
  }

  /**
   * @param {number} dt - change in time
   * @public
   */
  step( dt ) {
    this.soundTimeElapsed += dt;
  }

  /**
   * Play sound that depends on the direction of the ball
   *
   * @param {string} direction - acceptable values are 'left' and 'right'
   * @public
   */
  playBallHittingPegSound( direction ) {

    assert && assert( direction === 'left' || direction === 'right', 'direction should be left or right' );

    // play sound if the previous sound was played more than some elapsed time
    if ( this.isSoundEnabledProperty.get() && ( this.soundTimeElapsed > PlinkoProbabilityConstants.SOUND_TIME_INTERVAL ) ) {

      // will play sound based on ball's motion, left or right
      ( direction === 'left' ) ? this.bonk1Sound.play() : this.bonk2Sound.play();
      this.soundTimeElapsed = 0; // reset the time elapsed since last sound to zero
    }
  }
}

plinkoProbability.register( 'PegSoundGeneration', PegSoundGeneration );

export default PegSoundGeneration;