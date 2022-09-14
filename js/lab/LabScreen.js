// Copyright 2015-2022, University of Colorado Boulder

/**
 * The 'Lab' screen
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import labHomescreen_png from '../../images/labHomescreen_png.js';
import labNavbar_png from '../../images/labNavbar_png.js';
import PlinkoProbabilityConstants from '../common/PlinkoProbabilityConstants.js';
import PlinkoProbabilityKeyboardHelpContent from '../common/view/PlinkoProbabilityKeyboardHelpContent.js';
import plinkoProbability from '../plinkoProbability.js';
import PlinkoProbabilityStrings from '../PlinkoProbabilityStrings.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

class LabScreen extends Screen {
  constructor() {

    const options = {
      name: PlinkoProbabilityStrings.screen.labStringProperty,
      backgroundColorProperty: new Property( PlinkoProbabilityConstants.BACKGROUND_COLOR ),
      homeScreenIcon: new ScreenIcon( new Image( labHomescreen_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      navigationBarIcon: new ScreenIcon( new Image( labNavbar_png ), {
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