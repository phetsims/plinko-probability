// Copyright 2015-2021, University of Colorado Boulder

/**
 * Scenery Node that displays three Radio Buttons that control the flow of Balls
 *
 * @author Martin Veillette (Berea College)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import plinkoProbability from '../../plinkoProbability.js';
import plinkoProbabilityStrings from '../../plinkoProbabilityStrings.js';

const ballString = plinkoProbabilityStrings.ball;
const noneString = plinkoProbabilityStrings.none;
const pathString = plinkoProbabilityStrings.path;

// constants
const LABEL_OPTIONS = { font: new PhetFont( 20 ), maxWidth: 175 };

class HopperModeControl extends Node {
  /**
   * @param {Property.<string>} hopperModeProperty - see PlinkoProbabilityCommonModel
   * @param {Object} [options]
   */
  constructor( hopperModeProperty, options ) {

    super();

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
}

plinkoProbability.register( 'HopperModeControl', HopperModeControl );

export default HopperModeControl;