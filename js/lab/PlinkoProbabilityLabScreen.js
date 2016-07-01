// Copyright 2015, University of Colorado Boulder

/**
 * The main Plinko Probability Lab screen
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityLabModel = require( 'PLINKO_PROBABILITY/lab/model/PlinkoProbabilityLabModel' );
  var PlinkoProbabilityLabView = require( 'PLINKO_PROBABILITY/lab/view/PlinkoProbabilityLabView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var plinkoProbabilityLabTitleScreenString = require( 'string!PLINKO_PROBABILITY/plinkoProbabilityLabTitleScreen' );

  // image
  var homescreenIconImage = require( 'image!PLINKO_PROBABILITY/lab-homescreen-icon.png' );
  var navbarIconImage = require( 'image!PLINKO_PROBABILITY/lab-navbar-icon.png' );

  function PlinkoProbabilityLabScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.

    Screen.call( this,
      plinkoProbabilityLabTitleScreenString,
      new Image( homescreenIconImage ),
      function() { return new PlinkoProbabilityLabModel(); },
      function( model ) { return new PlinkoProbabilityLabView( model ); }, {
        backgroundColor: PlinkoConstants.BACKGROUND_COLOR,
        navigationBarIcon: new Image( navbarIconImage )
      }
    );
  }

  plinkoProbability.register( 'PlinkoProbabilityLabScreen', PlinkoProbabilityLabScreen );

  return inherit( Screen, PlinkoProbabilityLabScreen );
} );
