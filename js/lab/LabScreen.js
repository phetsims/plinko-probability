// Copyright 2015-2020, University of Colorado Boulder

/**
 * The 'Lab' screen
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import labHomescreenImage from '../../images/lab-homescreen_png.js';
import labNavbarImage from '../../images/lab-navbar_png.js';
import PlinkoProbabilityConstants from '../common/PlinkoProbabilityConstants.js';
import PlinkoProbabilityKeyboardHelpContent from '../common/view/PlinkoProbabilityKeyboardHelpContent.js';
import plinkoProbability from '../plinkoProbability.js';
import plinkoProbabilityStrings from '../plinkoProbabilityStrings.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

class LabScreen extends Screen {
  constructor() {

    const options = {
      name: plinkoProbabilityStrings.screen.lab,
      backgroundColorProperty: new Property( PlinkoProbabilityConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new ScreenIcon( new Image( labHomescreenImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( labNavbarImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      keyboardHelpNode: new PlinkoProbabilityKeyboardHelpContent()
    };

    super(
      () => new LabModel(),
      model => new LabScreenView( model ),
      options
    );
  }
}

plinkoProbability.register( 'LabScreen', LabScreen );
export default LabScreen;