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
  var IntroModel = require( 'PLINKO_PROBABILITY/intro/model/IntroModel' );
  var IntroScreenView = require( 'PLINKO_PROBABILITY/intro/view/IntroScreenView' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var plinkoProbabilityIntroTitleScreenString = require( 'string!PLINKO_PROBABILITY/plinkoProbabilityIntroTitleScreen' );

  // image
  var homescreenIconImage = require( 'image!PLINKO_PROBABILITY/intro-homescreen-icon.png' );
  var navbarIconImage = require( 'image!PLINKO_PROBABILITY/intro-navbar-icon.png' );

  /**
   * @constructor
   */
  function IntroScreen() {
    Screen.call( this,
      plinkoProbabilityIntroTitleScreenString,
      new Image( homescreenIconImage ),
      function() { return new IntroModel(); },
      function( model ) { return new IntroScreenView( model ); }, {
        backgroundColor: PlinkoProbabilityConstants.BACKGROUND_COLOR,
        navigationBarIcon: new Image( navbarIconImage )
      }
    );
  }

  plinkoProbability.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );
