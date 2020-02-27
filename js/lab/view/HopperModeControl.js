// Copyright 2015-2020, University of Colorado Boulder

/**
 * Scenery Node that displays three Radio Buttons that control the flow of Balls
 *
 * @author Martin Veillette (Berea College)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import plinkoProbabilityStrings from '../../plinko-probability-strings.js';
import plinkoProbability from '../../plinkoProbability.js';

const ballString = plinkoProbabilityStrings.ball;
const noneString = plinkoProbabilityStrings.none;
const pathString = plinkoProbabilityStrings.path;

// constants
const LABEL_OPTIONS = { font: new PhetFont( 20 ), maxWidth: 175 };

/**
 * @param {Property.<string>} hopperModeProperty - see PlinkoProbabilityCommonModel
 * @param {Object} [options]
 * @constructor
 */
function HopperModeControl( hopperModeProperty, options ) {

  Node.call( this );

  options = merge( {
    radioButtonOptions: { radius: 10 },
    spacing: 12, // vertical separation of the buttons
    touchAreaXDilation: 10
  }, options );

  // create the radio buttons
  const showRadioButtons = new VerticalAquaRadioButtonGroup( hopperModeProperty, [
    { node: new Text( ballString, LABEL_OPTIONS ), value: 'ball' },
    { node: new Text( pathString, LABEL_OPTIONS ), value: 'path' },
    { node: new Text( noneString, LABEL_OPTIONS ), value: 'none' }
  ], options );

  this.addChild( showRadioButtons );
}

plinkoProbability.register( 'HopperModeControl', HopperModeControl );

inherit( Node, HopperModeControl );
export default HopperModeControl;