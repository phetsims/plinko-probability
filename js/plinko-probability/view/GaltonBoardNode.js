// Copyright 2002-2014, University of Colorado Boulder

/**
 * View for the Galton Board ( also known as a bean machine). It consists in a triangular lattice of pegs
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
    'use strict';

    // modules

    var Bounds2 = require( 'DOT/Bounds2' );
    //   var Circle = require( 'SCENERY/nodes/Circle' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
//    var RadialGradient = require( 'SCENERY/util/RadialGradient' );
    var Shape = require( 'KITE/Shape' );


    // constants
    var PEG_RADIUS = 5; // radius of the Ball.
    var PEG_COLOR = 'blue';
    var BOARD_BOUNDS = new Bounds2( 100, 100, 500, 500 );

    /**
     * @param {model} model of the simulation
     * @constructor
     */
    function GaltonBoardNode( model, mvt ) {

      var galtonBoardNode = this;
      Node.call( this );

      var pegBoard = new Node();
      this.addChild( pegBoard );

      var maxNumberOfRows = model.maxNumberOfRows;

      var boardWidth = BOARD_BOUNDS.width;
      var boardHeight = BOARD_BOUNDS.height;
      var boardCenterTop = BOARD_BOUNDS.centerTop;
      var horizontalSpacing = boardWidth / maxNumberOfRows;
      var verticalSpacing = boardWidth / maxNumberOfRows;

      this.pegPathArray = [];
      var pegPath;

      var pegShape = new Shape();
      pegShape.arc( 0, 0, PEG_RADIUS, 1 / 2 * Math.PI, 3 / 2 * Math.PI, true );

      model.galtonBoard.pegs.forEach( function( peg ) {
        pegPath = new Path( pegShape, {fill: PEG_COLOR, center: mvt.modelToViewPosition( peg.position )} );
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
        var visibleNumberOfRows = Math.floor( numberOfRows ); // rows must be an integer;
        var visibleNumberOfPegs = (visibleNumberOfRows) * (visibleNumberOfRows + 1) / 2;
        var i;
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
