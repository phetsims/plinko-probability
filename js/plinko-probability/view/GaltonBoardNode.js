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
    var Circle = require( 'SCENERY/nodes/Circle' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var RadialGradient = require( 'SCENERY/util/RadialGradient' );
    var Shape = require( 'KITE/Shape' );


    // constants
    var PEG_RADIUS = 5; // radius of the Ball.
    var PEG_COLOR = 'blue';
    var BOARD_BOUNDS = new Bounds2( 100, 100, 600, 600 );

    /**
     * Constructor for the ChargedParticleNode which renders the charge as a scenery node.
     * @param {model} model of the simulation
     * @param {} chargedParticle : the model of the charged particle
     * @param {ModelViewTransform2} modelViewTransform the coordinate transform between model coordinates and view coordinates
     * @constructor
     */
    function GaltonBoardNode( model ) {

      var galtonBoardNode = this;
      Node.call( this );


      var pegBoard = new Node();
      this.addChild( pegBoard );
      //var maxNumberOfRows = model.numberOfRows;

      var maxNumberOfRows = model.maxNumberOfRows;

      //var angle = model.probability * Math.PI / 2 + 0 * Math.PI / 2;

      var boardWidth = BOARD_BOUNDS.width;
      var boardHeight = BOARD_BOUNDS.height;
      var boardCenterTop = BOARD_BOUNDS.centerTop;
      var horizontalSpacing = boardWidth / maxNumberOfRows;
      var verticalSpacing = boardWidth / maxNumberOfRows;

      var x;
      var y;
      var i;
      var rowNumber;
      this.pegPathArray = [];
      var pegShape;
      var pegPath;
      for ( rowNumber = 0; rowNumber < maxNumberOfRows; rowNumber++ ) {
        for ( i = -rowNumber; i < rowNumber; i += 2 ) {
          x = i * horizontalSpacing;
          y = rowNumber * verticalSpacing;
          pegShape = new Shape();
          pegShape.arc( x, y, PEG_RADIUS, 1 / 2 * Math.PI, 3 / 2 * Math.PI, true );
          pegPath = new Path( pegShape, {fill: 'red'} );
          this.pegPathArray.push( pegPath );
        }
      }
      this.pegPathArray.forEach( function( pegPath ) {
        pegBoard.addChild( pegPath );
      } );

      galtonBoardNode.translate( boardCenterTop.x, boardCenterTop.y );

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
        var totalNumberOfPegs = galtonBoardNode.pegPathArray.length;
        var i;
        for ( i = 0; i < totalNumberOfPegs; i++ ) {
          if ( i < visibleNumberOfPegs ) {
            galtonBoardNode.pegPathArray[i].visible = true;
            //  galtonBoardNode.scale( 1.1 );

          }
          else {
            galtonBoardNode.pegPathArray[i].visible = false;
          }
        }
        pegBoard.setScaleMagnitude( 20 / numberOfRows );
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
