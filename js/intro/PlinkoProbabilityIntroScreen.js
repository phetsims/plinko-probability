// Copyright 2015, University of Colorado Boulder

/**
 * The main Plinko Probability Intro screen
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityIntroModel = require( 'PLINKO_PROBABILITY/intro/model/PlinkoProbabilityIntroModel' );
  var PlinkoProbabilityIntroView = require( 'PLINKO_PROBABILITY/intro/view/PlinkoProbabilityIntroView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var plinkoProbabilityIntroTitleScreenString = require( 'string!PLINKO_PROBABILITY/plinkoProbabilityIntroTitleScreen' );

  // image
  var homescreenIconImage = require( 'image!PLINKO_PROBABILITY/intro-homescreen-icon.png' );
  var navbarIconImage = require( 'image!PLINKO_PROBABILITY/intro-navbar-icon.png' );

  function PlinkoProbabilityIntroScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.

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
