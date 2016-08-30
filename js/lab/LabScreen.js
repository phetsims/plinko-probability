// Copyright 2015, University of Colorado Boulder

/**
 * The 'Lab' screen
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var LabModel = require( 'PLINKO_PROBABILITY/lab/model/LabModel' );
  var LabScreenView = require( 'PLINKO_PROBABILITY/lab/view/LabScreenView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var plinkoProbabilityLabTitleScreenString = require( 'string!PLINKO_PROBABILITY/plinkoProbabilityLabTitleScreen' );

  // image
  var homescreenIconImage = require( 'image!PLINKO_PROBABILITY/lab-homescreen-icon.png' );
  var navbarIconImage = require( 'image!PLINKO_PROBABILITY/lab-navbar-icon.png' );

  /**
   * @constructor
   */
  function LabScreen() {
    Screen.call( this,
      plinkoProbabilityLabTitleScreenString,
      new Image( homescreenIconImage ),
      function() {
        return new LabModel(); },
      function( model ) {
        return new LabScreenView( model ); }, {
        backgroundColor: PlinkoProbabilityConstants.BACKGROUND_COLOR,
        navigationBarIcon: new Image( navbarIconImage )
      }
    );
  }

  plinkoProbability.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );

