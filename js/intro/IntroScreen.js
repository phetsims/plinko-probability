// Copyright 2015-2017, University of Colorado Boulder

/**
 * The 'Intro' screen
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const IntroModel = require( 'PLINKO_PROBABILITY/intro/model/IntroModel' );
  const IntroScreenView = require( 'PLINKO_PROBABILITY/intro/view/IntroScreenView' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenIntroString = require( 'string!PLINKO_PROBABILITY/screen.intro' );

  // image
  const introHomescreenImage = require( 'image!PLINKO_PROBABILITY/intro-homescreen.png' );
  const introNavbarImage = require( 'image!PLINKO_PROBABILITY/intro-navbar.png' );

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

  return inherit( Screen, IntroScreen );
} );
