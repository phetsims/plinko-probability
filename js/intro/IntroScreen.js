// Copyright 2015-2020, University of Colorado Boulder

/**
 * The 'Intro' screen
 *
 * @author Martin Veillette (Berea College)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import introHomescreenImage from '../../images/intro-homescreen_png.js';
import introNavbarImage from '../../images/intro-navbar_png.js';
import PlinkoProbabilityConstants from '../common/PlinkoProbabilityConstants.js';
import plinkoProbabilityStrings from '../plinko-probability-strings.js';
import plinkoProbability from '../plinkoProbability.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

const screenIntroString = plinkoProbabilityStrings.screen.intro;

// image

/**
 * @constructor
 */
function IntroScreen() {

  const options = {
    name: screenIntroString,
    backgroundColorProperty: new Property( PlinkoProbabilityConstants.BACKGROUND_COLOR ),
    homeScreenIcon: new Image( introHomescreenImage ),
    navigationBarIcon: new Image( introNavbarImage )
  };

  Screen.call( this,
    function() { return new IntroModel(); },
    function( model ) { return new IntroScreenView( model ); },
    options );
}

plinkoProbability.register( 'IntroScreen', IntroScreen );

inherit( Screen, IntroScreen );
export default IntroScreen;