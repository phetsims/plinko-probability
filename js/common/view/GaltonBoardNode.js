// Copyright 2002-2015, University of Colorado Boulder

/**
 * View for the Galton Board ( also known as a bean machine). It consists in a triangular lattice of pegs.
 *
 * @author Martin Veillette (Berea College)
 */
define( function ( require ) {
    'use strict';

    // modules
    //var Bounds2 = require( 'DOT/Bounds2' );
    var Circle = require( 'SCENERY/nodes/Circle' );
    var inherit = require( 'PHET_CORE/inherit' );
    var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var RadialGradient = require( 'SCENERY/util/RadialGradient' );
    var Shape = require( 'KITE/Shape' );
    var Vector2 = require( 'DOT/Vector2' );

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

      this.pegPathArray = [];
      this.pegShadowArray = [];
      var pegPath;

      var pegShape = new Shape();
      pegShape.arc( 0, 0, PlinkoConstants.PEG_RADIUS, 2 / 8 * Math.PI + Math.PI / 2, 6 / 8 * Math.PI + Math.PI / 2, true );


      model.galtonBoard.pegs.forEach( function ( peg ) {
        pegPath = new Path( pegShape, {fill: PlinkoConstants.PEG_COLOR} );
        var pegShadow = new Circle( 3 * PlinkoConstants.PEG_RADIUS, {
          fill: new RadialGradient(
            -PlinkoConstants.PEG_RADIUS * 0.2,
            -PlinkoConstants.PEG_RADIUS * 0.2,
            0,
            PlinkoConstants.PEG_RADIUS * 0.1,
            -PlinkoConstants.PEG_RADIUS * 0.3,
            PlinkoConstants.PEG_RADIUS * 1.8
          )
            //.addColorStop( 0, PlinkoConstants.PEG_COLOR )
            //.addColorStop( 0.2, PlinkoConstants.PEG_COLOR )
            //.addColorStop( 1, 'rgba(232, 207, 161, 0 )' )

            .addColorStop( 0, 'rgba(0,0,0,1)' )
            .addColorStop( 0.1809, 'rgba(3,3,3, 0.8191)' )
            .addColorStop( 0.3135, 'rgba(12,12,12, 0.6865)' )
            .addColorStop( 0.4307, 'rgba(28,28,28, 0.5693)' )
            .addColorStop( 0.539, 'rgba(48,48,48, 0.461)' )
            .addColorStop( 0.6412, 'rgba(80,80,80, 0.3588)' )
            .addColorStop( 0.7388, 'rgba(116,116,116, 0.2612)' )
            .addColorStop( 0.8328, 'rgba(158,158,158, 0.1672)' )
            .addColorStop( 0.9217, 'rgba(206,206,206, 0.0783)' )
            .addColorStop( 1, 'rgba(255,255,255, 0.00)' )
        } );
        pegPath.pegPosition = peg.unnormalizedPosition;
        pegShadow.pegPosition = peg.unnormalizedPosition.plus( new Vector2( 0.125, 0.25 ) );
        galtonBoardNode.pegPathArray.push( pegPath );
        galtonBoardNode.pegShadowArray.push( pegShadow );
      } );
      //pegBoard.setChildren( this.pegShadowArray );
      //   pegBoard.setChildren( this.pegPathArray );


      var len = this.pegShadowArray.length;
      for ( var i = 0; i < len; i++ ) {
        this.addChild( this.pegShadowArray[ i ] );
        this.addChild( this.pegPathArray[ i ] );
      }


      model.probabilityProperty.link( function ( newProbability, oldProbability ) {
        var newAngle = newProbability * Math.PI;
        var oldAngle = oldProbability * Math.PI;
        var changeAngle = newAngle - oldAngle;
        galtonBoardNode.pegPathArray.forEach( function ( pegPath ) {
          pegPath.rotateAround( pegPath.center, changeAngle );
        } );
      } );

      model.numberOfRowsProperty.link( function ( numberOfRows ) {
        var visibleNumberOfPegs = (numberOfRows) * (numberOfRows + 1) / 2;
        galtonBoardNode.pegPathArray.forEach( function ( pegPath, index ) {
          pegPath.visible = (index < visibleNumberOfPegs);
          pegPath.center = modelViewTransform.modelToViewPosition( pegPath.pegPosition.componentTimes( {
            x: 2 / (numberOfRows + 1),
            y: -1 / (numberOfRows + 1)
          } ) );
          pegPath.setScaleMagnitude( 26 / numberOfRows );
        } );
        galtonBoardNode.pegShadowArray.forEach( function ( pegPath, index ) {
          pegPath.visible = (index < visibleNumberOfPegs);
          pegPath.center = modelViewTransform.modelToViewPosition( pegPath.pegPosition.componentTimes( {
            x: 2 / (numberOfRows + 1),
            y: -1 / (numberOfRows + 1)
          } ) );
          pegPath.setScaleMagnitude( 26 / numberOfRows );

        } );
      } );

    }

    return inherit( Node, GaltonBoardNode,
      {
        rotatePegs: function ( angle ) {
          this.pegPathArray.forEach( function ( pegPath ) {
            pegPath.rotation( angle );
          } );
        }
      } );

  }
)
;
