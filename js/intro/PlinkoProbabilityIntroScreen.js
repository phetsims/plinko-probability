// Copyright 2002-2015, University of Colorado Boulder

/**
 * The main Plinko Probability screen
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
  var PlinkoProbabilityIntroModel = require( 'PLINKO/intro/model/PlinkoProbabilityIntroModel' );
  var PlinkoProbabilityIntroView = require( 'PLINKO/intro/view/PlinkoProbabilityIntroView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  //var plinkoProbabilityScreenString = require( 'string!PLINKO/plinkoProbabilityScreen' );

  var plinkoProbabilityIntroTitleString = require( 'string!PLINKO/plinkoProbabilityIntroTitleScreen' );

  /**
   * Creates the icon for this screen.
   * @returns {Node}
   */
  var createScreenIcon = function() {

    var width = Screen.HOME_SCREEN_ICON_SIZE.width;
    var height = Screen.HOME_SCREEN_ICON_SIZE.height;

    //TODO Intro Icon
    var background = new Rectangle( 0, 0, width, height, { fill: 'white' } );
    return new Node( { children: [ background ] } );

  };

  function PlinkoProbabilityIntroScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.

    Screen.call( this,
      plinkoProbabilityIntroTitleString,
      createScreenIcon(), // no icon, single-screen sim
      function() { return new PlinkoProbabilityIntroModel(); },
      function( model ) { return new PlinkoProbabilityIntroView( model ); }, {
        backgroundColor: PlinkoConstants.BACKGROUND_COLOR
      }
    );
  }

  return inherit( Screen, PlinkoProbabilityIntroScreen );
} );
