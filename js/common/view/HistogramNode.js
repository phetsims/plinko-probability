// Copyright 2014-2016, University of Colorado Boulder

/**
 * Base type for histogram, displays a 2D grid and axes.
 *
 * @author Martin Veillette (Berea College)
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
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  //----------------------------------------------------------------------------------------
  // constants
  //----------------------------------------------------------------------------------------

  var MAX_NUMBER_BINS = PlinkoProbabilityConstants.ROWS_RANGE.max + 1; /// there is one more bin than rows;

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
  var HISTOGRAM_BOUNDS = PlinkoProbabilityConstants.HISTOGRAM_BOUNDS;

  /**
   * Constructor for Histogram Node
   * @param {Property.<string>} histogramModeProperty - see PlinkoProbabilityCommonView
   * @param {PlinkoProbabilityCommonModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} isTheoreticalHistogramVisibleProperty
   * @constructor
   */
  function HistogramNode( histogramModeProperty, model, modelViewTransform, isTheoreticalHistogramVisibleProperty ) {
    Node.call( this, {
      children: [
        new BackgroundNode( modelViewTransform ),
        new XAxisNode( model.histogram, model.numberOfRowsProperty, modelViewTransform ),
        new YAxisNode( model.histogram, histogramModeProperty, modelViewTransform ),
        new XBannerNode( model.histogram, model.numberOfRowsProperty, histogramModeProperty, modelViewTransform ),
        new HistogramBarNode( model.histogram, model, modelViewTransform, isTheoreticalHistogramVisibleProperty )
      ]
    } );
  }

  plinkoProbability.register( 'HistogramNode', HistogramNode );

  inherit( Node, HistogramNode );

  //----------------------------------------------------------------------------------------
  // x-axis (horizontal)
  //----------------------------------------------------------------------------------------

  /**
   * Scenery Node that create the labels at the tick marks and the X axis label.
   *
   * @param {Histogram} histogram
   * @param {Property.<number>} numberOfRowsProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function XAxisNode( histogram, numberOfRowsProperty, modelViewTransform ) {

    Node.call( this );

    // position of the axis
    var axisCenterX = modelViewTransform.modelToViewX( histogram.getCenterX() );
    var axisBottom = modelViewTransform.modelToViewY( histogram.getMinY() );

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
      for ( binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {
        // update the visibility of all the labels
        tickLabels[ binIndex ].visible = (binIndex < numberOfBins );
        // center the visible labels
        if ( tickLabels[ binIndex ].visible ) {
          tickLabels[ binIndex ].centerX = modelViewTransform.modelToViewX( histogram.getBinCenterX( binIndex, numberOfBins ) );
        }
      }
    } );
  }

  plinkoProbability.register( 'XAxisNode', XAxisNode );

  inherit( Node, XAxisNode );

  //----------------------------------------------------------------------------------------
  //  y-axis (vertical)
  //----------------------------------------------------------------------------------------

  /**
   * Scenery Node that create a Y axis label
   *
   * @param {Histogram} histogram
   * @param {Property.<string>} histogramModeProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function YAxisNode( histogram, histogramModeProperty, modelViewTransform ) {

    Node.call( this );

    var axisLeft = modelViewTransform.modelToViewX( histogram.getMinX() );

    //Sets max width of y-axis label to histogram height.
    var histogramHeight = Math.abs( modelViewTransform.modelToViewDeltaY( HISTOGRAM_BOUNDS.height ) );
    var histogramCenterY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.centerY );

    // create and add the Y axis label
    var yLabelNode = new Text( '', {
      font: Y_AXIS_LABEL_FONT,
      fill: Y_AXIS_LABEL_COLOR,
      centerY: histogramCenterY,
      left: axisLeft - 30, // empirically determined
      rotation: -Math.PI / 2,   // remember down is positive in the view
      maxWidth: histogramHeight // number for y-label max height
    } );
    this.addChild( yLabelNode );

    // no need to unlink present for the lifetime of the sim
    histogramModeProperty.link( function( histogramMode ) {
      switch( histogramMode ) {
        case 'fraction':
          yLabelNode.text = fractionString;
          break;
        case 'counter':
          yLabelNode.text = countString;
          break;
        case 'cylinder':
          // do nothing
          break;
        default:
          throw new Error( 'invalid histogramMode: ' + histogramMode );
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
    Rectangle.call( this, modelViewTransform.modelToViewBounds( PlinkoProbabilityConstants.HISTOGRAM_BOUNDS ), {
      fill: GRID_BACKGROUND_FILL,
      lineWidth: GRID_BACKGROUND_LINE_WIDTH,
      stroke: GRID_BACKGROUND_STROKE
    } );
  }

  plinkoProbability.register( 'BackgroundNode', BackgroundNode );

  inherit( Rectangle, BackgroundNode );

  //----------------------------------------------------------------------------------------
  //  X Banner
  //----------------------------------------------------------------------------------------

  /**
   * @param {Histogram} histogram
   * @param {Property.<number>} numberOfRowsProperty
   * @param {Property.<string>} histogramModeProperty
   * @param {ModelViewTransform2} modelViewTransform
   * @constructor
   */
  function XBannerNode( histogram, numberOfRowsProperty, histogramModeProperty, modelViewTransform ) {

    Node.call( this );

    var minX = modelViewTransform.modelToViewX( HISTOGRAM_BOUNDS.minX );
    var minY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.maxY );
    var maxX = modelViewTransform.modelToViewX( HISTOGRAM_BOUNDS.maxX );
    var maxY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.maxY ) + BANNER_HEIGHT;

    var bannerWidth = maxX - minX;

    var bannerBackgroundNode = new Rectangle( minX, minY, bannerWidth, BANNER_HEIGHT, {
      fill: BANNER_BACKGROUND_COLOR,
      lineWidth: GRID_BACKGROUND_LINE_WIDTH,
      stroke: GRID_BACKGROUND_STROKE
    } );
    this.addChild( bannerBackgroundNode );

    var linesLayerNode = new Node();
    var labelsLayerNode = new Node();
    this.addChild( linesLayerNode );
    this.addChild( labelsLayerNode );

    var labelsTextArray = [];
    var verticalLinesArray = [];

    // create and add an array of bin value (set initially to zero) and vertical line separator
    for ( var binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {
      labelsTextArray[ binIndex ] = new Text( 0, { fill: 'white', centerY: (maxY + minY) / 2, font: NORMAL_FONT } );
      verticalLinesArray[ binIndex ] = new Line( minX, minY, minX, maxY, { stroke: 'white', lineWidth: 1 } );
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
        var x = modelViewTransform.modelToViewX( histogram.getBinLeft( binIndex, numberOfBins ) );
        verticalLinesArray[ binIndex ].setLine(
          x,
          minY,
          x,
          maxY );
      }
      for ( binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {
        // update the visibility of vertical line separator
        verticalLinesArray[ binIndex ].visible = (binIndex < numberOfBins );
      }
    }

    /**
     * Function that update the value of the text in the banner to reflect the actual value in the bin.,
     * @param {number} numberOfRows
     * @param {string} histogramMode
     */
    function updateTextBanner( numberOfRows, histogramMode ) {

      var numberOfBins = numberOfRows + 1;

      var getHistogramBin;
      var font;
      var maxBinCount;

      switch( histogramMode ) {
        case 'fraction':
          getHistogramBin = histogram.getFractionalBinCount.bind( histogram );

          // font is dependent on the number of bins
          if ( numberOfBins > 23 ) {font = TINY_TINY_FONT;}
          else if ( numberOfBins > 20 ) {font = TINY_FONT;}
          else if ( numberOfBins > 16 ) {font = SMALL_FONT;}
          else if ( numberOfBins > 9 ) {font = NORMAL_FONT;}
          else {font = LARGE_FONT;}

          break;
        case 'counter':
          getHistogramBin = histogram.getBinCount.bind( histogram );

          // font is dependent on the highest binValue
          maxBinCount = histogram.getMaximumBinCount();
          if ( maxBinCount > 999 && numberOfBins > 23 ) {font = TINY_TINY_FONT;}
          else if ( maxBinCount > 999 && numberOfBins > 20 ) {font = TINY_FONT;}
          else if ( maxBinCount > 999 && numberOfBins > 16 ) {font = SMALL_FONT;}
          else if ( maxBinCount > 99 && numberOfBins > 23 ) {font = TINY_FONT;}
          else if ( maxBinCount > 99 && numberOfBins > 20 ) {font = SMALL_FONT;}
          else if ( maxBinCount > 99 && numberOfBins > 15 ) {font = NORMAL_FONT;}
          else if ( maxBinCount > 9 && numberOfBins > 23 ) {font = SMALL_FONT;}
          else if ( maxBinCount > 9 && numberOfBins > 18 ) {font = NORMAL_FONT;}
          else {font = LARGE_FONT;}

          break;
        case 'cylinder':
          return; // if we are on a cylinder there is no text to update
      }

      // we loop over all the bins
      for ( binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {

        if ( binIndex < numberOfBins ) {
          labelsTextArray[ binIndex ].visible = true;
          var binCenterX = modelViewTransform.modelToViewX( histogram.getBinCenterX( binIndex, numberOfBins ) );
          var binValue = getHistogramBin( binIndex ); // a number

          if ( histogramMode === 'fraction' ) {
            // set the appropriate number of decimal places if in fraction mode,
            // if the number of bins is large, the width of the bin does not allow as many decimal places
            binValue = (numberOfBins > 16) ? Util.toFixed( binValue, 2 ) : Util.toFixed( binValue, 3 );
          }

          // update position, fontsize and text of the bins
          labelsTextArray[ binIndex ].text = binValue;
          labelsTextArray[ binIndex ].setFont( font );
          labelsTextArray[ binIndex ].centerX = binCenterX;
        }
        else {
          // if binIndex>= numberOfbins, the bins are not visible. We choose not to update the text.
          labelsTextArray[ binIndex ].visible = false;
        }
      }
    }

    // update the banner when a ball has been added to the histogram
    // no need to remove listener, present for the lifetime of the sim
    histogram.histogramUpdatedEmitter.addListener( function() {
      updateTextBanner( numberOfRowsProperty.value, histogramModeProperty.value );
    } );

    // no need to unlink, present for the lifetime of the sim
    Property.multilink( [ numberOfRowsProperty, histogramModeProperty ], function( numberOfRows, histogramMode ) {
      updateBanner( numberOfRows ); // update the placement of the vertical line separators
      updateTextBanner( numberOfRows, histogramMode ); // update the text content of each bins
    } );

    updateTextBanner( numberOfRowsProperty.value, histogramModeProperty.value );
  }

  plinkoProbability.register( 'XBannerNode', XBannerNode );

  inherit( Node, XBannerNode );

  //----------------------------------------------------------------------------------------
  //  Histogram Bars
  //----------------------------------------------------------------------------------------

  /**
   * @param {Histogram} histogram
   * @param {PlinkoProbabilityCommonModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} isTheoreticalHistogramVisibleProperty
   * @constructor
   */
  function HistogramBarNode( histogram, model, modelViewTransform, isTheoreticalHistogramVisibleProperty ) {

    Node.call( this );

    // get the coordinate of the histogram bar nodes
    // the HISTOGRAM_BOUNDS include the banner on top (
    // but not the Y and X labels are outside of HISTOGRAM_BOUNDS
    var minX = modelViewTransform.modelToViewX( HISTOGRAM_BOUNDS.minX );
    var minY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.maxY );
    var maxX = modelViewTransform.modelToViewX( HISTOGRAM_BOUNDS.maxX );
    var maxY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.minY );

    // convenience variables
    var bannerWidth = maxX - minX; // in view coordinates
    var maxBarHeight = maxY - minY - BANNER_HEIGHT - 3; // in view coordinates, (-5) allows for small white space above bar so bar doesn't touch banner
    assert && assert( maxBarHeight > 0, 'the Height of the bar must be larger than zero' );

    // create and add (on a separate layer) the two histograms
    var sampleHistogramNode = new Node();
    var theoreticalHistogramNode = new Node();
    this.addChild( sampleHistogramNode );
    this.addChild( theoreticalHistogramNode );

    // the rectangles that make up each histogram are stored in an array
    var sampleHistogramRectanglesArray = [];
    var theoreticalHistogramRectanglesArray = [];

    // create and add the two arrays of rectangles
    // initialize the height, the fill and strokes of the rectangle, set visibility to false
    for ( var i = 0; i < MAX_NUMBER_BINS; i++ ) {
      // creates rectangles with a nominal height of 1, so that scenery doesn't throw a fit
      var nominalSampleHistogramRectangle = new Rectangle( 0, 0, bannerWidth, 1, {
        fill: PlinkoProbabilityConstants.HISTOGRAM_BAR_COLOR_FILL,
        stroke: PlinkoProbabilityConstants.HISTOGRAM_BAR_COLOR_STROKE,
        lineWidth: 2,
        visible: false
      } );
      // create nominal rectangles
      // height of rectangles will be updated through an update function
      var nominalTheoreticalHistogramRectangle = new Rectangle( 0, 0, bannerWidth, 1, {
        stroke: PlinkoProbabilityConstants.BINOMIAL_DISTRIBUTION_BAR_COLOR_STROKE,
        lineWidth: 2,
        visible: false
      } );
      sampleHistogramRectanglesArray.push( nominalSampleHistogramRectangle );
      theoreticalHistogramRectanglesArray.push( nominalTheoreticalHistogramRectangle );
    }
    sampleHistogramNode.setChildren( sampleHistogramRectanglesArray );
    theoreticalHistogramNode.setChildren( theoreticalHistogramRectanglesArray );

    // create triangle shape for the indicator of sample average and theoretical average
    var triangleShape = new Shape().moveTo( 0, maxY )
      .lineToRelative( -TRIANGLE_WIDTH / 2, TRIANGLE_HEIGHT )
      .lineToRelative( TRIANGLE_WIDTH, 0 )
      .close();

    // create and add triangle indicators for the sample and theoretical averages
    var sampleAverageTrianglePath = new Path( triangleShape,
      {
        fill: PlinkoProbabilityConstants.HISTOGRAM_BAR_COLOR_FILL,
        stroke: PlinkoProbabilityConstants.HISTOGRAM_BAR_COLOR_STROKE,
        lineWidth: 2
      } );
    var theoreticalAverageTrianglePath = new Path( triangleShape,
      {
        stroke: PlinkoProbabilityConstants.BINOMIAL_DISTRIBUTION_BAR_COLOR_STROKE,
        fill: 'rgba(0,0,0,0)', // transparent
        lineWidth: 2
      } );
    this.addChild( sampleAverageTrianglePath );
    this.addChild( theoreticalAverageTrianglePath );

    // position the sample average triangle and set its visibility
    updateSampleAverageTriangle();

    // no need to unlink , present for the lifetime of the sim
    Property.multilink( [ model.numberOfRowsProperty, model.probabilityProperty, isTheoreticalHistogramVisibleProperty ],
      function( numberOfRows, probability, isTheoreticalHistogramVisible ) {
        // update the sample histogram
        updateHistogram( sampleHistogramRectanglesArray, model.histogram.getNormalizedSampleDistribution() );
        // set the appropriate visibility to the theoretical histogram and path
        theoreticalHistogramNode.visible = isTheoreticalHistogramVisible;
        theoreticalAverageTrianglePath.visible = isTheoreticalHistogramVisible;
        // only update the theoretical average, if isTheoreticalHistogramVisible is set to visible
        if ( isTheoreticalHistogramVisible ) {
          updateHistogram( theoreticalHistogramRectanglesArray, model.getNormalizedBinomialDistribution() );
          updateTheoreticalAverageTriangle();
        }
      } );

    // update the histogram when a model ball has exited the galton board
    model.histogram.histogramUpdatedEmitter.addListener( function() {
      // update the height of bins of histogram
      updateHeightOfHistogram( sampleHistogramRectanglesArray, model.histogram.getNormalizedSampleDistribution() );
      // update the position of the indicator for sample average
      updateSampleAverageTriangle();
    } );

    /**
     * Set the position of the triangle Path based on the average value
     *
     * @param {Path} path
     * @param {number} average
     */
    function updateTrianglePosition( path, average ) {
      var numberOfBins = model.numberOfRowsProperty.value + 1;
      path.centerX = modelViewTransform.modelToViewX( histogram.getValuePosition( average, numberOfBins ) );
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
     * Function that solely update the Height of the bars of the histogram
     *  (and not their visibility)
     * @param {Array.<Rectangle>} rectanglesArray
     * @param {Array.<number>} bins
     */
    function updateHeightOfHistogram( rectanglesArray, bins ) {
      var i;
      var numberOfBins = model.numberOfRowsProperty.value + 1;
      for ( i = 0; i < numberOfBins; i++ ) {
        // update the height of the rectangles that are visible
        rectanglesArray[ i ].setRectHeightFromBottom( maxBarHeight * bins[ i ] );
      }
    }

    /**
     * @param {Array.<Rectangle>} rectanglesArray
     * @param {Array.<number>} bins
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

  return HistogramNode;
} );