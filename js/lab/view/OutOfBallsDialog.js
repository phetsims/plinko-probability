// Copyright 2016-2020, University of Colorado Boulder

/**
 * Dialog that displays the 'Out of balls!' message.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Dialog from '../../../../sun/js/Dialog.js';
import plinkoProbabilityStrings from '../../plinkoProbabilityStrings.js';
import plinkoProbability from '../../plinkoProbability.js';

const outOfBallsString = plinkoProbabilityStrings.outOfBalls;

/**
 * @param {Object} [options]
 * @constructor
 */
function OutOfBallsDialog( options ) {

  options = merge( {
    xSpacing: 45,
    topMargin: 33,
    bottomMargin: 33
  }, options );

  const messageNode = new Text( outOfBallsString, {
    font: new PhetFont( 33 ),
    maxWidth: 350
  } );

  Dialog.call( this, messageNode, options );
}

plinkoProbability.register( 'OutOfBallsDialog', OutOfBallsDialog );

inherit( Dialog, OutOfBallsDialog );
export default OutOfBallsDialog;