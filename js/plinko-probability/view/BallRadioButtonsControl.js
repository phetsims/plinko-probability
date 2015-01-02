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
  var HStrut = require( 'SUN/HStrut' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalAquaRadioButtonGroup = require( 'SUN/VerticalAquaRadioButtonGroup' );
  var VStrut = require( 'SUN/VStrut' );

  var PANEL_OPTION_FONT = {font: new PhetFont( 14 )};
  var PANEL_TITLE_FONT = new PhetFont( 16 );

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
        xMargin: 10,
        yMargin: 10,
        radius: 8,
        lineWidth: 3,
        minWidth: 0.1
      },
      options );

    var showRadioButtons = new VerticalAquaRadioButtonGroup( [
      {node: new Text( ballString, PANEL_OPTION_FONT ), property: showRadioProperty, value: 'ball'},
      {node: new Text( pathString, PANEL_OPTION_FONT ), property: showRadioProperty, value: 'path'},
      {node: new Text( noneString, PANEL_OPTION_FONT ), property: showRadioProperty, value: 'none'}
    ], {radius: options.radius} );

    var showMarkerVBox = new VBox( {
      children: [
        new HStrut( Math.max( 0.1, options.minWidth - 2 * options.xMargin ) ),
        new HBox( {children: [new HStrut( 10 ), showRadioButtons]} )
      ],
      align: 'left'
    } );

    this.addChild( showMarkerVBox );
  }

  return inherit( Node, BallRadioButtonsControl );
} );
