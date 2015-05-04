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
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  //var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
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


  var LARGE_FONT = new PhetFont( 16 );
  var SMALL_FONT = new PhetFont( 12 );
  // ticks

  var MAJOR_TICK_COLOR = 'black';
  var MAJOR_TICK_FONT = new PhetFont( 16 );
  var TICK_LABEL_SPACING = 2;
  var MINUS_SIGN_WIDTH = new Text( '\u2212', { font: MAJOR_TICK_FONT } ).width;


  // strings
  var countString = require( 'string!PLINKO_PROBABILITY/count' );

  //----------------------------------------------------------------------------------------
  // major tick with label, orientation is vertical or horizontal
  //----------------------------------------------------------------------------------------

  // Tick is placed at (x,y) and is either vertical or horizontal.
  function MajorTickNode( x, y, value, isVertical ) {

    Node.call( this );

    // tick label
    var tickLabelNode = new Text( value, { font: MAJOR_TICK_FONT, fill: MAJOR_TICK_COLOR } );
    this.addChild( tickLabelNode );

    // label position
    if ( isVertical ) {
      // center label under line, compensate for minus sign
      var signXOffset = ( value < 0 ) ? -( MINUS_SIGN_WIDTH / 2 ) : 0;
      tickLabelNode.left = x - ( tickLabelNode.width / 2 ) + signXOffset;
      tickLabelNode.top = y + TICK_LABEL_SPACING;
    }
    else {
      // center label to left of line
      tickLabelNode.right = x - TICK_LABEL_SPACING;
      tickLabelNode.centerY = y;
    }
  }

  inherit( Node, MajorTickNode );

  //----------------------------------------------------------------------------------------
  // x-axis (horizontal)
  //----------------------------------------------------------------------------------------

  /**
   * @param {Property.<number>} numberOfRowsProperty
   * @param {Bounds2} bounds
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function XAxisNode( numberOfRowsProperty, bounds, modelViewTransform ) {

    var self = this;
    Node.call( this );


    numberOfRowsProperty.link( function( numberOfRows ) {
      var numberOfTicks = numberOfRows + 1;
      self.removeAllChildren();
      for ( var i = 0; i < numberOfTicks; i++ ) {
        var modelX = bounds.minX + bounds.width * (i + 1 / 2) / (numberOfTicks );
        var x = modelViewTransform.modelToViewX( modelX );
        var y = modelViewTransform.modelToViewY( bounds.minY );
        // major tick

        var tickLabelNode = new Text( i, { font: MAJOR_TICK_FONT, fill: MAJOR_TICK_COLOR } );
        var signXOffset = ( i < 0 ) ? -( MINUS_SIGN_WIDTH / 2 ) : 0;
        tickLabelNode.left = x - ( tickLabelNode.width / 2 ) + signXOffset;
        tickLabelNode.top = y + TICK_LABEL_SPACING;
        self.addChild( tickLabelNode );

        //self.addChild( new MajorTickNode( x, y, i, true ) );
      }
    } );

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
      bottom: bottom + 40
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
    var yLabelNode = new Text( countString, {
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
   * @param { } model
   * @param {Property.<number>} numberOfRowsProperty
   * @param {Bounds2} bounds
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function XBannerNode( model, numberOfRowsProperty, bounds, modelViewTransform ) {

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

    var path = new Node();
    var label = new Node();
    this.addChild( path );
    this.addChild( label );

    numberOfRowsProperty.link( function( numberOfRows ) {
      updateBanner( numberOfRows );
    } );


    /**
     *
     * @param {number} numberOfRows
     */
    function updateBanner( numberOfRows ) {
      if ( path.getChildrenCount() ) {
        path.removeAllChildren();
      }
      var verticalStrokes = new Shape();
      var verticalPaths = new Path( verticalStrokes, { stroke: 'red', lineWidth: 2 } );
      var i;
      var xSpacing = bannerWidth / (numberOfRows + 1);
      for ( i = 0; i < numberOfRows; i++ ) {
        verticalStrokes.moveTo( minX + (i + 1 ) * xSpacing, minY ).verticalLineTo( maxY );
      }
      path.addChild( verticalPaths );

    }


    model.histogram.on( 'histogramUpdated', function() {
      updateTextBanner();
    } );
    /**
     * #param {Array} histogram
     * @param {number} numberOfRows
     */
    function updateTextBanner() {
      var numberOfTicks = numberOfRowsProperty.value + 1;
      if ( label.getChildrenCount() ) {
        label.removeAllChildren();
      }
      for ( var i = 0; i < numberOfTicks; i++ ) {
        var modelX = bounds.minX + bounds.width * ( i + 1 / 2) / (numberOfTicks );
        var x = modelViewTransform.modelToViewX( modelX );
        var y = modelViewTransform.modelToViewY( bounds.maxY );
        // major tick

        var bin = model.histogram.bins[ i ];
        var font = (bin >= 100 ) ? SMALL_FONT : LARGE_FONT;
        var tickLabelNode = new Text( bin, { font: font, fill: 'white' } );
        var signXOffset = ( i < 0 ) ? -( MINUS_SIGN_WIDTH / 2 ) : 0;
        tickLabelNode.left = x - ( tickLabelNode.width / 2 ) + signXOffset;
        tickLabelNode.top = y + TICK_LABEL_SPACING;
        label.addChild( tickLabelNode );

      }
    }
  }

  inherit( Node, XBannerNode );


