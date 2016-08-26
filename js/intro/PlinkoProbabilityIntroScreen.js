// Copyright 2015, University of Colorado Boulder

/**
 * The 'Intro' screen
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityIntroModel = require( 'PLINKO_PROBABILITY/intro/model/PlinkoProbabilityIntroModel' );
  var PlinkoProbabilityIntroView = require( 'PLINKO_PROBABILITY/intro/view/PlinkoProbabilityIntroView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var plinkoProbabilityIntroTitleScreenString = require( 'string!PLINKO_PROBABILITY/plinkoProbabilityIntroTitleScreen' );

  // image
  var homescreenIconImage = require( 'image!PLINKO_PROBABILITY/intro-homescreen-icon.png' );
  var navbarIconImage = require( 'image!PLINKO_PROBABILITY/intro-navbar-icon.png' );

  function PlinkoProbabilityIntroScreen() {
    Screen.call( this,
      plinkoProbabilityIntroTitleScreenString,
      new Image( homescreenIconImage ),
      function() { return new PlinkoProbabilityIntroModel(); },
      function( model ) { return new PlinkoProbabilityIntroView( model ); }, {
        backgroundColor: PlinkoConstants.BACKGROUND_COLOR,
        navigationBarIcon: new Image( navbarIconImage )
      }
    );
  }

  plinkoProbability.register( 'PlinkoProbabilityIntroScreen', PlinkoProbabilityIntroScreen );

  return inherit( Screen, PlinkoProbabilityIntroScreen );
} );
