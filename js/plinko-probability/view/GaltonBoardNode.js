// Copyright 2002-2015, University of Colorado Boulder

/**
 * View for the Galton Board ( also known as a bean machine). It consists in a triangular lattice of pegs.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
    'use strict';

    // modules

    //  var Bounds2 = require( 'DOT/Bounds2' );
    //   var Circle = require( 'SCENERY/nodes/Circle' );
    var inherit = require( 'PHET_CORE/inherit' );
    var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
//    var RadialGradient = require( 'SCENERY/util/RadialGradient' );
    var Shape = require( 'KITE/Shape' );


    // constants

    /**
     * @param {PlinkoProbabilityModel} model
     * @param {ModelViewTransform2} modelViewTransform
     * @constructor
     */
    function GaltonBoardNode( model, modelViewTransform ) {

      var galtonBoardNode = this;
      Node.call( this );

      var pegBoard = new Node();
      this.addChild( pegBoard );

      //var maxNumberOfRows = model.maxNumberOfRows;

      //var boardWidth = BOARD_BOUNDS.width;
      //var boardHeight = BOARD_BOUNDS.height;
      //var boardCenterTop = BOARD_BOUNDS.centerTop;
      //var horizontalSpacing = boardWidth / maxNumberOfRows;
      //var verticalSpacing = boardWidth / maxNumberOfRows;

      this.pegPathArray = [];
      var pegPath;

      var pegShape = new Shape();
      pegShape.arc( 0, 0, PlinkoConstants.PEG_RADIUS, 2 / 8 * Math.PI + Math.PI / 2, 6 / 8 * Math.PI + Math.PI / 2, true );

      model.galtonBoard.pegs.forEach( function( peg ) {
        pegPath = new Path( pegShape, {fill: PlinkoConstants.PEG_COLOR, center: modelViewTransform.modelToViewPosition( peg.position )} );
        galtonBoardNode.pegPathArray.push( pegPath );
      } );

      pegBoard.setChildren( this.pegPathArray );

      model.probabilityProperty.link( function( newProbability, oldProbability ) {
        var newAngle = newProbability * Math.PI;
        var oldAngle = oldProbability * Math.PI;
        var changeAngle = newAngle - oldAngle;
        galtonBoardNode.pegPathArray.forEach( function( pegPath ) {
          pegPath.rotateAround( pegPath.center, changeAngle );
        } );
      } );

      model.numberOfRowsProperty.link( function( numberOfRows ) {
        var visibleNumberOfPegs = (numberOfRows) * (numberOfRows + 1) / 2;
        //var i;
        galtonBoardNode.pegPathArray.forEach( function( pegPath, index ) {
          pegPath.visible = (index < visibleNumberOfPegs) ? true : false;
        } );

        //     pegBoard.setScaleMagnitude( 20 / visibleNumberOfRows );
      } );

    }

    return inherit( Node, GaltonBoardNode,
      {
        rotatePegs: function( angle ) {
          this.pegPathArray.forEach( function( pegPath ) {
            pegPath.rotation( angle );
          } );
        }
      } );

  }
)
;
