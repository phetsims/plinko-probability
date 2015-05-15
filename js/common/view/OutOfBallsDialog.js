// Copyright 2002-2015, University of Colorado Boulder

/**
 * This type is
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Dialog = require( 'JOIST/Dialog' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LayoutBox = require( 'SCENERY/nodes/LayoutBox' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * Constructor for the.
   *
   * @constructor
   */
  function OutOfBallsDialog() {

    var thisWindow = this;

    var children = new Text( 'Out of Balls' );
    var content = new LayoutBox( { orientation: 'vertical', align: 'center', spacing: 10, children: children } );

    // Define a layout strategy for the spectrum window to set position in global coordinates.  Identical to default
    // layout strategy in Dialog except that it checks for null sim bounds. ChirpNode is expensive in draw time so
    // spectrumWindow is constructed once in MoleculesAndLightScreenView before sim bounds are set to optimize load
    // time.
    var layoutStrategy = function( window, simBounds, screenBounds, scale ) {

      // if simBounds are null, return without setting center.
      if ( simBounds !== null ) {

        // Update the location of the dialog (size is set in Sim.js)
        thisWindow.center = simBounds.center.times( 1.0 / scale );
      }
    };

    Dialog.call( this, content, {
      modal: true,
      hasCloseButton: false,

      // focusable so it can be dismissed
      focusable: true,

      // define strategy to set center and scale
      layoutStrategy: layoutStrategy
    } );

    // close it on a click
    this.addInputListener( new ButtonListener( {
      fire: thisWindow.hide.bind( thisWindow )
    } ) );

  }

  return inherit( Dialog, OutOfBallsDialog );
} );
