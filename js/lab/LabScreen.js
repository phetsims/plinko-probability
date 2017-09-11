// Copyright 2015-2016, University of Colorado Boulder

/**
 * The 'Lab' screen
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LabModel = require( 'PLINKO_PROBABILITY/lab/model/LabModel' );
  var LabScreenView = require( 'PLINKO_PROBABILITY/lab/view/LabScreenView' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenLabString = require( 'string!PLINKO_PROBABILITY/screen.lab' );

  // image
  var labHomescreenImage = require( 'image!PLINKO_PROBABILITY/lab-homescreen.png' );
  var labNavbarImage = require( 'image!PLINKO_PROBABILITY/lab-navbar.png' );

  /**
   * @constructor
   */
  function LabScreen() {

    var options = {
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

