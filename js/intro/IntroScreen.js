// Copyright 2015-2020, University of Colorado Boulder

/**
 * The 'Intro' screen
 *
 * @author Martin Veillette (Berea College)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import introHomescreenImage from '../../images/intro-homescreen_png.js';
import introNavbarImage from '../../images/intro-navbar_png.js';
import PlinkoProbabilityConstants from '../common/PlinkoProbabilityConstants.js';
import PlinkoProbabilityKeyboardHelpContent from '../common/view/PlinkoProbabilityKeyboardHelpContent.js';
import plinkoProbability from '../plinkoProbability.js';
import plinkoProbabilityStrings from '../plinkoProbabilityStrings.js';
import IntroModel from './model/IntroModel.js';
import IntroScreenView from './view/IntroScreenView.js';

class IntroScreen extends Screen {
  constructor() {

    const options = {
      name: plinkoProbabilityStrings.screen.intro,
      backgroundColorProperty: new Property( PlinkoProbabilityConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new ScreenIcon( new Image( introHomescreenImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( introNavbarImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      keyboardHelpNode: new PlinkoProbabilityKeyboardHelpContent()
    };

    super(
      () => new IntroModel(),
      model => new IntroScreenView( model ),
      options
    );
  }
}

plinkoProbability.register( 'IntroScreen', IntroScreen );
export default IntroScreen;