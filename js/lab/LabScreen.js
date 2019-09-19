// Copyright 2015-2017, University of Colorado Boulder

/**
 * The 'Lab' screen
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const LabModel = require( 'PLINKO_PROBABILITY/lab/model/LabModel' );
  const LabScreenView = require( 'PLINKO_PROBABILITY/lab/view/LabScreenView' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenLabString = require( 'string!PLINKO_PROBABILITY/screen.lab' );

  // image
  const labHomescreenImage = require( 'image!PLINKO_PROBABILITY/lab-homescreen.png' );
  const labNavbarImage = require( 'image!PLINKO_PROBABILITY/lab-navbar.png' );

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

  return inherit( Screen, LabScreen );
} );

