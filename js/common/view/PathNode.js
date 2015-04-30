// Copyright 2002-2015, University of Colorado Boulder

/**
 * Scenery node for the path through the Galton board.
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var Shape = require( 'KITE/Shape' );

  /**
   * Constructor for the which renders the charge as a scenery node.
   * @param {Ball} ball - model of the ball
   * @param {PlinkoProbabilityModel} model
   * @param {ModelViewTransform2} modelViewTransform - the coordinate transform between model coordinates and view coordinates
   * @constructor
   */
  function PathNode( ball, model, modelViewTransform ) {

    //var pathNode = this;

    Node.call( this );

    //  create the representation for a ball
    var pathOptions = {
      stroke: PlinkoConstants.BALL_COLOR,
      lineWidth: 2
    };

    var shape = new Shape();

    shape.moveToPoint( ball.pegHistory[ 0 ].position );

    ball.pegHistory.forEach( function( peg ) {
      shape.lineToPoint( peg.position );
    } );

    this.addChild( new Path( modelViewTransform.modelToViewShape( shape ), pathOptions ) );

  }

  return inherit( Node, PathNode );
} );