//----------------------------------------------------------------------------------------
//  Histogram Bars
//----------------------------------------------------------------------------------------

  /**
   * @param {Property.<number>} numberOfRowsProperty
   * @param {Bounds2} bounds
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function HistogramBarNode( model, numberOfRowsProperty, histogramRadioProperty, bounds, modelViewTransform ) {

    Node.call( this );

    var self = this;
    //var bannerHeight = 20;
    var minX = modelViewTransform.modelToViewX( bounds.minX );
    var minY = modelViewTransform.modelToViewY( bounds.maxY );
    var maxX = modelViewTransform.modelToViewX( bounds.maxX );
    var maxY = modelViewTransform.modelToViewY( bounds.minY );

    var bannerWidth = maxX - minX;
    var bannerHeight = maxY - minY;

    var histogramRectangleArray = [];
    var arrayLength = model.histogram.bins.length;
    for ( var i = 0; i < arrayLength; i++ ) {
      histogramRectangleArray[ i ] = new Rectangle( 0, 0, bannerWidth, 1, {
        fill: PlinkoConstants.HISTOGRAM_BAR_COLOR_FILL,
        stroke: PlinkoConstants.HISTOGRAM_BAR_COLOR_STROKE,
        lineWidth: 2
      } );
      self.addChild( histogramRectangleArray[ i ] );
    }
    //
    var getHistogramBin; //= model.histogram.getBinCount.bind( model.histogram );
    var factorHeight; //= 3;

    numberOfRowsProperty.lazyLink( function() {
      updateHistogram();
    } );

    model.histogram.on( 'histogramUpdated', function() {
      updateHistogram();
    } );


    histogramRadioProperty.link( function( value ) {
      switch( value ) {
        case 'fraction':
          getHistogramBin = model.histogram.getFractionalBinCount.bind( model.histogram );
          factorHeight = bannerHeight;
          break;
        case 'number':
          getHistogramBin = model.histogram.getBinCount.bind( model.histogram );
          factorHeight = 3;
          break;
        case 'autoScale':
          getHistogramBin = model.histogram.getFractionalBinCount.bind( model.histogram );
          factorHeight = bannerHeight;
          break;
      }
      updateHistogram();
    } );

    /**
     * #param {Array} histogram
     * @param {number} numberOfRows
     */
    function updateHistogram() {
      var i;
      var xSpacing = bannerWidth / (model.numberOfRowsProperty.value + 1);


      for ( i = 0; i < model.numberOfRowsProperty.value + 1; i++ ) {
        histogramRectangleArray[ i ].setRect(
          minX + (i) * xSpacing,
          maxY - factorHeight * getHistogramBin( i ),
          xSpacing,
          factorHeight * getHistogramBin( i ) );
      }

    }

  }

  inherit( Node, HistogramBarNode );


  /**
   *
   * @param {Property.<number>} numberOfRowsProperty
   * @param {Property.<string>} histogramRadioProperty
   * @param histogram
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} histogramVisibleProperty
   * @constructor
   */
  function HistogramNode( numberOfRowsProperty, histogramRadioProperty, model, modelViewTransform, histogramVisibleProperty ) {

    var minY = -1.70;
    var bounds = new Bounds2( -1 / 2, minY, 1 / 2, -1 );
    Node.call( this, {
        children: [
          new BackgroundNode( bounds, modelViewTransform ),
          new XAxisNode( numberOfRowsProperty, bounds, modelViewTransform ),
          //new YAxisNode( bounds, modelViewTransform ),
          new XBannerNode( model, numberOfRowsProperty, bounds, modelViewTransform ),
          new XLabelNode( bounds, modelViewTransform ),
          new YLabelNode( bounds, modelViewTransform ),
          new HistogramBarNode( model, numberOfRowsProperty, histogramRadioProperty, bounds, modelViewTransform )
        ]
      }
    );
  }

  return inherit( Node, HistogramNode );
} );