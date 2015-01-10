// Copyright 2002-2015, University of Colorado Boulder

/**
 * The main Plinko Probability Lab screen
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
  var PlinkoProbabilityLabModel = require( 'PLINKO/lab/model/PlinkoProbabilityLabModel' );
  var PlinkoProbabilityLabView = require( 'PLINKO/lab/view/PlinkoProbabilityLabView' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var plinkoProbabilityLabTitleString = require( 'string!PLINKO/plinkoProbabilityLabTitleScreen' );

  /**
   * Creates the icon for this screen.
   * @returns {Node}
   */
  var createScreenIcon = function() {

    var width = Screen.HOME_SCREEN_ICON_SIZE.width;
    var height = Screen.HOME_SCREEN_ICON_SIZE.height;

    //TODO Lab Icon
    var background = new Rectangle( 0, 0, width, height, {fill: 'white'} );
    return new Node( {children: [background]} );

  };

  function PlinkoProbabilityLabScreen() {

    //If this is a single-screen sim, then no icon is necessary.
    //If there are multiple screens, then the icon must be provided here.

    Screen.call( this,
      plinkoProbabilityLabTitleString,
      createScreenIcon(), // no icon, single-screen sim
      function() { return new PlinkoProbabilityLabModel(); },
      function( model ) { return new PlinkoProbabilityLabView( model ); }, {
        backgroundColor: PlinkoConstants.BACKGROUND_COLOR
      }
    );
  }

  return inherit( Screen, PlinkoProbabilityLabScreen );
} );
