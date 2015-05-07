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
    //var Line = require( 'SCENERY/nodes/Line' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var PhetFont = require( 'SCENERY_PHET/PhetFont' );
    var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var Shape = require( 'KITE/Shape' );
    var Text = require( 'SCENERY/nodes/Text' );
    var Util = require( 'DOT/Util' );
    //var Vector2 = require( 'DOT/Vector2' );

    //----------------------------------------------------------------------------------------
    // constants
    //----------------------------------------------------------------------------------------

    // background

    var GRID_BACKGROUND_FILL = 'white';
    var GRID_BACKGROUND_LINE_WIDTH = 0.5;
    var GRID_BACKGROUND_STROKE = 'gray';

    // axes

    //var AXIS_COLOR = 'black';
    //var AXIS_EXTENT = 0.0; // how far the line extends past the min/max ticks, in model coordinates


    // banner
    var BANNER_HEIGHT = 20;
    // labels
    var AXIS_LABEL_FONT = new PhetFont( 18 );
    var AXIS_LABEL_COLOR = 'black'; // space between end of axis and label


    var LARGE_FONT = new PhetFont( 16 );
    var NORMAL_FONT = new PhetFont( 14 );
    var SMALL_FONT = new PhetFont( 12 );
    var TINY_FONT = new PhetFont( 10 );

    // ticks
    var MAJOR_TICK_COLOR = 'black';
    var MAJOR_TICK_FONT = new PhetFont( 16 );
    var TICK_LABEL_SPACING = 2;
    var MINUS_SIGN_WIDTH = new Text( '\u2212', { font: MAJOR_TICK_FONT } ).width;

    // strings
    var binString = require( 'string!PLINKO_PROBABILITY/bin' );
    var numberString = require( 'string!PLINKO_PROBABILITY/count' );
    var fractionString = require( 'string!PLINKO_PROBABILITY/fraction' );



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


      var centerX = modelViewTransform.modelToViewX( (bounds.minX + bounds.maxX) / 2 );
      var bottom = modelViewTransform.modelToViewY( bounds.minY );
      var xLabelNode = new Text( binString, {
        font: AXIS_LABEL_FONT,
        fill: AXIS_LABEL_COLOR,
        centerX: centerX,
        bottom: bottom + 40
      } );
      this.addChild( xLabelNode );

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
        }
      } );

    }

    inherit( Node, XAxisNode );


    //----------------------------------------------------------------------------------------
//  Y label
//----------------------------------------------------------------------------------------

    /**
     * @param {Bounds2} bounds
     * @param {ModelViewTransform2} modelViewTransform
     * @constructor
     */
    function YAxisNode( histogramRadioProperty, bounds, modelViewTransform ) {

      Node.call( this );

      var centerY = modelViewTransform.modelToViewY( (bounds.minY + bounds.maxY) / 2 );
      var left = modelViewTransform.modelToViewX( bounds.minX );

      var yLabelNode = new Text( '', {
        font: AXIS_LABEL_FONT,
        fill: AXIS_LABEL_COLOR,
        centerY: centerY,
        left: left - 20,
        rotation: -Math.PI / 2   //remember down is positive in the view
      } );

      histogramRadioProperty.link( function( value ) {
        var yLabelString;

        switch( value ) {
          case 'fraction':
            yLabelString = fractionString;
            break;
          case 'number':
            yLabelString = numberString;
            break;
        }

        yLabelNode.text = yLabelString;
        yLabelNode.centerY = centerY;
      } );


      this.addChild( yLabelNode );
    }

    inherit( Node, YAxisNode );

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
    function XBannerNode( model, numberOfRowsProperty, histogramRadioProperty, bounds, modelViewTransform ) {

      Node.call( this );


      var minX = modelViewTransform.modelToViewX( bounds.minX );
      var minY = modelViewTransform.modelToViewY( bounds.maxY );
      var maxX = modelViewTransform.modelToViewX( bounds.maxX );
      var maxY = modelViewTransform.modelToViewY( bounds.maxY ) + BANNER_HEIGHT;

      var bannerWidth = maxX - minX;
      var bannerBackgroundNode = new Rectangle( minX, minY, bannerWidth, BANNER_HEIGHT,
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
        var verticalPaths = new Path( verticalStrokes, { stroke: 'white', lineWidth: 1 } );
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

          var getHistogramBin = model.histogram.getBinCount.bind( model.histogram );
          var value = histogramRadioProperty.value;
          switch( value ) {
            case 'fraction':
              getHistogramBin = model.histogram.getFractionalBinCount.bind( model.histogram );
              break;
            case 'number':
              getHistogramBin = model.histogram.getBinCount.bind( model.histogram );
              break;
            case 'autoScale':
              getHistogramBin = model.histogram.getFractionalBinCount.bind( model.histogram );
              break;
          }


          var bin = getHistogramBin( i );
          if ( bin < 1 ) {
            bin = Util.toFixed( bin, 2 );
          }

          var font;
          if ( histogramRadioProperty.value === 'number' ) {
            if ( bin > 999 ) {font = TINY_FONT;}
            else if ( bin > 99 ) {font = SMALL_FONT;}
            else if ( bin > 9 ) {font = NORMAL_FONT;}
            else {font = LARGE_FONT;}
          }
          else {
            var numberOf = numberOfRowsProperty.value;
            if ( numberOf > 20 ) {font = TINY_FONT;}
            else if ( numberOf > 15 ) {font = SMALL_FONT;}
            else if ( numberOf > 10 ) {font = NORMAL_FONT;}
            else {font = LARGE_FONT;}
          }

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
      var minX = modelViewTransform.modelToViewX( bounds.minX );
      var minY = modelViewTransform.modelToViewY( bounds.maxY );
      var maxX = modelViewTransform.modelToViewX( bounds.maxX );
      var maxY = modelViewTransform.modelToViewY( bounds.minY );

      var bannerWidth = maxX - minX;
      var maxBarHeight = maxY - minY - BANNER_HEIGHT;

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

      numberOfRowsProperty.lazyLink( function() {
        updateHistogram();
      } );

      model.histogram.on( 'histogramUpdated', function() {
        updateHistogram();
      } );


      var getHistogramBin = model.histogram.getFractionalNormalizedBinCount.bind( model.histogram );
      var factorHeight = maxBarHeight;




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
            new YAxisNode( histogramRadioProperty, bounds, modelViewTransform ),
            new XBannerNode( model, numberOfRowsProperty, histogramRadioProperty, bounds, modelViewTransform ),
            new HistogramBarNode( model, numberOfRowsProperty, histogramRadioProperty, bounds, modelViewTransform )
          ]
        }
      );
    }

    return inherit( Node, HistogramNode );
  }
)
;