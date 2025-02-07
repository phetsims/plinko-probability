// Copyright 2014-2023, University of Colorado Boulder

/**
 * Base type for histogram, displays a 2D grid and axes.
 *
 * @author Martin Veillette (Berea College)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Utils from '../../../../dot/js/Utils.js';
import Shape from '../../../../kite/js/Shape.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import plinkoProbability from '../../plinkoProbability.js';
import PlinkoProbabilityStrings from '../../PlinkoProbabilityStrings.js';
import PlinkoProbabilityConstants from '../PlinkoProbabilityConstants.js';

//----------------------------------------------------------------------------------------
// constants
//----------------------------------------------------------------------------------------

const MAX_NUMBER_BINS = PlinkoProbabilityConstants.ROWS_RANGE.max + 1; /// there is one more bin than rows;

// background of histogram
const GRID_BACKGROUND_FILL = 'white';
const GRID_BACKGROUND_LINE_WIDTH = 0.5;
const GRID_BACKGROUND_STROKE = 'gray';

// banner on top of histogram
const BANNER_HEIGHT = 20;
const BANNER_BACKGROUND_COLOR = new Color( 46, 49, 146 );

// X and Y labels of the histogram
const Y_AXIS_LABEL_FONT = new PhetFont( { size: 20, weight: 'bolder' } );
const X_AXIS_LABEL_FONT = new PhetFont( { size: 16, weight: 'bold' } );
const X_AXIS_LABEL_COLOR = 'black'; // space between end of axis and label
const Y_AXIS_LABEL_COLOR = 'black'; // space between end of axis and label

// fonts
const LARGE_FONT = new PhetFont( { size: 16 } );
const NORMAL_FONT = new PhetFont( 14 );
const SMALL_FONT = new PhetFont( { size: 12 } );
const TINY_FONT = new PhetFont( { size: 10 } );
const TINY_TINY_FONT = new PhetFont( { size: 8 } );

// ticks
const MAJOR_TICK_COLOR = 'black';
const MAJOR_TICK_FONT = new PhetFont( { size: 16 } );

const binString = PlinkoProbabilityStrings.bin;
const countString = PlinkoProbabilityStrings.count;
const fractionString = PlinkoProbabilityStrings.fraction;

// triangle (for average indicators)
const TRIANGLE_HEIGHT = 20;
const TRIANGLE_WIDTH = 20;

// model histogram bounds
const HISTOGRAM_BOUNDS = PlinkoProbabilityConstants.HISTOGRAM_BOUNDS;

class HistogramNode extends Node {
  /**
   * Constructor for Histogram Node
   * @param {Property.<string>} histogramModeProperty - see PlinkoProbabilityCommonView
   * @param {PlinkoProbabilityCommonModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} isTheoreticalHistogramVisibleProperty
   */
  constructor( histogramModeProperty, model, modelViewTransform, isTheoreticalHistogramVisibleProperty ) {
    super( {
      children: [
        new BackgroundNode( modelViewTransform ),
        new XAxisNode( model.histogram, model.numberOfRowsProperty, modelViewTransform ),
        new YAxisNode( model.histogram, histogramModeProperty, modelViewTransform ),
        new XBannerNode( model.histogram, model.numberOfRowsProperty, histogramModeProperty, modelViewTransform ),
        new HistogramBarNode( model.histogram, model, modelViewTransform, isTheoreticalHistogramVisibleProperty )
      ]
    } );
  }
}

plinkoProbability.register( 'HistogramNode', HistogramNode );

//----------------------------------------------------------------------------------------
// x-axis (horizontal)
//----------------------------------------------------------------------------------------

