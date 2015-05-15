// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base type for histogram, displays a 2D grid and axes.
 *
 */
define( function( require ) {
    'use strict';

    // modules
    var Bounds2 = require( 'DOT/Bounds2' );
    var Color = require( 'SCENERY/util/Color' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Line = require( 'SCENERY/nodes/Line' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var PhetFont = require( 'SCENERY_PHET/PhetFont' );
    var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
    var Property = require( 'AXON/Property' );
    var Rectangle = require( 'SCENERY/nodes/Rectangle' );
    var Shape = require( 'KITE/Shape' );
    var Text = require( 'SCENERY/nodes/Text' );
    var Util = require( 'DOT/Util' );
    //var Vector2 = require( 'DOT/Vector2' );

    //----------------------------------------------------------------------------------------
    // constants
    //----------------------------------------------------------------------------------------


    var MAX_NUMBER_BINS = PlinkoConstants.ROWS_RANGE.max + 1; /// there is one more bin than rows;
    // background

    var GRID_BACKGROUND_FILL = 'white';
    var GRID_BACKGROUND_LINE_WIDTH = 0.5;
    var GRID_BACKGROUND_STROKE = 'gray';

    // axes
    //var AXIS_COLOR = 'black';
    //var AXIS_EXTENT = 0.0; // how far the line extends past the min/max ticks, in model coordinates

    // banner
    var BANNER_HEIGHT = 20;
    var BANNER_BACKGROUND_COLOR = new Color( 46, 49, 146 );

    // labels
    var Y_AXIS_LABEL_FONT = new PhetFont( { size: 20, weight: 'bolder' } );
    var X_AXIS_LABEL_FONT = new PhetFont( { size: 16, weight: 'bold', stretch: 'condensed' } );
    var X_AXIS_LABEL_COLOR = 'black'; // space between end of axis and label
    var Y_AXIS_LABEL_COLOR = 'black'; // space between end of axis and label

    var LARGE_FONT = new PhetFont( { size: 16, weight: 'bold' } );
    var NORMAL_FONT = new PhetFont( 14 );
    var SMALL_FONT = new PhetFont( { size: 12, stretch: 'expanded' } );
    var TINY_FONT = new PhetFont( { size: 10, stretch: 'ultra-condensed' } );

    // ticks
    var MAJOR_TICK_COLOR = 'black';
    var MAJOR_TICK_FONT = new PhetFont( { size: 16, stretch: 'ultra-condensed' } );
    var TICK_LABEL_SPACING = 2;

    // strings
    var binString = require( 'string!PLINKO_PROBABILITY/bin' );
    var numberString = require( 'string!PLINKO_PROBABILITY/count' );
    var fractionString = require( 'string!PLINKO_PROBABILITY/fraction' );

    // triangle
    var TRIANGLE_HEIGHT = 20;
    var TRIANGLE_WIDTH = 20;


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

      //var self = this;
      Node.call( this );

      var centerX = modelViewTransform.modelToViewX( bounds.centerX );
      var bottom = modelViewTransform.modelToViewY( bounds.minY );
      var xLabelNode = new Text( binString, {
        font: X_AXIS_LABEL_FONT,
        fill: X_AXIS_LABEL_COLOR,
        centerX: centerX,
        bottom: bottom + 40
      } );
      this.addChild( xLabelNode );

      var tickLabelsLayer = new Node();
      this.addChild( tickLabelsLayer );
      var tickLabels = [];
      for ( var i = 0; i < MAX_NUMBER_BINS; i++ ) {
        tickLabels[ i ] = new Text( i, { font: MAJOR_TICK_FONT, fill: MAJOR_TICK_COLOR } );
      }
      tickLabelsLayer.setChildren( tickLabels );

      numberOfRowsProperty.link( function( numberOfRows ) {
        var numberOfTicks = numberOfRows + 1;
        for ( var i = 0; i < numberOfTicks; i++ ) {
          var binCenterX = bounds.minX + bounds.width * (i + 1 / 2) / (numberOfTicks );
          var x = modelViewTransform.modelToViewX( binCenterX );
          var y = modelViewTransform.modelToViewY( bounds.minY );
          tickLabels[ i ].centerX = x;
          tickLabels[ i ].top = y + TICK_LABEL_SPACING;
        }
        for ( i = 0; i < MAX_NUMBER_BINS; i++ ) {
          tickLabels[ i ].visible = (i < numberOfTicks );
        }

      } );

    }

    inherit( Node, XAxisNode );

//----------------------------------------------------------------------------------------
//  Y label
//----------------------------------------------------------------------------------------

    /**
     * @param {Property.<string>} histogramRadioProperty
     * @param {Bounds2} bounds
     * @param {ModelViewTransform2} modelViewTransform
     * @constructor
     */
    function YAxisNode( histogramRadioProperty, bounds, modelViewTransform ) {

      Node.call( this );

      var centerY = modelViewTransform.modelToViewY( bounds.centerY );
      var left = modelViewTransform.modelToViewX( bounds.minX );

      var yLabelNode = new Text( '', {
        font: Y_AXIS_LABEL_FONT,
        fill: Y_AXIS_LABEL_COLOR,
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
          case 'cylinder':
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
     *
     * @param model
     * @param {Property.<number>} numberOfRowsProperty
     * @param {Property.<string>} histogramRadioProperty
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
        { fill: BANNER_BACKGROUND_COLOR, lineWidth: GRID_BACKGROUND_LINE_WIDTH, stroke: GRID_BACKGROUND_STROKE } );
      this.addChild( bannerBackgroundNode );

      var linesLayerNode = new Node( { layerSplit: true } );
      var labelsLayerNode = new Node( { layerSplit: true } );
      this.addChild( linesLayerNode );
      this.addChild( labelsLayerNode );

      var labelsTextArray = [];
      var verticalLinesArray = [];

      for ( var i = 0; i < MAX_NUMBER_BINS; i++ ) {
        var verticalLine = new Line( minX, minY, minX, maxY, { stroke: 'white', lineWidth: 1 } );
        var labelText = new Text( 0, { fill: 'white' } );
        labelsTextArray[ i ] = labelText;
        verticalLinesArray[ i ] = verticalLine;
      }
      linesLayerNode.setChildren( verticalLinesArray );
      labelsLayerNode.setChildren( labelsTextArray );

      Property.multilink( [ numberOfRowsProperty, histogramRadioProperty ], function( numberOfRows, histogramRadio ) {
        updateBanner( numberOfRows );
        updateTextBanner();
      } );

      /**
       *
       * @param {number} numberOfRows
       */
      function updateBanner( numberOfRows ) {

        var i;
        var xSpacing = bannerWidth / (numberOfRows + 1);
        for ( i = 0; i < numberOfRows; i++ ) {
          verticalLinesArray[ i ].setLine( minX + (i + 1 ) * xSpacing, minY, minX + (i + 1 ) * xSpacing, maxY );
        }
        for ( i = 0; i < MAX_NUMBER_BINS; i++ ) {
          verticalLinesArray[ i ].visible = (i < numberOfRows );
        }
      }

      model.histogram.on( 'histogramUpdated', function() {
        updateTextBanner();
      } );
      /**
       */
      function updateTextBanner() {
        var numberOfTicks = numberOfRowsProperty.value + 1;

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
            case 'cylinder':
              getHistogramBin = model.histogram.getBinCount.bind( model.histogram );
              break;
          }

          var bin = getHistogramBin( i );
          if ( histogramRadioProperty.value === 'fraction' ) {
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

          labelsTextArray[ i ].text = bin;
          labelsTextArray[ i ].setFont( font );
          labelsTextArray[ i ].centerX = x;
          labelsTextArray[ i ].top = y + TICK_LABEL_SPACING;

        }

        for ( i = 0; i < MAX_NUMBER_BINS; i++ ) {
          labelsTextArray[ i ].visible = (i < numberOfRowsProperty.value + 1);
        }
      }

      updateTextBanner();
    }

    inherit( Node, XBannerNode );

//----------------------------------------------------------------------------------------
//  Histogram Bars
//----------------------------------------------------------------------------------------

    /**
     * @param model
     * @param {Property.<number>} numberOfRowsProperty
     * @param {Bounds2} bounds
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Property.<boolean>} isTheoreticalHistogramVisibleProperty
     * @constructor
     */
    function HistogramBarNode( model, numberOfRowsProperty, bounds, modelViewTransform, isTheoreticalHistogramVisibleProperty ) {

      Node.call( this );

      //var self = this;
      var minX = modelViewTransform.modelToViewX( bounds.minX );
      var minY = modelViewTransform.modelToViewY( bounds.maxY );
      var maxX = modelViewTransform.modelToViewX( bounds.maxX );
      var maxY = modelViewTransform.modelToViewY( bounds.minY );

      var sampleHistogramNode = new Node( { layerSplit: true } );
      var theoreticalHistogramNode = new Node( { layerSplit: true } );
      this.addChild( sampleHistogramNode );
      this.addChild( theoreticalHistogramNode );

      var bannerWidth = maxX - minX;
      var maxBarHeight = maxY - minY - BANNER_HEIGHT;

      var histogramRectanglesArray = [];
      var binomialDistributionRectanglesArray = [];

      for ( var i = 0; i < MAX_NUMBER_BINS; i++ ) {
        var nominalHistogramRectangle = new Rectangle( 0, 0, bannerWidth, 1, {
          fill: PlinkoConstants.HISTOGRAM_BAR_COLOR_FILL,
          stroke: PlinkoConstants.HISTOGRAM_BAR_COLOR_STROKE,
          lineWidth: 2
        } );
        var nominalBinomialDistributionRectangle = new Rectangle( 0, 0, bannerWidth, 1, {
          stroke: PlinkoConstants.BINOMIAL_DISTRIBUTION_BAR_COLOR_STROKE,
          lineWidth: 2
        } );
        histogramRectanglesArray[ i ] = nominalHistogramRectangle;
        binomialDistributionRectanglesArray[ i ] = nominalBinomialDistributionRectangle;
      }
      sampleHistogramNode.setChildren( histogramRectanglesArray );
      theoreticalHistogramNode.setChildren( binomialDistributionRectanglesArray );

      for ( i = 0; i < MAX_NUMBER_BINS; i++ ) {
        histogramRectanglesArray[ i ].visible = false;
        binomialDistributionRectanglesArray[ i ].visible = false;
      }

      var sampleAverageTrianglePath = new Path( new Shape(),
        {
          fill: PlinkoConstants.HISTOGRAM_BAR_COLOR_FILL,
          stroke: PlinkoConstants.HISTOGRAM_BAR_COLOR_STROKE,
          lineWidth: 2
        } );
      var theoreticalAverageTrianglePath = new Path( new Shape(),
        {
          stroke: PlinkoConstants.BINOMIAL_DISTRIBUTION_BAR_COLOR_STROKE,
          fill: 'rgba(0,0,0,0)',
          lineWidth: 2
        } );

      this.addChild( sampleAverageTrianglePath );
      this.addChild( theoreticalAverageTrianglePath );

      function updateTriangleShape( path, average ) {

        var xSpacing = bannerWidth / (numberOfRowsProperty.value + 1);
        var xPosition = minX + (average + 0.5) * xSpacing;
        var shape = new Shape();
        shape.moveTo( xPosition, maxY )
          .lineToRelative( -TRIANGLE_WIDTH / 2, TRIANGLE_HEIGHT )
          .lineToRelative( TRIANGLE_WIDTH, 0 )
          .close();
        path.setShape( shape );
      }

      function updateTheoreticalAverageTriangle() {
        var average = model.getTheoreticalAverage( numberOfRowsProperty.value, model.probability );
        theoreticalAverageTrianglePath.visible = isTheoreticalHistogramVisibleProperty.value;
        updateTriangleShape( theoreticalAverageTrianglePath, average );
      }

      function updateSampleAverageTriangle() {
        var average = model.histogram.average;
        // set to invisible if none of the balls have landed
        sampleAverageTrianglePath.visible = (model.histogram.landedBallsNumber > 0);
        updateTriangleShape( sampleAverageTrianglePath, average );
      }

      var getHistogramBin = model.histogram.getFractionalNormalizedBinCount.bind( model.histogram );
      var factorHeight = maxBarHeight;

      Property.multilink( [ numberOfRowsProperty, model.probabilityProperty, isTheoreticalHistogramVisibleProperty ],
        function( numberOfRows, probability, isTheoreticalHistogramVisible ) {
          updateBinomialDistribution();
          updateTheoreticalAverageTriangle();
          theoreticalHistogramNode.visible = isTheoreticalHistogramVisible;
          theoreticalAverageTrianglePath.visible = isTheoreticalHistogramVisible;
        } );


      model.histogram.on( 'histogramUpdated', function() {
        updateHistogram();
        updateSampleAverageTriangle();
      } );


      /**
       */
      function updateHistogram() {
        var i;
        var xSpacing = bannerWidth / (numberOfRowsProperty.value + 1);
        for ( i = 0; i < numberOfRowsProperty.value + 1; i++ ) {
          histogramRectanglesArray[ i ].setRect(
            minX + (i) * xSpacing,
            maxY - factorHeight * getHistogramBin( i ),
            xSpacing,
            factorHeight * getHistogramBin( i ) );
        }

        for ( i = 0; i < MAX_NUMBER_BINS; i++ ) {
          histogramRectanglesArray[ i ].visible = (i < numberOfRowsProperty.value + 1);
        }
      }


      /**
       */
      function updateBinomialDistribution() {
        var getBinomialBin = model.getNormalizedBinomialDistribution();
        var i;
        var xSpacing = bannerWidth / (numberOfRowsProperty.value + 1);
        for ( i = 0; i < numberOfRowsProperty.value + 1; i++ ) {
          binomialDistributionRectanglesArray[ i ].setRect(
            minX + (i) * xSpacing,
            maxY - factorHeight * getBinomialBin[ i ],
            xSpacing,
            factorHeight * getBinomialBin[ i ] );
        }

        for ( i = 0; i < MAX_NUMBER_BINS; i++ ) {
          binomialDistributionRectanglesArray[ i ].visible = (i < numberOfRowsProperty.value + 1);
        }
      }


    }

    inherit( Node, HistogramBarNode );

    /**
     *
     * @param {Property.<number>} numberOfRowsProperty
     * @param {Property.<string>} histogramRadioProperty
     * @param model
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Property.<boolean>} isTheoreticalHistogramVisibleProperty
     * @constructor
     */
    function HistogramNode( numberOfRowsProperty, histogramRadioProperty, model, modelViewTransform, isTheoreticalHistogramVisibleProperty ) {

      var minY = -1.70;
      var bounds = new Bounds2( -1 / 2, minY, 1 / 2, -1 );
      Node.call( this, {
          children: [
            new BackgroundNode( bounds, modelViewTransform ),
            new XAxisNode( numberOfRowsProperty, bounds, modelViewTransform ),
            new YAxisNode( histogramRadioProperty, bounds, modelViewTransform ),
            new XBannerNode( model, numberOfRowsProperty, histogramRadioProperty, bounds, modelViewTransform ),
            new HistogramBarNode( model, numberOfRowsProperty, bounds, modelViewTransform, isTheoreticalHistogramVisibleProperty )
          ]
        }
      );
    }

    return inherit( Node, HistogramNode );
  }
)
;