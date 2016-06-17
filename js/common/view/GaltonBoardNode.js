// Copyright 2014-2015, University of Colorado Boulder

/**
 * View for the Galton Board ( also known as a bean machine). It consists in a triangular lattice of pegs.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
    'use strict';

    // modules
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
          openingAngle: Math.PI / 2, //  opening angle of the pegs
          rangeRotationAngle: Math.PI / 2 // range of rotation of the peg, when going from binaryProbability 0 to 1.
        },
        options );

      var galtonBoardNode = this;
      Node.call( this );

      // create and add a pegShadow Layer, so the peg shadows can be a on separate z-layer.
      var pegShadowLayer = new Node();
      this.addChild( pegShadowLayer );

      // the peg orientation should be facing up when the probability is 50%
      var leftArcAngle = -Math.PI / 2 + options.rangeRotationAngle * (probabilityProperty.value - 0.5) - options.openingAngle / 2;
      var rightArcAngle = -Math.PI / 2 + options.rangeRotationAngle * (probabilityProperty.value - 0.5) + options.openingAngle / 2;

      // create the shape of the peg , a disk with a segment removed, the segment removed spans an angle of options.openingAngle
      var pegShape = new Shape().arc( 0, 0, PlinkoConstants.PEG_RADIUS, leftArcAngle, rightArcAngle, true );

      var pegArray = []; // this array will contain the pegShadows, pegPaths and the peg (from the GaltonBoard model)

      // for each peg, let's create a peg Path and a peg Shadow
      galtonBoard.pegs.forEach( function( peg ) {
        var pegPath = new Path( pegShape, { fill: PlinkoConstants.PEG_COLOR } );
        var pegShadow = new Circle( 1.4 * PlinkoConstants.PEG_RADIUS, {
          fill: new RadialGradient(
            PlinkoConstants.PEG_RADIUS * 0.3,
            PlinkoConstants.PEG_RADIUS * 0.5,
            0,
            PlinkoConstants.PEG_RADIUS * 0.1,
            -PlinkoConstants.PEG_RADIUS * 0.6,
            PlinkoConstants.PEG_RADIUS * 1.4
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

        // push all pegPath and pegShadow into an array, as well a peg model, which has two attributes, position and isVisible
        pegArray.push( { pegPath: pegPath, pegShadow: pegShadow, modelPeg: peg } );
      } );

      // add all the peg paths and peg shadows to this node.
      // put the peg shadows on a separate layer so that they can appear behind z-layer-wise
      pegArray.forEach( function( peg ) {
        galtonBoardNode.addChild( peg.pegPath );
        pegShadowLayer.addChild( peg.pegShadow );
      } );

      // no need to unlink since it is present for the lifetime of the simulation
      // this handle the rotation of the pegs
      probabilityProperty.lazyLink( function( newProbability, oldProbability ) {
          var newAngle = newProbability * options.rangeRotationAngle;
          var oldAngle = oldProbability * options.rangeRotationAngle;
          var changeAngle = newAngle - oldAngle;
          pegArray.forEach( function( peg ) {
            if (peg.modelPeg.isVisible) {
              peg.pegPath.rotateAround( peg.pegPath.center, changeAngle );
            }
          } );
      } );

      // no need to unlink since it is present for the lifetime of the simulation
      numberOfRowsProperty.link( function( numberOfRows ) {
        var pegSpacing = PegInterface.getSpacing( numberOfRows );
        // offset the center of the shadow with respect to the peg, a bit below and to the left, empirically determined
        var offsetVector = new Vector2( pegSpacing * 0.08, -pegSpacing * 0.24 );

        pegArray.forEach( function( peg ) {
          peg.pegPath.visible = peg.modelPeg.isVisible;
          peg.pegShadow.visible = peg.modelPeg.isVisible;
          if (peg.pegPath.visible) {
            peg.pegPath.center = modelViewTransform.modelToViewPosition( peg.modelPeg.position );
            peg.pegShadow.center = modelViewTransform.modelToViewPosition( peg.modelPeg.position.plus( offsetVector ) );
            peg.pegPath.setScaleMagnitude( PlinkoConstants.ROWS_RANGE.max / numberOfRows );
            peg.pegShadow.setScaleMagnitude( PlinkoConstants.ROWS_RANGE.max / numberOfRows );
          }
        } );

      } );

    }

    plinkoProbability.register( 'GaltonBoardNode', GaltonBoardNode );

    return inherit( Node, GaltonBoardNode );

  }
)
;
