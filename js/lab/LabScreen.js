// Copyright 2015-2016, University of Colorado Boulder

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
  var screenLabString = require( 'string!PLINKO_PROBABILITY/screen.lab' );

  // image
  var labHomescreenImage = require( 'image!PLINKO_PROBABILITY/lab-homescreen.png' );
  var labNavbarImage = require( 'image!PLINKO_PROBABILITY/lab-navbar.png' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function LabScreen( options ) {

    options = _.extend( {
      backgroundColor: PlinkoProbabilityConstants.BACKGROUND_COLOR,
      navigationBarIcon: new Image( labNavbarImage )
    }, options );

    Screen.call( this,
      screenLabString,
      new Image( labHomescreenImage ),
      function() { return new LabModel(); },
      function( model ) { return new LabScreenView( model ); },
      options
    );
  }

  plinkoProbability.register( 'LabScreen', LabScreen );

  return inherit( Screen, LabScreen );
} );

