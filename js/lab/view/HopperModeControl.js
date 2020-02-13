// Copyright 2015-2020, University of Colorado Boulder

/**
 * Scenery Node that displays three Radio Buttons that control the flow of Balls
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  const ballString = require( 'string!PLINKO_PROBABILITY/ball' );
  const noneString = require( 'string!PLINKO_PROBABILITY/none' );
  const pathString = require( 'string!PLINKO_PROBABILITY/path' );

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
      touchAreaDilation: 10
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

  return inherit( Node, HopperModeControl );
} );

