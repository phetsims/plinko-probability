// Copyright 2016, University of Colorado Boulder

/**
 * Dialog that displays the 'Out of balls!' message.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dialog = require( 'JOIST/Dialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var outOfBallsString = require( 'string!PLINKO_PROBABILITY/outOfBalls' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function OutOfBallsDialog( options ) {

    options = _.extend( {
      modal: true,
      xMargin: 60,
      yMargin: 50
    }, options );

    var messageNode = new Text( outOfBallsString, {
      font: new PhetFont( 25 ),
      maxWidth: 350
    } );

    Dialog.call( this, messageNode, options );
  }

  plinkoProbability.register( 'OutOfBallsDialog', OutOfBallsDialog );

  return inherit( Dialog, OutOfBallsDialog );
} );
