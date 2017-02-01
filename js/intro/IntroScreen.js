// Copyright 2015-2016, University of Colorado Boulder

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
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var screenIntroString = require( 'string!PLINKO_PROBABILITY/screen.intro' );

  // image
  var introHomescreenImage = require( 'image!PLINKO_PROBABILITY/intro-homescreen.png' );
  var introNavbarImage = require( 'image!PLINKO_PROBABILITY/intro-navbar.png' );

  /**
   * @constructor
   */
  function IntroScreen() {

    var options = {
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
