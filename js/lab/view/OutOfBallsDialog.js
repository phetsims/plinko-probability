// Copyright 2016-2021, University of Colorado Boulder

/**
 * Dialog that displays the 'Out of balls!' message.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Text } from '../../../../scenery/js/imports.js';
import Dialog from '../../../../sun/js/Dialog.js';
import plinkoProbability from '../../plinkoProbability.js';
import PlinkoProbabilityStrings from '../../PlinkoProbabilityStrings.js';

class OutOfBallsDialog extends Dialog {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      xSpacing: 45,
      topMargin: 33,
      bottomMargin: 33
    }, options );

    const messageNode = new Text( PlinkoProbabilityStrings.outOfBalls, {
      font: new PhetFont( 33 ),
      maxWidth: 350
    } );

    super( messageNode, options );
  }
}

plinkoProbability.register( 'OutOfBallsDialog', OutOfBallsDialog );
export default OutOfBallsDialog;