class XAxisNode extends Node {
  /**
   * Scenery Node that create the labels at the tick marks and the X axis label.
   *
   * @param {Histogram} histogram
   * @param {Property.<number>} numberOfRowsProperty
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( histogram, numberOfRowsProperty, modelViewTransform ) {

    super();

    // position of the axis
    const axisCenterX = modelViewTransform.modelToViewX( histogram.getCenterX() );
    const axisBottom = modelViewTransform.modelToViewY( histogram.getMinY() );

    // create layer to store tick labels
    const tickLabelsLayer = new Node();
    this.addChild( tickLabelsLayer );
    const tickLabels = [];

    // top position for tick labels
    const topTickTextPosition = axisBottom + 5;

    // create and add ALL the tick labels (including some that may not be visible at present time)
    for ( let binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {
      tickLabels[ binIndex ] = new Text( binIndex, {
        font: MAJOR_TICK_FONT,
        fill: MAJOR_TICK_COLOR,
        top: topTickTextPosition
      } );
    }
    tickLabelsLayer.setChildren( tickLabels );

    // bottom position of the tick labels
    const bottomTickTextPosition = tickLabels[ 0 ].bottom;

    //  create and add the main label for the x axis
    const xLabelNode = new Text( binString, {
      font: X_AXIS_LABEL_FONT,
      fill: X_AXIS_LABEL_COLOR,
      centerX: axisCenterX,
      top: bottomTickTextPosition + 5
    } );
    this.addChild( xLabelNode );

    // no need to unlink present for the lifetime of the sim
    // update the visibility of the tick labels and their x positions
    numberOfRowsProperty.link( numberOfRows => {
      const numberOfBins = numberOfRows + 1;
      for ( let binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {
        // update the visibility of all the labels
        tickLabels[ binIndex ].visible = ( binIndex < numberOfBins );
        // center the visible labels
        if ( tickLabels[ binIndex ].visible ) {
          tickLabels[ binIndex ].centerX = modelViewTransform.modelToViewX( histogram.getBinCenterX( binIndex, numberOfBins ) );
        }
      }
    } );
  }
}

plinkoProbability.register( 'XAxisNode', XAxisNode );

//----------------------------------------------------------------------------------------
//  y-axis (vertical)
//----------------------------------------------------------------------------------------

class YAxisNode extends Node {
  /**
   * Scenery Node that create a Y axis label
   *
   * @param {Histogram} histogram
   * @param {Property.<string>} histogramModeProperty
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( histogram, histogramModeProperty, modelViewTransform ) {

    super();

    const axisLeft = modelViewTransform.modelToViewX( histogram.getMinX() );

    //Sets max width of y-axis label to histogram height.
    const histogramHeight = Math.abs( modelViewTransform.modelToViewDeltaY( HISTOGRAM_BOUNDS.height ) );
    const histogramCenterY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.centerY );

    // create and add the Y axis label
    const yLabelNode = new Text( '', {
      font: Y_AXIS_LABEL_FONT,
      fill: Y_AXIS_LABEL_COLOR,
      centerY: histogramCenterY,
      left: axisLeft - 30, // empirically determined
      rotation: -Math.PI / 2,   // remember down is positive in the view
      maxWidth: histogramHeight // number for y-label max height
    } );
    this.addChild( yLabelNode );

    // no need to unlink present for the lifetime of the sim
    histogramModeProperty.link( histogramMode => {
      switch( histogramMode ) {
        case 'fraction':
          yLabelNode.string = fractionString;
          break;
        case 'counter':
          yLabelNode.string = countString;
          break;
        case 'cylinder':
          // do nothing
          break;
        default:
          throw new Error( `invalid histogramMode: ${histogramMode}` );
      }
      yLabelNode.centerY = histogramCenterY; // center y-label text based on content
    } );
  }
}

plinkoProbability.register( 'YAxisNode', YAxisNode );

//----------------------------------------------------------------------------------------
// 2D Background
//----------------------------------------------------------------------------------------

class BackgroundNode extends Rectangle {
  /**
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( modelViewTransform ) {
    super( modelViewTransform.modelToViewBounds( PlinkoProbabilityConstants.HISTOGRAM_BOUNDS ), {
      fill: GRID_BACKGROUND_FILL,
      lineWidth: GRID_BACKGROUND_LINE_WIDTH,
      stroke: GRID_BACKGROUND_STROKE
    } );
  }
}

plinkoProbability.register( 'BackgroundNode', BackgroundNode );

//----------------------------------------------------------------------------------------
//  X Banner
//----------------------------------------------------------------------------------------

class XBannerNode extends Node {
  /**
   * @param {Histogram} histogram
   * @param {Property.<number>} numberOfRowsProperty
   * @param {Property.<string>} histogramModeProperty
   * @param {ModelViewTransform2} modelViewTransform
   */
  constructor( histogram, numberOfRowsProperty, histogramModeProperty, modelViewTransform ) {

    super();

    const minX = modelViewTransform.modelToViewX( HISTOGRAM_BOUNDS.minX );
    const minY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.maxY );
    const maxX = modelViewTransform.modelToViewX( HISTOGRAM_BOUNDS.maxX );
    const maxY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.maxY ) + BANNER_HEIGHT;

    const bannerWidth = maxX - minX;

    const bannerBackgroundNode = new Rectangle( minX, minY, bannerWidth, BANNER_HEIGHT, {
      fill: BANNER_BACKGROUND_COLOR,
      lineWidth: GRID_BACKGROUND_LINE_WIDTH,
      stroke: GRID_BACKGROUND_STROKE
    } );
    this.addChild( bannerBackgroundNode );

    const linesLayerNode = new Node();
    const labelsLayerNode = new Node();
    this.addChild( linesLayerNode );
    this.addChild( labelsLayerNode );

    const labelsTextArray = [];
    const verticalLinesArray = [];

    // create and add an array of bin value (set initially to zero) and vertical line separator
    for ( let binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {
      labelsTextArray[ binIndex ] = new Text( 0, { fill: 'white', centerY: ( maxY + minY ) / 2, font: NORMAL_FONT } );
      verticalLinesArray[ binIndex ] = new Line( minX, minY, minX, maxY, { stroke: 'white', lineWidth: 1 } );
    }
    linesLayerNode.setChildren( verticalLinesArray );
    labelsLayerNode.setChildren( labelsTextArray );

    /**
     * Function that update the position (and visibility) of the vertical lines in the banner at top of the histogram,
     * @param {number} numberOfRows
     */
    function updateBanner( numberOfRows ) {
      const numberOfBins = numberOfRows + 1;
      // start on bin 1 rather than zero since the left side of the '0th' bin is the y-axis
      for ( let binIndex = 1; binIndex < numberOfBins; binIndex++ ) {
        const x = modelViewTransform.modelToViewX( histogram.getBinLeft( binIndex, numberOfBins ) );
        verticalLinesArray[ binIndex ].setLine(
          x,
          minY,
          x,
          maxY );
      }
      for ( let binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {
        // update the visibility of vertical line separator
        verticalLinesArray[ binIndex ].visible = ( binIndex < numberOfBins );
      }
    }

    /**
     * Function that update the value of the text in the banner to reflect the actual value in the bin.,
     * @param {number} numberOfRows
     * @param {string} histogramMode
     */
    function updateTextBanner( numberOfRows, histogramMode ) {

      const numberOfBins = numberOfRows + 1;

      let getHistogramBin;
      let font;
      let maxBinCount;

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

        default:
          throw new Error( `invalid histogramMode: ${histogramMode}` );
      }

      // we loop over all the bins
      for ( let binIndex = 0; binIndex < MAX_NUMBER_BINS; binIndex++ ) {

        if ( binIndex < numberOfBins ) {
          labelsTextArray[ binIndex ].visible = true;
          const binCenterX = modelViewTransform.modelToViewX( histogram.getBinCenterX( binIndex, numberOfBins ) );
          let binValue = getHistogramBin( binIndex ); // a number

          if ( histogramMode === 'fraction' ) {
            // set the appropriate number of decimal places if in fraction mode,
            // if the number of bins is large, the width of the bin does not allow as many decimal places
            binValue = ( numberOfBins > 16 ) ? Utils.toFixed( binValue, 2 ) : Utils.toFixed( binValue, 3 );
          }

          // update position, fontsize and text of the bins
          labelsTextArray[ binIndex ].string = binValue;
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
    histogram.histogramUpdatedEmitter.addListener( () => {
      updateTextBanner( numberOfRowsProperty.get(), histogramModeProperty.get() );
    } );

    // no need to unlink, present for the lifetime of the sim
    Multilink.multilink( [ numberOfRowsProperty, histogramModeProperty ], ( numberOfRows, histogramMode ) => {
      updateBanner( numberOfRows ); // update the placement of the vertical line separators
      updateTextBanner( numberOfRows, histogramMode ); // update the text content of each bins
    } );

    updateTextBanner( numberOfRowsProperty.get(), histogramModeProperty.get() );
  }
}

plinkoProbability.register( 'XBannerNode', XBannerNode );

//----------------------------------------------------------------------------------------
//  Histogram Bars
//----------------------------------------------------------------------------------------

class HistogramBarNode extends Node {
  /**
   * @param {Histogram} histogram
   * @param {PlinkoProbabilityCommonModel} model
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Property.<boolean>} isTheoreticalHistogramVisibleProperty
   */
  constructor( histogram, model, modelViewTransform, isTheoreticalHistogramVisibleProperty ) {

    super();

    // get the coordinate of the histogram bar nodes
    // the HISTOGRAM_BOUNDS include the banner on top (
    // but not the Y and X labels are outside of HISTOGRAM_BOUNDS
    const minX = modelViewTransform.modelToViewX( HISTOGRAM_BOUNDS.minX );
    const minY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.maxY );
    const maxX = modelViewTransform.modelToViewX( HISTOGRAM_BOUNDS.maxX );
    const maxY = modelViewTransform.modelToViewY( HISTOGRAM_BOUNDS.minY );

    // convenience variables
    const bannerWidth = maxX - minX; // in view coordinates
    const maxBarHeight = maxY - minY - BANNER_HEIGHT - 3; // in view coordinates, (-5) allows for small white space above bar so bar doesn't touch banner
    assert && assert( maxBarHeight > 0, 'the Height of the bar must be larger than zero' );

    // create and add (on a separate layer) the two histograms
    const sampleHistogramNode = new Node();
    const theoreticalHistogramNode = new Node();
    this.addChild( sampleHistogramNode );
    this.addChild( theoreticalHistogramNode );

    // the rectangles that make up each histogram are stored in an array
    const sampleHistogramRectanglesArray = [];
    const theoreticalHistogramRectanglesArray = [];

    // create and add the two arrays of rectangles
    // initialize the height, fill and strokes of the rectangle, set visibility to false
    for ( let i = 0; i < MAX_NUMBER_BINS; i++ ) {
      // creates rectangles with a nominal height of 1, so that scenery doesn't throw a fit
      const nominalSampleHistogramRectangle = new Rectangle( 0, 0, bannerWidth, 1, {
        fill: PlinkoProbabilityConstants.HISTOGRAM_BAR_COLOR_FILL,
        stroke: PlinkoProbabilityConstants.HISTOGRAM_BAR_COLOR_STROKE,
        lineWidth: 2,
        visible: false
      } );
      // create nominal rectangles
      // height of rectangles will be updated through an update function
      const nominalTheoreticalHistogramRectangle = new Rectangle( 0, 0, bannerWidth, 1, {
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
    const triangleShape = new Shape().moveTo( 0, maxY )
      .lineToRelative( -TRIANGLE_WIDTH / 2, TRIANGLE_HEIGHT )
      .lineToRelative( TRIANGLE_WIDTH, 0 )
      .close();

    // create and add triangle indicators for the sample and theoretical averages
    const sampleAverageTrianglePath = new Path( triangleShape, {
      fill: PlinkoProbabilityConstants.HISTOGRAM_BAR_COLOR_FILL,
      stroke: PlinkoProbabilityConstants.HISTOGRAM_BAR_COLOR_STROKE,
      lineWidth: 2
    } );
    const theoreticalAverageTrianglePath = new Path( triangleShape, {
      stroke: PlinkoProbabilityConstants.BINOMIAL_DISTRIBUTION_BAR_COLOR_STROKE,
      fill: 'rgba(0,0,0,0)', // transparent
      lineWidth: 2
    } );
    this.addChild( sampleAverageTrianglePath );
    this.addChild( theoreticalAverageTrianglePath );

    // position the sample average triangle and set its visibility
    updateSampleAverageTriangle();

    // no need to unlink , present for the lifetime of the sim
    Multilink.multilink( [ model.numberOfRowsProperty, model.probabilityProperty, isTheoreticalHistogramVisibleProperty ],
      ( numberOfRows, probability, isTheoreticalHistogramVisible ) => {
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
    model.histogram.histogramUpdatedEmitter.addListener( () => {
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
      const numberOfBins = model.numberOfRowsProperty.get() + 1;
      path.centerX = modelViewTransform.modelToViewX( histogram.getValuePosition( average, numberOfBins ) );
    }

    /**
     * Update the position of the theoretical average indicator (a triangle) based on
     * the theoretical average value
     */
    function updateTheoreticalAverageTriangle() {
      const average = model.getTheoreticalAverage( model.numberOfRowsProperty.get(), model.probabilityProperty.get() );
      theoreticalAverageTrianglePath.visible = isTheoreticalHistogramVisibleProperty.get();
      updateTrianglePosition( theoreticalAverageTrianglePath, average );
    }

    /**
     *  Update the position of the average sample indicator (a triangle) based
     *  on the sample average of the histogram bins
     */
    function updateSampleAverageTriangle() {
      const average = model.histogram.average;
      // set to invisible if none of the balls have landed
      sampleAverageTrianglePath.visible = ( model.histogram.landedBallsNumber > 0 );
      // update the position of the triangle for the sample distribution;
      updateTrianglePosition( sampleAverageTrianglePath, average );
    }

    /**
     * Function that solely update the Height of the bars of the histogram
     *  (and not their visibility)
     * @param {Array.<Rectangle>} rectanglesArray
     * @param {Array.<number>} binValues
     */
    function updateHeightOfHistogram( rectanglesArray, binValues ) {
      let i;
      const numberOfBins = model.numberOfRowsProperty.get() + 1;
      for ( i = 0; i < numberOfBins; i++ ) {
        const barHeight = maxBarHeight * binValues[ i ];
        rectanglesArray[ i ].visible = ( barHeight > 0 ); // zero-height bars are invisible, see #87
        rectanglesArray[ i ].setRectHeightFromBottom( barHeight );
      }
    }

    /**
     * @param {Array.<Rectangle>} rectanglesArray
     * @param {Array.<number>} binValues
     */
    function updateHistogram( rectanglesArray, binValues ) {
      let i;
      const numberOfBins = model.numberOfRowsProperty.get() + 1;
      const xSpacing = bannerWidth / numberOfBins;
      // update ALL rectangles
      for ( i = 0; i < MAX_NUMBER_BINS; i++ ) {
        if ( i < numberOfBins ) {

          const barHeight = maxBarHeight * binValues[ i ];

          // zero-height bars are invisible, see #87
          rectanglesArray[ i ].visible = ( barHeight > 0 );

          rectanglesArray[ i ].setRect(
            minX + ( i ) * xSpacing,
            maxY - maxBarHeight * binValues[ i ],
            xSpacing,
            barHeight
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
}

plinkoProbability.register( 'HistogramBarNode', HistogramBarNode );

export default HistogramNode;