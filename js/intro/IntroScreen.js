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
    Screen.call( this,
      screenIntroString,
      new Image( introHomescreenImage ),
      function() { return new IntroModel(); },
      function( model ) { return new IntroScreenView( model ); }, {
        backgroundColor: PlinkoProbabilityConstants.BACKGROUND_COLOR,
        navigationBarIcon: new Image( introNavbarImage )
      }
    );
  }

  plinkoProbability.register( 'IntroScreen', IntroScreen );

  return inherit( Screen, IntroScreen );
} );
