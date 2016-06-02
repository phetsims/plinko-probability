// Copyright 2015, University of Colorado Boulder

/**
 * View representation of the back cylinders (the top part) used within the Plinko Probability Simulation
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var BinInterface = require( 'PLINKO_PROBABILITY/common/model/BinInterface' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var Shape = require( 'KITE/Shape' );


  /**
   *
   * @param {Property.<number>} numberOfRowsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Object} cylinderInfo - Contains cylinder info: height, width, offset, ellipseHeight
   * @constructor
   */
  function CylindersBackNode( numberOfRowsProperty, modelViewTransform, cylinderInfo ) {

    Node.call( this );

    var ellipseWidth = modelViewTransform.modelToViewDeltaX( cylinderInfo.cylinderWidth );
    var ellipseHeight = Math.abs( modelViewTransform.modelToViewDeltaY( cylinderInfo.ellipseHeight ) );

    var topShape = Shape.ellipse( 0, 0, ellipseWidth / 2, ellipseHeight / 2 );

    var verticalOffset = -modelViewTransform.modelToViewDeltaY( cylinderInfo.verticalOffset );

    var topLayerNode = new Node();
    this.addChild( topLayerNode );

    numberOfRowsProperty.link( function( numberOfRows ) {
      assert && assert( Number.isInteger( numberOfRows ), 'numberOfRows must be an integer' );
      var numberOfTicks = numberOfRows + 1;
      for ( var i = 0; i < numberOfTicks; i++ ) {
        var binCenterX = BinInterface.getBinCenterX( i, numberOfTicks );
        var x = modelViewTransform.modelToViewX( binCenterX );
        var y = modelViewTransform.modelToViewY( cylinderInfo.top );

        var top = new Path( topShape, {
          fill: PlinkoConstants.TOP_CYLINDER_FILL_COLOR,
          stroke: PlinkoConstants.TOP_CYLINDER_STROKE_COLOR,
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