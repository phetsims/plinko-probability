// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base type for histogram, displays a 2D grid and axes.
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
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
  var GRID_BACKGROUND_LINE_WIDTH = 0.5;
  var GRID_BACKGROUND_STROKE = 'gray';

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
  var MAJOR_TICK_SPACING = 1;
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
   * @param {Property.<number>} numberOfRowsProperty
   * @param {Bounds2} bounds
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function XAxisNode( bounds, modelViewTransform ) {

    Node.call( this );

    // horizontal line
    var tailLocation = new Vector2( modelViewTransform.modelToViewX( bounds.minX - AXIS_EXTENT ), modelViewTransform.modelToViewY( bounds.minY ) );
    var tipLocation = new Vector2( modelViewTransform.modelToViewX( bounds.maxX + AXIS_EXTENT ), modelViewTransform.modelToViewY( bounds.minY ) );
    var lineNode = new Line( tailLocation.x, tailLocation.y, tipLocation.x, tipLocation.y, {
      fill: AXIS_COLOR,
      stroke: 'black'
    } );
    this.addChild( lineNode );


    // ticks
    var numberOfTicks = bounds.width + 1;
    for ( var i = 0; i < numberOfTicks; i++ ) {
      var modelX = bounds.minX + i;
      if ( modelX !== 0 ) { // skip the origin
        var x = modelViewTransform.modelToViewX( modelX );
        var y = modelViewTransform.modelToViewY( 0 );
        if ( Math.abs( modelX ) % MAJOR_TICK_SPACING === 0 ) {
          // major tick
          this.addChild( new MajorTickNode( x, y, modelX, true ) );
        }
        else {
          // minor tick
          this.addChild( new MinorTickNode( x, y, true ) );
        }
      }
    }

  }

  inherit( Node, XAxisNode );

  //----------------------------------------------------------------------------------------
  // y-axis (vertical)
  //----------------------------------------------------------------------------------------

  /**
   * @param {Bounds2} bounds
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function YAxisNode( bounds, modelViewTransform ) {

    Node.call( this );

    // vertical line
    var tailLocation = new Vector2( modelViewTransform.modelToViewX( bounds.minX ), modelViewTransform.modelToViewY( bounds.minY - AXIS_EXTENT ) );
    var tipLocation = new Vector2( modelViewTransform.modelToViewX( bounds.minX ), modelViewTransform.modelToViewY( bounds.maxY + AXIS_EXTENT ) );
    var lineNode = new Line( tailLocation.x, tailLocation.y, tipLocation.x, tipLocation.y, {
      fill: AXIS_COLOR,
      stroke: 'black'
    } );
    this.addChild( lineNode );

    // ticks

    var tickSeparation = 1;
    var numberOfTicks = tickSeparation.numberOfTicks;

    for ( var i = 0; i < numberOfTicks; i++ ) {
      var modelY = tickSeparation.startPositionTick + tickSeparation.minorTickSpacing * i;

      var x = modelViewTransform.modelToViewX( bounds.minX );
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
   * @param {Bounds2} bounds
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function XLabelNode( bounds, modelViewTransform ) {

    Node.call( this );

    var centerX = modelViewTransform.modelToViewX( (bounds.minX + bounds.maxX) / 2 );
    var bottom = modelViewTransform.modelToViewY( bounds.minY );
    var xLabelNode = new Text( 'Bin', {
      font: AXIS_LABEL_FONT,
      fill: AXIS_LABEL_COLOR,
      centerX: centerX,
      bottom: bottom + 20
    } );
    this.addChild( xLabelNode );
  }

  inherit( Node, XLabelNode );

  //----------------------------------------------------------------------------------------
//  Y label
//----------------------------------------------------------------------------------------

  /**
   * @param {Bounds2} bounds
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function YLabelNode( bounds, modelViewTransform ) {

    Node.call( this );

    var centerY = modelViewTransform.modelToViewY( (bounds.minY + bounds.maxY) / 2 );
    var left = modelViewTransform.modelToViewX( bounds.minX );
    var yLabelNode = new Text( 'STUFF', {
      font: AXIS_LABEL_FONT,
      fill: AXIS_LABEL_COLOR,
      centerY: centerY,
      left: left - 20,
      rotation: -Math.PI / 2   //remember down is positive in the view
    } );
    this.addChild( yLabelNode );
  }

  inherit( Node, YLabelNode );

  //----------------------------------------------------------------------------------------
// 2D Background
//----------------------------------------------------------------------------------------

  /**
   * @param {Bounds2} bounds
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function BackgroundNode( bounds, modelViewTransform ) {
    Node.call( this );

    var backgroundNode = new Rectangle( modelViewTransform.modelToViewBounds( bounds ),
      { fill: GRID_BACKGROUND_FILL, lineWidth: GRID_BACKGROUND_LINE_WIDTH, stroke: GRID_BACKGROUND_STROKE } );
    this.addChild( backgroundNode );
  }

  inherit( Node, BackgroundNode );

  //----------------------------------------------------------------------------------------
//  X Banner
//----------------------------------------------------------------------------------------

  /**
   * @param {Property.<number>} numberOfRowsProperty
   * @param {Bounds2} bounds
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function XBannerNode( numberOfRowsProperty, bounds, modelViewTransform ) {

    Node.call( this );

    var bannerHeight = 20;
    var minX = modelViewTransform.modelToViewX( bounds.minX );
    var minY = modelViewTransform.modelToViewY( bounds.maxY );
    var maxX = modelViewTransform.modelToViewX( bounds.maxX );
    var maxY = modelViewTransform.modelToViewY( bounds.maxY ) + bannerHeight;

    var bannerWidth = maxX - minX;
    var bannerBackgroundNode = new Rectangle( minX, minY, bannerWidth, bannerHeight,
      { fill: 'blue', lineWidth: GRID_BACKGROUND_LINE_WIDTH, stroke: GRID_BACKGROUND_STROKE } );
    this.addChild( bannerBackgroundNode );

    var verticalStrokes = new Shape().moveTo( 0, 0 );


    numberOfRowsProperty.link( function( numberOfRows ) {
      updateBanner( numberOfRows );
    } );


    /**
     *
     * @param {number} numberOfRows
     */
    function updateBanner( numberOfRows ) {
      var i;
      var xSpacing = bannerWidth / (numberOfRows);
      for ( i = 0; i < numberOfRows; i++ ) {
        verticalStrokes.moveTo( minX + (i + 1 / 2) * xSpacing, minY ).verticalLineTo( maxY );
      }
    }

    var verticalPaths = new Path( verticalStrokes, { stroke: 'red', lineWidth: 2 } );
    this.addChild( verticalPaths );

  }

  inherit( Node, XBannerNode );
  /**
   *
   * @param {Property.<number>} numberOfRowsProperty
   * @param {Property.<number>} verticalScaleProperty
   * @param histogram
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} histogramVisibleProperty
   * @constructor
   */
  function HistogramNode( numberOfRowsProperty, verticalScaleProperty, histogram, modelViewTransform, histogramVisibleProperty ) {

    var minY = -1.5;
    var bounds = new Bounds2( -1, minY, 1, -1 );
    Node.call( this, {
        children: [
          new BackgroundNode( bounds, modelViewTransform ),
          //new XAxisNode( bounds, modelViewTransform ),
          //new YAxisNode( bounds, modelViewTransform ),
          new XBannerNode( numberOfRowsProperty, bounds, modelViewTransform ),
          new XLabelNode( bounds, modelViewTransform ),
          new YLabelNode( bounds, modelViewTransform ),
          //new HistogramBarNode( histogram, modelViewTransform )
        ]
      }
    );
  }

  return inherit( Node, HistogramNode );
} );