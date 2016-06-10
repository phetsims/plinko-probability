// Copyright 2014-2015, University of Colorado Boulder

/**
 * Base type for histogram, displays a 2D grid and axes.
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
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

  //----------------------------------------------------------------------------------------
  // constants
  //----------------------------------------------------------------------------------------

  var MAX_NUMBER_BINS = PlinkoConstants.ROWS_RANGE.max + 1; /// there is one more bin than rows;

  // background of histogram
  var GRID_BACKGROUND_FILL = 'white';
  var GRID_BACKGROUND_LINE_WIDTH = 0.5;
  var GRID_BACKGROUND_STROKE = 'gray';

  // banner on top of histogram
  var BANNER_HEIGHT = 20;
  var BANNER_BACKGROUND_COLOR = new Color( 46, 49, 146 );

  // X and Y labels of the histogram
  var Y_AXIS_LABEL_FONT = new PhetFont( { size: 20, weight: 'bolder' } );
  var X_AXIS_LABEL_FONT = new PhetFont( { size: 16, weight: 'bold' } );
  var X_AXIS_LABEL_COLOR = 'black'; // space between end of axis and label
  var Y_AXIS_LABEL_COLOR = 'black'; // space between end of axis and label

  // fonts
  var LARGE_FONT = new PhetFont( { size: 16 } );
  var NORMAL_FONT = new PhetFont( 14 );
  var SMALL_FONT = new PhetFont( { size: 12 } );
  var TINY_FONT = new PhetFont( { size: 10 } );
  var TINY_TINY_FONT = new PhetFont( { size: 8 } );

  // ticks
  var MAJOR_TICK_COLOR = 'black';
  var MAJOR_TICK_FONT = new PhetFont( { size: 16 } );

  // strings
  var binString = require( 'string!PLINKO_PROBABILITY/bin' );
  var countString = require( 'string!PLINKO_PROBABILITY/count' );
  var fractionString = require( 'string!PLINKO_PROBABILITY/fraction' );

  // triangle (for average indicators)
  var TRIANGLE_HEIGHT = 20;
  var TRIANGLE_WIDTH = 20;

  // model histogram bounds
  var HISTOGRAM_BOUNDS = PlinkoConstants.HISTOGRAM_BOUNDS;


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

  plinkoProbability.register( 'XAxisNode', XAxisNode );

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

    var axisLeft = modelViewTransform.modelToViewX( BinInterface.getMinX() );

    //Sets max width of y-axis label to histogram height.
    var histogramHeight = Math.abs( modelViewTransform.modelToViewDeltaY( HISTOGRAM_BOUNDS.height ) );
    var histogramCenterY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.centerY );
    // create and add the Y axis label
    var yLabelNode = new Text( '', {
      font: Y_AXIS_LABEL_FONT,
      fill: Y_AXIS_LABEL_COLOR,
      centerY: histogramCenterY,
      left: axisLeft - 30,
      rotation: -Math.PI / 2,   // remember down is positive in the view
      maxWidth: histogramHeight // number for y-label max height
    } );
    this.addChild( yLabelNode );

    // no need to unlink present for the lifetime of the sim
    histogramRadioProperty.link( function( value ) {
      switch( value ) {
        case 'fraction':
          yLabelNode.text = fractionString;
          break;
        case 'counter':
          yLabelNode.text = countString;
          break;
      }
      yLabelNode.centerY = histogramCenterY; // center y-label text based on content
    } );
  }

  plinkoProbability.register( 'YAxisNode', YAxisNode );

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

  plinkoProbability.register( 'BackgroundNode', BackgroundNode );

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

    var minX = modelViewTransform.modelToViewX( HISTOGRAM_BOUNDS.minX );
    var minY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.maxY );
    var maxX = modelViewTransform.modelToViewX( HISTOGRAM_BOUNDS.maxX );
    var maxY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.maxY ) + BANNER_HEIGHT;

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
          case 'counter':
            getHistogramBin = histogram.getBinCount.bind( histogram );
            break;
          case 'cylinder':
            getHistogramBin = histogram.getBinCount.bind( histogram );
            break;
        }

        var binValue = getHistogramBin( binIndex ); // a number
        if ( histogramRadioProperty.value === 'fraction' ) {
          binValue = Util.toFixed( binValue, 3 );
        }

        var font;
        if ( histogramRadioProperty.value === 'counter' ) {
          if ( binValue > 999 ) {font = TINY_FONT;}
          else if ( binValue > 99 ) {font = SMALL_FONT;}
          else if ( binValue > 9 ) {font = NORMAL_FONT;}
          else {font = LARGE_FONT;}
        }
        else {
          if ( numberOfBins > 23 ) {
            font = TINY_TINY_FONT;
            binValue = Util.toFixed( binValue, 2 );
          }
          else if ( numberOfBins > 20 ) {
            font = TINY_FONT;
            binValue = Util.toFixed( binValue, 2 );
          }
          else if ( numberOfBins > 16 ) {
            font = SMALL_FONT;
            binValue = Util.toFixed( binValue, 2 );
          }
          else if ( numberOfBins > 13 ) {
            font = SMALL_FONT;
          }
          else if ( numberOfBins > 9 ) {
            font = NORMAL_FONT;
          }
          else {
            font = LARGE_FONT;
          }
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

    Property.multilink( [ numberOfRowsProperty, histogramRadioProperty ], function( numberOfRows ) {
      updateBanner( numberOfRows );
      updateTextBanner( numberOfRows );
    } );

    updateTextBanner( numberOfRowsProperty.value );
  }

  plinkoProbability.register( 'XBannerNode', XBannerNode );

  inherit( Node, XBannerNode );

//----------------------------------------------------------------------------------------
//  Histogram Bars
//----------------------------------------------------------------------------------------

  /**
   * @param {PlinkoProbabilityCommonModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} isTheoreticalHistogramVisibleProperty
   * @constructor
   */
  function HistogramBarNode( model, modelViewTransform, isTheoreticalHistogramVisibleProperty ) {

    Node.call( this );

    var minX = modelViewTransform.modelToViewX( HISTOGRAM_BOUNDS.minX );
    var minY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.maxY );
    var maxX = modelViewTransform.modelToViewX( HISTOGRAM_BOUNDS.maxX );
    var maxY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.minY );

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
      histogramRectanglesArray.push( nominalHistogramRectangle );
      binomialDistributionRectanglesArray.push( nominalBinomialDistributionRectangle );
    }
    sampleHistogramNode.setChildren( histogramRectanglesArray );
    theoreticalHistogramNode.setChildren( binomialDistributionRectanglesArray );

    for ( i = 0; i < MAX_NUMBER_BINS; i++ ) {
      histogramRectanglesArray[ i ].visible = false;
      binomialDistributionRectanglesArray[ i ].visible = false;
    }

    // create triangle shape for the indicator of sample average and theoretical average
    var triangleShape = new Shape().moveTo( 0, maxY )
      .lineToRelative( -TRIANGLE_WIDTH / 2, TRIANGLE_HEIGHT )
      .lineToRelative( TRIANGLE_WIDTH, 0 )
      .close();

    // create and add triangle indicators for the sample and theoretical averages
    var sampleAverageTrianglePath = new Path( triangleShape,
      {
        fill: PlinkoConstants.HISTOGRAM_BAR_COLOR_FILL,
        stroke: PlinkoConstants.HISTOGRAM_BAR_COLOR_STROKE,
        lineWidth: 2
      } );
    var theoreticalAverageTrianglePath = new Path( triangleShape,
      {
        stroke: PlinkoConstants.BINOMIAL_DISTRIBUTION_BAR_COLOR_STROKE,
        fill: 'rgba(0,0,0,0)',
        lineWidth: 2
      } );
    this.addChild( sampleAverageTrianglePath );
    this.addChild( theoreticalAverageTrianglePath );

    // position the sample average triangle and set its visibility
    updateSampleAverageTriangle();

    Property.multilink( [ model.numberOfRowsProperty, model.probabilityProperty, isTheoreticalHistogramVisibleProperty ],
      function( numberOfRows, probability, isTheoreticalHistogramVisible ) {
        updateBinomialDistributionHistogram();
        updateTheoreticalAverageTriangle();
        theoreticalHistogramNode.visible = isTheoreticalHistogramVisible;
        theoreticalAverageTrianglePath.visible = isTheoreticalHistogramVisible;
      } );


    model.histogram.on( 'histogramUpdated', function() {
      updateSampleHistogram();
      updateSampleAverageTriangle();
    } );

    /**
     * Set the position of the triangle Path based on the average value
     * @param {Path} path
     * @param {number} average
     */
    function updateTrianglePosition( path, average ) {
      var numberOfBins = model.numberOfRowsProperty.value + 1;
      var xPosition = modelViewTransform.modelToViewX( BinInterface.getValuePosition( average, numberOfBins ) );
      path.centerX = xPosition;
    }

    /**
     * Update the position of the theoretical average indicator (a triangle) based on
     * the theoretical average value
     */
    function updateTheoreticalAverageTriangle() {
      var average = model.getTheoreticalAverage( model.numberOfRowsProperty.value, model.probabilityProperty.value );
      theoreticalAverageTrianglePath.visible = isTheoreticalHistogramVisibleProperty.value;
      updateTrianglePosition( theoreticalAverageTrianglePath, average );
    }

    /**
     *  Update the position of the average sample indicator (a triangle) based
     *  on the sample average of the histogram bins
     */
    function updateSampleAverageTriangle() {
      var average = model.histogram.average;
      // set to invisible if none of the balls have landed
      sampleAverageTrianglePath.visible = (model.histogram.landedBallsNumber > 0);
      // update the position of the triangle for the sample distribution;
      updateTrianglePosition( sampleAverageTrianglePath, average );
    }

    /**
     *  Update the sample Histogram
     */
    function updateSampleHistogram() {
      updateHistogram( histogramRectanglesArray, model.histogram.getNormalizedSampleDistribution() );
    }

    /**
     * Update the binomial distribution histogram (a.k.a. ideal histogram)
     */
    function updateBinomialDistributionHistogram() {
      updateHistogram( binomialDistributionRectanglesArray, model.getNormalizedBinomialDistribution() );
    }

    /**
     *
     * @param {Array<Rectangle>} rectanglesArray
     * @param {Array<number>} bins
     */
    function updateHistogram( rectanglesArray, bins ) {
      var i;
      var numberOfBins = model.numberOfRowsProperty.value + 1;
      var xSpacing = bannerWidth / numberOfBins;
      // update ALL rectangles
      for ( i = 0; i < MAX_NUMBER_BINS; i++ ) {
        if ( i < numberOfBins ) {
          // set the rectangles to visible;
          rectanglesArray[ i ].visible = true;
          // update the height of the rectangles that are visible.
          rectanglesArray[ i ].setRect(
            minX + (i) * xSpacing,
            maxY - maxBarHeight * bins[ i ],
            xSpacing,
            maxBarHeight * bins[ i ]
          );
        }
        else {
          // the rectangles with an index larger than the current number of bins are set to invisible.
          // no need to update the height of the invisible rectangles.
          rectanglesArray[ i ].visible = false;
        }
      }
    }
  }

  plinkoProbability.register( 'HistogramBarNode', HistogramBarNode );

  inherit( Node, HistogramBarNode );

  /**
   *

   * @param {Property.<string>} histogramRadioProperty
   * @param {PlinkoProbabilityCommonModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} isTheoreticalHistogramVisibleProperty
   * @constructor
   */
  function HistogramNode( histogramRadioProperty, model, modelViewTransform, isTheoreticalHistogramVisibleProperty ) {

    Node.call( this, {
        children: [
          new BackgroundNode( modelViewTransform ),
          new XAxisNode( model.numberOfRowsProperty, modelViewTransform ),
          new YAxisNode( histogramRadioProperty, modelViewTransform ),
          new XBannerNode( model.histogram, model.numberOfRowsProperty, histogramRadioProperty, modelViewTransform ),
          new HistogramBarNode( model, modelViewTransform, isTheoreticalHistogramVisibleProperty )
        ]
      }
    );
  }

  plinkoProbability.register( 'HistogramNode', HistogramNode );

  return inherit( Node, HistogramNode );

} );