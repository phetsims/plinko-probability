// Copyright 2002-2014, University of Colorado Boulder

/**
 * View representation of a cylinder used within the Estimation simulation.
 * The cylinder is defined by a position, size, and color.  Some of these
 * attributes may change.
 */
define( function( require ) {
  'use strict';

  // Imports
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  var PERSPECTIVE_TILT = Math.PI / 2; // in radians
  var TOP_CYLINDER_STROKE_COLOR = new Color( 120, 120, 100 );
  var TOP_CYLINDER_FILL_COLOR = new Color( 220, 220, 200 );
  var verticalOffset = 10;

  /**
   *
   * @param {Property.<number>} numberOfRowsProperty
   * @param {Bounds2} bounds
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function CylindersBackNode( numberOfRowsProperty, bounds, modelViewTransform ) {

    Node.call( this );

    var binWidth = bounds.width / (numberOfRowsProperty.value + 1);
    var cylinderWidth = 0.95 * binWidth;
    var ellipseWidth = modelViewTransform.modelToViewDeltaX( cylinderWidth );
    var ellipseHeight = -modelViewTransform.modelToViewDeltaY( cylinderWidth ) * Math.sin( PERSPECTIVE_TILT );
    var topShape = new Shape.ellipse( 0, 0, ellipseWidth / 2, ellipseHeight / 2 );

    var topLayerNode = new Node();
    this.addChild( topLayerNode );

    numberOfRowsProperty.link( function( numberOfRows ) {
      var numberOfTicks = numberOfRows + 1;
      for ( var i = 0; i < numberOfTicks; i++ ) {
        var binCenterX = bounds.minX + bounds.width * (i + 1 / 2) / (numberOfTicks );
        var x = modelViewTransform.modelToViewX( binCenterX );
        var y = modelViewTransform.modelToViewY( bounds.maxY );

        var top = new Path( topShape, {
          fill: TOP_CYLINDER_FILL_COLOR,
          stroke: TOP_CYLINDER_STROKE_COLOR,
          centerX: x,
          top: y + verticalOffset
        } );

        topLayerNode.addChild( top );
      }
    } );

  }

  return inherit( Node, CylindersBackNode );
} );