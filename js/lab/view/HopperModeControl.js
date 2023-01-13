// Copyright 2015-2022, University of Colorado Boulder

/**
 * Scenery Node that displays three Radio Buttons that control the flow of Balls
 *
 * @author Martin Veillette (Berea College)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Text } from '../../../../scenery/js/imports.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import plinkoProbability from '../../plinkoProbability.js';
import PlinkoProbabilityStrings from '../../PlinkoProbabilityStrings.js';

const ballString = PlinkoProbabilityStrings.ball;
const noneString = PlinkoProbabilityStrings.none;
const pathString = PlinkoProbabilityStrings.path;

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
      { createNode: () => new Text( ballString, LABEL_OPTIONS ), value: 'ball' },
      { createNode: () => new Text( pathString, LABEL_OPTIONS ), value: 'path' },
      { createNode: () => new Text( noneString, LABEL_OPTIONS ), value: 'none' }
    ], options );

    this.addChild( showRadioButtons );
  }
}

plinkoProbability.register( 'HopperModeControl', HopperModeControl );

export default HopperModeControl;