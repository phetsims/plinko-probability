// Copyright 2015-2019, University of Colorado Boulder

/**
 * The 'Lab' screen
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import Image from '../../../scenery/js/nodes/Image.js';
import labHomescreenImage from '../../images/lab-homescreen_png.js';
import labNavbarImage from '../../images/lab-navbar_png.js';
import PlinkoProbabilityConstants from '../common/PlinkoProbabilityConstants.js';
import plinkoProbabilityStrings from '../plinko-probability-strings.js';
import plinkoProbability from '../plinkoProbability.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

const screenLabString = plinkoProbabilityStrings.screen.lab;

// image

/**
 * @constructor
 */
function LabScreen() {

  const options = {
    name: screenLabString,
    backgroundColorProperty: new Property( PlinkoProbabilityConstants.BACKGROUND_COLOR ),
    homeScreenIcon: new Image( labHomescreenImage ),
    navigationBarIcon: new Image( labNavbarImage )
  };

  Screen.call( this,
    function() { return new LabModel(); },
    function( model ) { return new LabScreenView( model ); },
    options
  );
}

plinkoProbability.register( 'LabScreen', LabScreen );

inherit( Screen, LabScreen );
export default LabScreen;