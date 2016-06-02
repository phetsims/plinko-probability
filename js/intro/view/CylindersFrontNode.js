// Copyright 2015, University of Colorado Boulder

/**
 * View representation of the front cylinders (the side part) used within the Plinko Probability Simulation
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var BinInterface = require( 'PLINKO_PROBABILITY/common/model/BinInterface' );
  // constants
  var SIDE_CYLINDER_STROKE_COLOR = new Color( 120, 120, 100 );
  var BASE_COLOR = new Color( 171, 189, 196, 0.5 ); // must be of type Color

  /**
   *
   * @param {Property.<number>} numberOfRowsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} cylinderInfo - Contains cylinder info: height, width, offset, ellipseHeight
   * @constructor
   */
  function CylindersFrontNode( numberOfRowsProperty, modelViewTransform, cylinderInfo ) {
    var VERTICAL_OFFSET = -modelViewTransform.modelToViewDeltaY( cylinderInfo.verticalOffset );
    Node.call( this );

    var ellipseWidth = modelViewTransform.modelToViewDeltaX( cylinderInfo.cylinderWidth );
    var ellipseHeight = -modelViewTransform.modelToViewDeltaY( cylinderInfo.ellipseHeight );
    var cylinderHeight = -modelViewTransform.modelToViewDeltaY( cylinderInfo.height );

    var sideShape = new Shape();
    sideShape.moveTo( -ellipseWidth / 2, 0 )
      .lineTo( -ellipseWidth / 2, cylinderHeight )
      .ellipticalArc( 0, 0, ellipseWidth / 2, ellipseHeight / 2, 0, Math.PI, 0, true )
      .lineTo( ellipseWidth / 2, 0 )
      .ellipticalArc( 0, cylinderHeight, ellipseWidth / 2, ellipseHeight / 2, 0, 0, Math.PI, false )
      .close();


    var sideFill = new LinearGradient( -ellipseWidth / 2, 0, ellipseWidth / 2, 0 ).addColorStop( 0.0, BASE_COLOR.colorUtilsDarker( 0.7 ) ).addColorStop( 0.5, BASE_COLOR ).addColorStop( 1, BASE_COLOR.colorUtilsBrighter( 0.5 ) );

    var sideLayerNode = new Node();
    this.addChild( sideLayerNode );


    numberOfRowsProperty.link( function( numberOfRows ) {
      var numberOfTicks = numberOfRows + 1;
      for ( var i = 0; i < numberOfTicks; i++ ) {
        var binCenterX = BinInterface.getBinCenterX( i, numberOfTicks );
        var x = modelViewTransform.modelToViewX( binCenterX );
        var y = modelViewTransform.modelToViewY( cylinderInfo.top );


        var side = new Path( sideShape, {
          fill: sideFill,
          stroke: SIDE_CYLINDER_STROKE_COLOR,
          centerX: x,
          top: y + VERTICAL_OFFSET + ellipseHeight / 2
        } );


        sideLayerNode.addChild( side );
      }
    } );

  }

  plinkoProbability.register( 'CylindersFrontNode', CylindersFrontNode );

  return inherit( Node, CylindersFrontNode );
} );