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
  var Panel = require( 'SUN/Panel' );
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
      focusable: true // so it can be dismissed
    }, options );

    var messageNode = new Text( outOfBallsString, {
      font: new PhetFont( 25 ),
      maxWidth: 350
    } );

    // WORKAROUND: An intermediate panel is needed to work around a problem that occurs when using
    // xMargin and yMargin options for Dialog. See https://github.com/phetsims/joist/issues/346
    var dialogContent = new Panel( messageNode, {
      fill: null,
      stroke: null,
      xMargin: 40,
      yMargin: 30
    } );

    Dialog.call( this, dialogContent, options );
  }

  plinkoProbability.register( 'OutOfBallsDialog', OutOfBallsDialog );

  return inherit( Dialog, OutOfBallsDialog );
} );
