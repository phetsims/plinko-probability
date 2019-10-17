// Copyright 2016-2019, University of Colorado Boulder

/**
 * Dialog that displays the 'Out of balls!' message.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Dialog = require( 'SUN/Dialog' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const outOfBallsString = require( 'string!PLINKO_PROBABILITY/outOfBalls' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function OutOfBallsDialog( options ) {

    options = merge( {
      xSpacing: 30,
      topMargin: 25,
      bottomMargin: 25
    }, options );

    const messageNode = new Text( outOfBallsString, {
      font: new PhetFont( 25 ),
      maxWidth: 350
    } );

    Dialog.call( this, messageNode, options );
  }

  plinkoProbability.register( 'OutOfBallsDialog', OutOfBallsDialog );

  return inherit( Dialog, OutOfBallsDialog );
} );
