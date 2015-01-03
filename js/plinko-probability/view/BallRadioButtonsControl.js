// Copyright 2002-2013, University of Colorado Boulder

/**
 * Control panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // imports
  // var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );

  // strings
  var ballString = require( 'string!PLINKO/ball' );
  var pathString = require( 'string!PLINKO/path' );
  var noneString = require( 'string!PLINKO/none' );

  /**
   *
   * @param showRadioProperty
   * @param options
   * @constructor
   */
  function BallRadioButtonsControl( showRadioProperty, options ) {

    Node.call( this );
    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        spacing: 10, // vertical separation of the buttons
        padding: 3, // horizontal padding
        radius: 8 //radius of the circle of the Radio Button
      },
      options );

    var showRadioButtons = new VerticalAquaRadioButtonGroup( [
      {node: new Text( ballString, {font: PlinkoConstants.TEXT_FONT} ), property: showRadioProperty, value: 'ball'},
      {node: new Text( pathString, {font: PlinkoConstants.TEXT_FONT} ), property: showRadioProperty, value: 'path'},
      {node: new Text( noneString, {font: PlinkoConstants.TEXT_FONT} ), property: showRadioProperty, value: 'none'}
    ], options );

    this.addChild( showRadioButtons );
  }

  return inherit( Node, BallRadioButtonsControl );
} );
