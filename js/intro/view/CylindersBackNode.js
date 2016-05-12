// Copyright 2015, University of Colorado Boulder

/**
 * View representation of the back cylinders (the top part) used within the Plinko Probability Simulation
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
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
    var topShape = Shape.ellipse( 0, 0, ellipseWidth / 2, ellipseHeight / 2 );

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

  plinkoProbability.register( 'CylindersBackNode', CylindersBackNode );

  return inherit( Node, CylindersBackNode );
} );