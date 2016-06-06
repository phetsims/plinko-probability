// Copyright 2015, University of Colorado Boulder

/**
 * The main Plinko Probability Intro screen
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var PlinkoProbabilityIntroModel = require( 'PLINKO_PROBABILITY/intro/model/PlinkoProbabilityIntroModel' );
  var PlinkoProbabilityIntroView = require( 'PLINKO_PROBABILITY/intro/view/PlinkoProbabilityIntroView' );
  //var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var plinkoProbabilityIntroTitleScreenString = require( 'string!PLINKO_PROBABILITY/plinkoProbabilityIntroTitleScreen' );

  // image
  var containerDOMImage = require( 'image!PLINKO_PROBABILITY/container.png' );

  /**
   * Creates the icon for this screen.
   * @returns {Node}
   */
  var createScreenIcon = function() {

    //var width = Screen.HOME_SCREEN_ICON_SIZE.width;
    //var height = Screen.HOME_SCREEN_ICON_SIZE.height;

    //TODO Lab Icon
    //var background = new Rectangle( 0, 0, width, height, { fill: 'white' } );
    var background = new Image( containerDOMImage );
    return new Node( { children: [ background ] } );

  };

  function PlinkoProbabilityIntroScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.

    Screen.call( this,
      plinkoProbabilityIntroTitleScreenString,
      createScreenIcon(), // no icon, single-screen sim
      function() { return new PlinkoProbabilityIntroModel(); },
      function( model ) { return new PlinkoProbabilityIntroView( model ); }, {
        backgroundColor: PlinkoConstants.BACKGROUND_COLOR
      }
    );
  }

  plinkoProbability.register( 'PlinkoProbabilityIntroScreen', PlinkoProbabilityIntroScreen );

  return inherit( Screen, PlinkoProbabilityIntroScreen );
} );
