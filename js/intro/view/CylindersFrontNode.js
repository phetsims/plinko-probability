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
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );

  // constants
  var PERSPECTIVE_TILT = Math.PI / 1.4; // in radians
  var SIDE_CYLINDER_STROKE_COLOR = new Color( 120, 120, 100 );
  var BASE_COLOR = new Color( 171, 189, 196, 0.5 ); // must be of type Color
  var VERTICAL_OFFSET = 10;

  /**
   *
   * @param {Property.<number>} numberOfRowsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function CylindersFrontNode( numberOfRowsProperty, modelViewTransform ) {

    Node.call( this );
    var bounds = PlinkoConstants.CYLINDER_BOUNDS;
    var binWidth = bounds.width / (numberOfRowsProperty.value + 1);
    var cylinderWidth = 0.95 * binWidth;
    var height = 0.74 * bounds.height;
    var ellipseWidth = modelViewTransform.modelToViewDeltaX( cylinderWidth );
    var ellipseHeight = -modelViewTransform.modelToViewDeltaY( cylinderWidth ) * Math.sin( PERSPECTIVE_TILT );
    var cylinderHeight = -modelViewTransform.modelToViewDeltaY( height );

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
        var binCenterX = bounds.minX + bounds.width * (i + 1 / 2) / (numberOfTicks );
        var x = modelViewTransform.modelToViewX( binCenterX );
        var y = modelViewTransform.modelToViewY( bounds.maxY );


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