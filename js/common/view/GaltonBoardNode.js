// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the Galton Board ( also known as a bean machine). It consists in a triangular lattice of pegs.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
    'use strict';

    // modules
    //var Bounds2 = require( 'DOT/Bounds2' );
    var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
    var Circle = require( 'SCENERY/nodes/Circle' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var PegInterface = require( 'PLINKO_PROBABILITY/common/model/PegInterface' );
    var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
    var RadialGradient = require( 'SCENERY/util/RadialGradient' );
    var Shape = require( 'KITE/Shape' );
    var Vector2 = require( 'DOT/Vector2' );

    /**
     *
     * @param {GaltonBoard} galtonBoard
     * @param {Property.<number>} numberOfRowsProperty - an integer
     * @param {Property.<number>} probabilityProperty - a number ranging from 0 to 1
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Object} [options]
     * @constructor
     */
    function GaltonBoardNode( galtonBoard, numberOfRowsProperty, probabilityProperty, modelViewTransform, options ) {

      options = _.extend( {
          openingAngle: Math.PI / 2 //  opening angle of the pegs
        },
        options );

      var galtonBoardNode = this;
      Node.call( this );

      var pegBoard = new Node();
      this.addChild( pegBoard );

      this.pegPathArray = [];
      this.pegShadowArray = [];
      var pegPath;

      var pegShape = new Shape();
      pegShape.arc( 0, 0, PlinkoConstants.PEG_RADIUS * 1.19, Math.PI - options.openingAngle / 2, Math.PI + options.openingAngle / 2, true );

      galtonBoard.pegs.forEach( function( peg ) {
        pegPath = new Path( pegShape, { fill: PlinkoConstants.PEG_COLOR } );
        var pegShadow = new Circle( 2 * PlinkoConstants.PEG_RADIUS, {
          fill: new RadialGradient(
            -PlinkoConstants.PEG_RADIUS * 0.2,
            -PlinkoConstants.PEG_RADIUS * 0.2,
            0,
            PlinkoConstants.PEG_RADIUS * 0.1,
            -PlinkoConstants.PEG_RADIUS * 0.3,
            PlinkoConstants.PEG_RADIUS * 1.5
          )
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
        pegPath.peg = peg;
        pegShadow.peg = peg;
        galtonBoardNode.pegPathArray.push( pegPath );
        galtonBoardNode.pegShadowArray.push( pegShadow );
      } );

      var len = this.pegShadowArray.length;
      for ( var i = 0; i < len; i++ ) {
        this.addChild( this.pegShadowArray[ i ] );
        this.addChild( this.pegPathArray[ i ] );
      }

      // no need to unlink since it is present for the lifetime of the simulation
      probabilityProperty.link( function( newProbability, oldProbability ) {
        var newAngle = newProbability * Math.PI;
        var oldAngle = oldProbability * Math.PI;
        var changeAngle = newAngle - oldAngle;
        galtonBoardNode.pegPathArray.forEach( function( pegPath ) {
          pegPath.rotateAround( pegPath.center, changeAngle );
        } );
      } );

      // no need to unlink since it is present for the lifetime of the simulation
      numberOfRowsProperty.link( function( numberOfRows ) {
        var pegSpacing = PegInterface.getSpacing( numberOfRows );
        var offsetVector = new Vector2( pegSpacing * 0.08, -pegSpacing * 0.24 );

        galtonBoardNode.pegPathArray.forEach( function( pegPath, index ) {
          pegPath.visible = pegPath.peg.isVisible;
          pegPath.center = modelViewTransform.modelToViewPosition( pegPath.peg.position );
          pegPath.setScaleMagnitude( 26 / numberOfRows );
        } );

        galtonBoardNode.pegShadowArray.forEach( function( pegPath, index ) {
          pegPath.visible = pegPath.peg.isVisible;
          pegPath.center = modelViewTransform.modelToViewPosition( pegPath.peg.position.plus( offsetVector ) );
          pegPath.setScaleMagnitude( 26 / numberOfRows );
        } );
      } );

    }

    plinkoProbability.register( 'GaltonBoardNode', GaltonBoardNode );

    return inherit( Node, GaltonBoardNode );

  }
)
;
