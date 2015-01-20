// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base type for histogram, displays a 2D grid and axes.
 *
 */
define( function( require ) {
  'use strict';

  // modules

  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  //----------------------------------------------------------------------------------------
  // constants
  //----------------------------------------------------------------------------------------

  // background

  var GRID_BACKGROUND_FILL = 'white';
  var GRID_BACKGROUND_LINE_WIDTH = '0.5';
  var GRID_BACKGROUND_STROKE = 'gray';

  // grid

  var MINOR_GRID_LINE_WIDTH = 0.5;
  var MINOR_GRID_LINE_COLOR = 'rgb( 240, 240, 240 )';
  var MAJOR_GRID_LINE_WIDTH = 1.0;
  var MAJOR_GRID_LINE_COLOR = 'rgb( 192, 192, 192 )';

  // axes

  var AXIS_COLOR = 'black';
  var AXIS_EXTENT = 0.0; // how far the line extends past the min/max ticks, in model coordinates

  // labels
  var AXIS_LABEL_FONT = new PhetFont( 18 );
  var AXIS_LABEL_COLOR = 'black'; // space between end of axis and label

  // ticks
  var MINOR_TICK_LENGTH = 3; // how far a minor tick extends from the axis
  var MINOR_TICK_LINE_WIDTH = 0.5;
  var MINOR_TICK_COLOR = 'black';
  var MAJOR_TICK_LENGTH = 6; // how far a major tick extends from the axis
  var MAJOR_TICK_LINE_WIDTH = 1;
  var MAJOR_TICK_COLOR = 'black';
  var MAJOR_TICK_FONT = new PhetFont( 16 );
  var TICK_LABEL_SPACING = 2;
  var MINUS_SIGN_WIDTH = new Text( '\u2212', { font: MAJOR_TICK_FONT } ).width;

  var SMALL_EPSILON = 0.0000001; // for equalEpsilon check


  //----------------------------------------------------------------------------------------
  // major tick with label, orientation is vertical or horizontal
  //----------------------------------------------------------------------------------------

  // Tick is placed at (x,y) and is either vertical or horizontal.
  function MajorTickNode( x, y, value, isVertical ) {

    Node.call( this );

    // tick line
    var tickLineNode = new Path( isVertical ?
                                 Shape.lineSegment( x, y - MAJOR_TICK_LENGTH, x, y + MAJOR_TICK_LENGTH ) :
                                 Shape.lineSegment( x - MAJOR_TICK_LENGTH, y, x + MAJOR_TICK_LENGTH, y ), {
      stroke: MAJOR_TICK_COLOR,
      lineWidth: MAJOR_TICK_LINE_WIDTH
    } );
    this.addChild( tickLineNode );

    // tick label
    var tickLabelNode = new Text( value, { font: MAJOR_TICK_FONT, fill: MAJOR_TICK_COLOR } );
    this.addChild( tickLabelNode );

    // label position
    if ( isVertical ) {
      // center label under line, compensate for minus sign
      var signXOffset = ( value < 0 ) ? -( MINUS_SIGN_WIDTH / 2 ) : 0;
      tickLabelNode.left = tickLineNode.centerX - ( tickLabelNode.width / 2 ) + signXOffset;
      tickLabelNode.top = tickLineNode.bottom + TICK_LABEL_SPACING;
    }
    else {
      // center label to left of line
      tickLabelNode.right = tickLineNode.left - TICK_LABEL_SPACING;
      tickLabelNode.centerY = tickLineNode.centerY;
    }
  }

  inherit( Node, MajorTickNode );

  //----------------------------------------------------------------------------------------
  // minor tick mark, no label, orientation is vertical or horizontal
  //----------------------------------------------------------------------------------------

  // Tick is placed at (x,y) and is either vertical or horizontal
  function MinorTickNode( x, y, isVertical ) {
    Path.call( this, isVertical ?
                     Shape.lineSegment( x, y - MINOR_TICK_LENGTH, x, y + MINOR_TICK_LENGTH ) :
                     Shape.lineSegment( x - MINOR_TICK_LENGTH, y, x + MINOR_TICK_LENGTH, y ), {
      lineWidth: MINOR_TICK_LINE_WIDTH,
      stroke: MINOR_TICK_COLOR
    } );
  }

  inherit( Path, MinorTickNode );

  //----------------------------------------------------------------------------------------
  // x-axis (horizontal)
  //----------------------------------------------------------------------------------------

  /**
   * @param {Graph} graph
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function XAxisNode( graph, modelViewTransform ) {

    Node.call( this );

    // horizontal line
    var tailLocation = new Vector2( modelViewTransform.modelToViewX( graph.xRange.min - AXIS_EXTENT ), modelViewTransform.modelToViewY( graph.yRange.min ) );
    var tipLocation = new Vector2( modelViewTransform.modelToViewX( graph.xRange.max + AXIS_EXTENT ), modelViewTransform.modelToViewY( graph.yRange.min ) );
    var lineNode = new Line( tailLocation.x, tailLocation.y, tipLocation.x, tipLocation.y, {
      fill: AXIS_COLOR,
      stroke: 'black'
    } );
    this.addChild( lineNode );

    // ticks
    var tickSeparation = 1;
    var numberOfTicks = tickSeparation.numberOfTicks;

    for ( var i = 0; i < numberOfTicks; i++ ) {
      var modelX = tickSeparation.startPositionTick + tickSeparation.minorTickSpacing * i;
      var x = modelViewTransform.modelToViewX( modelX );
      var y = modelViewTransform.modelToViewY( graph.yRange.min );

      if ( Math.abs( modelX / tickSeparation.minorTickSpacing ) % (tickSeparation.minorTicksPerMajor) < SMALL_EPSILON ) {
        // major tick
        this.addChild( new MajorTickNode( x, y, Util.toFixed( modelX, tickSeparation.decimalPlaces ), true ) );
      }
      else {
        // minor tick
        this.addChild( new MinorTickNode( x, y, true ) );
      }

    }
  }

  inherit( Node, XAxisNode );

  //----------------------------------------------------------------------------------------
  // y-axis (vertical)
  //----------------------------------------------------------------------------------------

  /**
   * @param {Graph} graph
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function YAxisNode( graph, modelViewTransform ) {

    Node.call( this );

    // vertical line
    var tailLocation = new Vector2( modelViewTransform.modelToViewX( graph.xRange.min ), modelViewTransform.modelToViewY( graph.yRange.min - AXIS_EXTENT ) );
    var tipLocation = new Vector2( modelViewTransform.modelToViewX( graph.xRange.min ), modelViewTransform.modelToViewY( graph.yRange.max + AXIS_EXTENT ) );
    var lineNode = new Line( tailLocation.x, tailLocation.y, tipLocation.x, tipLocation.y, {
      fill: AXIS_COLOR,
      stroke: 'black'
    } );
    this.addChild( lineNode );

    // ticks

    var tickSeparation = tickSpacing( graph.yRange );
    var numberOfTicks = tickSeparation.numberOfTicks;

    for ( var i = 0; i < numberOfTicks; i++ ) {
      var modelY = tickSeparation.startPositionTick + tickSeparation.minorTickSpacing * i;

      var x = modelViewTransform.modelToViewX( graph.xRange.min );
      var y = modelViewTransform.modelToViewY( modelY );
      if ( Math.abs( modelY / tickSeparation.minorTickSpacing ) % (tickSeparation.minorTicksPerMajor) < SMALL_EPSILON ) {
        // major tick
        this.addChild( new MajorTickNode( x, y, Util.toFixed( modelY, tickSeparation.decimalPlaces ), false ) );
      }
      else {
        // no minor ticks
        //    this.addChild( new MinorTickNode( x, y, false ) );
      }
    }

  }

  inherit( Node, YAxisNode );

  //----------------------------------------------------------------------------------------
//  X label
//----------------------------------------------------------------------------------------

  /**
   * @param {Graph} graph
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function XLabelNode( graph, modelViewTransform ) {

    Node.call( this );

    var centerX = modelViewTransform.modelToViewX( (graph.xRange.min + graph.xRange.max) / 2 );
    var bottom = modelViewTransform.modelToViewY( graph.yRange.min );
    var xLabelNode = new Text( graph.xAxisTitle, { font: AXIS_LABEL_FONT, fill: AXIS_LABEL_COLOR, centerX: centerX, bottom: bottom + 50 } );
    this.addChild( xLabelNode );
  }

  inherit( Node, XLabelNode );

  //----------------------------------------------------------------------------------------
//  Y label
//----------------------------------------------------------------------------------------

  /**
   * @param {Graph} graph
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function YLabelNode( graph, modelViewTransform ) {

    Node.call( this );

    var centerY = modelViewTransform.modelToViewY( (graph.yRange.min + graph.yRange.max) / 2 );
    var left = modelViewTransform.modelToViewX( graph.xRange.min );
    var yLabelNode = new Text( graph.yAxisTitle, {
      font: AXIS_LABEL_FONT,
      fill: AXIS_LABEL_COLOR,
      centerY: centerY,
      left:     left - 50,
      rotation: -Math.PI / 2   //remember down is positive in the view
    } );
    this.addChild( yLabelNode );
  }

  inherit( Node, YLabelNode );

  //----------------------------------------------------------------------------------------
// 2D Background
//----------------------------------------------------------------------------------------

  /**
   * @param {Graph} graph
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BackgroundNode( graph, modelViewTransform ) {
    Node.call( this );

    var backgroundNode = new Rectangle(
      modelViewTransform.modelToViewX( graph.xRange.min ),
      modelViewTransform.modelToViewY( graph.yRange.max ),
      modelViewTransform.modelToViewDeltaX( graph.xRange.getLength() ),
      modelViewTransform.modelToViewDeltaY( -graph.yRange.getLength() ),
      { fill: GRID_BACKGROUND_FILL, lineWidth: GRID_BACKGROUND_LINE_WIDTH, stroke: GRID_BACKGROUND_STROKE } );
    this.addChild( backgroundNode );

  }

  inherit( Node, BackgroundNode );


  /**
   *
   * @param numberOfRowsProperty
   * @param verticalScaleProperty
   * @param histogram
   * @param modelViewTransform
   * @param histogramVisibleProperty
   * @constructor
   */
  function HistogramNode( numberOfRowsProperty, verticalScaleProperty, histogram, modelViewTransform, histogramVisibleProperty ) {

    Node.call( this, {
        children: [
          new BackgroundNode( modelViewTransform ),
          new XAxisNode( numberOfRowsProperty, modelViewTransform ),
          new YAxisNode( verticalScaleProperty, modelViewTransform ),
          new XLabelNode( numberOfRowsProperty, modelViewTransform ),
          new YLabelNode( verticalScaleProperty, modelViewTransform ),
          new HistogramBarNode( histogram, modelViewTransform )
        ]
      }
    );
  }

  return inherit( Node, HistogramNode );
} )
;