// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base type for histogram, displays a 2D grid and axes.
 *
 */
define( function( require ) {
    'use strict';

    // modules
    var Color = require( 'SCENERY/util/Color' );
    var inherit = require( 'PHET_CORE/inherit' );
    var Line = require( 'SCENERY/nodes/Line' );
    var Node = require( 'SCENERY/nodes/Node' );
    var Path = require( 'SCENERY/nodes/Path' );
    var PhetFont = require( 'SCENERY_PHET/PhetFont' );
    var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
    var BinInterface = require( 'PLINKO_PROBABILITY/common/model/BinInterface' );
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

    // banner
    var BANNER_HEIGHT = 20;
    var BANNER_BACKGROUND_COLOR = new Color( 46, 49, 146 );

    // labels
    var Y_AXIS_LABEL_FONT = new PhetFont( { size: 20, weight: 'bolder' } );
    var X_AXIS_LABEL_FONT = new PhetFont( { size: 16, weight: 'bold' } );
    var X_AXIS_LABEL_COLOR = 'black'; // space between end of axis and label
    var Y_AXIS_LABEL_COLOR = 'black'; // space between end of axis and label

    var LARGE_FONT = new PhetFont( { size: 16 } );
    var NORMAL_FONT = new PhetFont( 14 );
    var SMALL_FONT = new PhetFont( { size: 12 } );
    var TINY_FONT = new PhetFont( { size: 10 } );

    // ticks
    var MAJOR_TICK_COLOR = 'black';
    var MAJOR_TICK_FONT = new PhetFont( { size: 16 } );

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
     * Scenery Node that create the labels at the tick marks and the X axis label.
     *
     * @param {Property.<number>} numberOfRowsProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @constructor
     */
    function XAxisNode( numberOfRowsProperty, modelViewTransform ) {

      Node.call( this );

      // position of the axis
      var axisCenterX = modelViewTransform.modelToViewX( BinInterface.getCenterX() );
      var axisBottom = modelViewTransform.modelToViewY( BinInterface.getMinY() );

      // create layer to store tick labels
      var tickLabelsLayer = new Node();
      this.addChild( tickLabelsLayer );
      var tickLabels = [];

      // top position for tick labels
      var topTickTextPosition = axisBottom + 5;

      // create and add ALL the tick labels (including some that may not be visible at present time)
      for ( var binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {
        tickLabels[ binIndex ] = new Text( binIndex, {
          font: MAJOR_TICK_FONT,
          fill: MAJOR_TICK_COLOR,
          top: topTickTextPosition
        } );
      }
      tickLabelsLayer.setChildren( tickLabels );

      // bottom position of the tick labels
      var bottomTickTextPosition = tickLabels[ 0 ].bottom;

      //  create and add the main label for the x axis
      var xLabelNode = new Text( binString, {
        font: X_AXIS_LABEL_FONT,
        fill: X_AXIS_LABEL_COLOR,
        centerX: axisCenterX,
        top: bottomTickTextPosition + 5
      } );
      this.addChild( xLabelNode );

      // no need to unlink present for the lifetime of the sim
      // update the visibility of the tick labels and their x positions
      numberOfRowsProperty.link( function( numberOfRows ) {
        var numberOfBins = numberOfRows + 1;
        for ( var binIndex = 0; binIndex < numberOfBins; binIndex++ ) {
          tickLabels[ binIndex ].centerX = modelViewTransform.modelToViewX( BinInterface.getBinCenterX( binIndex, numberOfBins ) );
        }
        for ( binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {
          tickLabels[ binIndex ].visible = (binIndex < numberOfBins );
        }
      } );

    }

    inherit( Node, XAxisNode );

//----------------------------------------------------------------------------------------
//  Y label
//----------------------------------------------------------------------------------------

    /**
     * Scenery Node that create a Y axis label
     * @param {Property.<string>} histogramRadioProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @constructor
     */
    function YAxisNode( histogramRadioProperty, modelViewTransform ) {

      Node.call( this );

      var axisCenterY = modelViewTransform.modelToViewY( BinInterface.getCenterY() );
      var axisLeft = modelViewTransform.modelToViewX( BinInterface.getMinX() );

      // create and add the Y axis label
      var yLabelNode = new Text( '', {
        font: Y_AXIS_LABEL_FONT,
        fill: Y_AXIS_LABEL_COLOR,
        centerY: axisCenterY,
        left: axisLeft - 20,
        rotation: -Math.PI / 2   //remember down is positive in the view
      } );
      this.addChild( yLabelNode );

      // no need to unlink present for the lifetime of the sim
      // TODO: cylinder shouldnt be here in the first place
      histogramRadioProperty.link( function( value ) {
        switch( value ) {
          case 'fraction':
            yLabelNode.text = fractionString;
            break;
          case 'number':
            yLabelNode.text = numberString;
            break;
          case 'cylinder':
            yLabelNode.text = numberString;
            break;
        }
      } );
    }

    inherit( Node, YAxisNode );

//----------------------------------------------------------------------------------------
// 2D Background
//----------------------------------------------------------------------------------------

    /**
     * @param {ModelViewTransform2} modelViewTransform
     * @constructor
     */
    function BackgroundNode( modelViewTransform ) {
      Node.call( this );

      var backgroundNode = new Rectangle( modelViewTransform.modelToViewBounds( PlinkoConstants.HISTOGRAM_BOUNDS ),
        { fill: GRID_BACKGROUND_FILL, lineWidth: GRID_BACKGROUND_LINE_WIDTH, stroke: GRID_BACKGROUND_STROKE } );
      this.addChild( backgroundNode );
    }

    inherit( Node, BackgroundNode );

//----------------------------------------------------------------------------------------
//  X Banner
//----------------------------------------------------------------------------------------

    /**
     *
     * @param {Histogram} histogram
     * @param {Property.<number>} numberOfRowsProperty
     * @param {Property.<string>} histogramRadioProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @constructor
     */
    function XBannerNode( histogram, numberOfRowsProperty, histogramRadioProperty, modelViewTransform ) {

      Node.call( this );

      var bounds = PlinkoConstants.HISTOGRAM_BOUNDS;
      var minX = modelViewTransform.modelToViewX( bounds.minX );
      var minY = modelViewTransform.modelToViewY( bounds.maxY );
      var maxX = modelViewTransform.modelToViewX( bounds.maxX );
      var maxY = modelViewTransform.modelToViewY( bounds.maxY ) + BANNER_HEIGHT;

      var bannerWidth = maxX - minX;

      var bannerBackgroundNode = new Rectangle( minX, minY, bannerWidth, BANNER_HEIGHT,
        {
          fill: BANNER_BACKGROUND_COLOR,
          lineWidth: GRID_BACKGROUND_LINE_WIDTH,
          stroke: GRID_BACKGROUND_STROKE
        } );
      this.addChild( bannerBackgroundNode );

      var linesLayerNode = new Node( { layerSplit: true } );
      var labelsLayerNode = new Node( { layerSplit: true } );
      this.addChild( linesLayerNode );
      this.addChild( labelsLayerNode );

      var labelsTextArray = [];
      var verticalLinesArray = [];

      for ( var binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {
        var verticalLine = new Line( minX, minY, minX, maxY, { stroke: 'white', lineWidth: 1 } );
        labelsTextArray[ binIndex ] = new Text( 0, { fill: 'white', centerY: (maxY + minY) / 2 } );
        verticalLinesArray[ binIndex ] = verticalLine;
      }
      linesLayerNode.setChildren( verticalLinesArray );
      labelsLayerNode.setChildren( labelsTextArray );

      /**
       * Function that update the position (and visibility) of the vertical lines in the banner at top of the histogram,
       * @param {number} numberOfRows
       */
      function updateBanner( numberOfRows ) {
        var numberOfBins = numberOfRows + 1;
        // start on bin 1 rather than zero since the left side of the '0th' bin is the y-axis
        for ( var binIndex = 1; binIndex < numberOfBins; binIndex++ ) {
          verticalLinesArray[ binIndex ].setLine(
            modelViewTransform.modelToViewX( BinInterface.getBinLeft( binIndex, numberOfBins ) ),
            minY,
            modelViewTransform.modelToViewX( BinInterface.getBinLeft( binIndex, numberOfBins ) ),
            maxY );
        }
        for ( binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {
          verticalLinesArray[ binIndex ].visible = (binIndex < numberOfBins );
        }
      }

      /**
       * Function that update the value of the text in the banner to reflect the actual value in the bin.,
       * @param {number} numberOfRows
       */
      function updateTextBanner( numberOfRows ) {
        var numberOfBins = numberOfRows + 1;

        for ( var binIndex = 0; binIndex < numberOfBins; binIndex++ ) {
          var binCenterX = modelViewTransform.modelToViewX( BinInterface.getBinCenterX( binIndex, numberOfBins ) );

          var getHistogramBin = histogram.getBinCount.bind( histogram );
          var value = histogramRadioProperty.value;
          switch( value ) {
            case 'fraction':
              getHistogramBin = histogram.getFractionalBinCount.bind( histogram );
              break;
            case 'number':
              getHistogramBin = histogram.getBinCount.bind( histogram );
              break;
            case 'cylinder':
              getHistogramBin = histogram.getBinCount.bind( histogram );
              break;
          }

          var binValue = getHistogramBin( binIndex ); // a number
          if ( histogramRadioProperty.value === 'fraction' ) {
            binValue = Util.toFixed( binValue, 2 );
          }

          var font;
          if ( histogramRadioProperty.value === 'number' ) {
            if ( binValue > 999 ) {font = TINY_FONT;}
            else if ( binValue > 99 ) {font = SMALL_FONT;}
            else if ( binValue > 9 ) {font = NORMAL_FONT;}
            else {font = LARGE_FONT;}
          }
          else {
            var numberOf = numberOfRowsProperty.value;
            if ( numberOf > 20 ) {font = TINY_FONT;}
            else if ( numberOf > 15 ) {font = SMALL_FONT;}
            else if ( numberOf > 10 ) {font = NORMAL_FONT;}
            else {font = LARGE_FONT;}
          }

          labelsTextArray[ binIndex ].text = binValue;
          labelsTextArray[ binIndex ].setFont( font );
          labelsTextArray[ binIndex ].centerX = binCenterX;
        }

        for ( binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {
          labelsTextArray[ binIndex ].visible = (binIndex < numberOfBins);
        }
      }

      histogram.on( 'histogramUpdated', function() {
        updateTextBanner( numberOfRowsProperty.value );
      } );

      Property.multilink( [ numberOfRowsProperty, histogramRadioProperty ], function( numberOfRows, histogramRadio ) {
        updateBanner( numberOfRows );
        updateTextBanner( numberOfRows );
      } );

      updateTextBanner( numberOfRowsProperty.value );
    }

    inherit( Node, XBannerNode );

//----------------------------------------------------------------------------------------
//  Histogram Bars
//----------------------------------------------------------------------------------------

    /**
     * @param model
     * @param {Property.<number>} numberOfRowsProperty
     * @param {ModelViewTransform2} modelViewTransform
     * @param {Property.<boolean>} isTheoreticalHistogramVisibleProperty
     * @constructor
     */
    function HistogramBarNode( model, numberOfRowsProperty, modelViewTransform, isTheoreticalHistogramVisibleProperty ) {

      Node.call( this );

      var bounds = PlinkoConstants.HISTOGRAM_BOUNDS;
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

        var numberOfBins = numberOfRowsProperty.value() + 1;
        var xPosition = modelViewTransform.modelToViewX( BinInterface.getValuePosition( average, numberOfBins ) );
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

      Node.call( this, {
          children: [
            new BackgroundNode( modelViewTransform ),
            new XAxisNode( numberOfRowsProperty, modelViewTransform ),
            new YAxisNode( histogramRadioProperty, modelViewTransform ),
            new XBannerNode( model.histogram, numberOfRowsProperty, histogramRadioProperty, modelViewTransform ),
            new HistogramBarNode( model, numberOfRowsProperty, modelViewTransform, isTheoreticalHistogramVisibleProperty )
          ]
        }
      );
    }

    return inherit( Node, HistogramNode );
  }
)
;