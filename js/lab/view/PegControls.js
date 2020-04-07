// Copyright 2014-2020, University of Colorado Boulder

/**
 * Controls that affect the pegs in the Galton board.
 *
 * @author Martin Veillette (Berea College)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import Utils from '../../../../dot/js/Utils.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberControl from '../../../../scenery-phet/js/NumberControl.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import Panel from '../../../../sun/js/Panel.js';
import PlinkoProbabilityConstants from '../../common/PlinkoProbabilityConstants.js';
import plinkoProbabilityStrings from '../../plinkoProbabilityStrings.js';
import plinkoProbability from '../../plinkoProbability.js';

const binaryProbabilityString = plinkoProbabilityStrings.binaryProbability;
const rowsString = plinkoProbabilityStrings.rows;

// constants
const SLIDER_TRACK_SIZE = new Dimension2( 170, 2 );

/**
 * @param {Property.<number>} rowsProperty
 * @param {Property.<number>} probabilityProperty
 * @param {Object} [options]
 * @constructor
 */
function PegControls( rowsProperty, probabilityProperty, options ) {

  options = merge( {
    align: 'center',
    fill: 'white',
    xMargin: 10,
    yMargin: 8
  }, options );

  // major tick labels for slider that controls number of rows
  assert && assert( Utils.isInteger( PlinkoProbabilityConstants.ROWS_RANGE.min ), 'integer required: ' + PlinkoProbabilityConstants.ROWS_RANGE.min );
  assert && assert( Utils.isInteger( PlinkoProbabilityConstants.ROWS_RANGE.max ), 'integer required: ' + PlinkoProbabilityConstants.ROWS_RANGE.max );
  const tickLabelOptions = {
    font: PlinkoProbabilityConstants.MAJOR_TICK_FONT
  };
  const rowsMajorTicks = [ {
    value: PlinkoProbabilityConstants.ROWS_RANGE.min,
    label: new Text( PlinkoProbabilityConstants.ROWS_RANGE.min, tickLabelOptions )
  }, {
    value: PlinkoProbabilityConstants.ROWS_RANGE.max,
    label: new Text( PlinkoProbabilityConstants.ROWS_RANGE.max, tickLabelOptions )
  } ];

  // control for number of rows
  const rowsControl = new NumberControl( rowsString, rowsProperty, PlinkoProbabilityConstants.ROWS_RANGE, {
    delta: 1,
    layoutFunction: NumberControl.createLayoutFunction3( {
      ySpacing: 3
    } ),

    // subcomponent options
    titleNodeOptions: {
      font: PlinkoProbabilityConstants.PANEL_FONT,
      maxWidth: SLIDER_TRACK_SIZE.width
    },
    numberDisplayOptions: {
      textOptions: {
        font: PlinkoProbabilityConstants.PANEL_READOUT_FONT
      },
      decimalPlaces: 0
    },
    sliderOptions: {
      trackSize: SLIDER_TRACK_SIZE,
      majorTicks: rowsMajorTicks,
      majorTickLength: 18,
      tickLabelSpacing: 1,

      // pdom
      keyboardStep: 2
    }
  } );

  // major tick labels for slider that controls binary probability
  assert && assert( Utils.isInteger( PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.min ), 'integer required: ' + PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.min );
  assert && assert( Utils.isInteger( PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.max ), 'integer required: ' + PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.max );
  const probabilityMajorTicks = [ {
    value: PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.min,
    label: new Text( PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.min, tickLabelOptions )
  }, {
    value: PlinkoProbabilityConstants.ROWS_RANGE.max,
    label: new Text( PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.max, tickLabelOptions )
  } ];

  // control for the binary probability
  const probabilityControl = new NumberControl( binaryProbabilityString, probabilityProperty, PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE, {
    layoutFunction: NumberControl.createLayoutFunction3(),
    delta: 0.01,
    titleNodeOptions: {
      font: PlinkoProbabilityConstants.PANEL_FONT,
      maxWidth: SLIDER_TRACK_SIZE.width
    },
    numberDisplayOptions: {
      textOptions: {
        font: PlinkoProbabilityConstants.PANEL_READOUT_FONT
      },
      decimalPlaces: 2
    },
    sliderOptions: {
      trackSize: SLIDER_TRACK_SIZE,
      majorTicks: probabilityMajorTicks,
      majorTickLength: 18,
      tickLabelSpacing: 1

      // pdom
      // no need to delineate specific steps as the HSlider defaults evenly/cleanly divide
      // the range
    }
  } );

  const contentNode = new VBox( {
    align: 'center',
    spacing: 20,
    children: [ rowsControl, probabilityControl ]
  } );

  Panel.call( this, contentNode, options );
}

plinkoProbability.register( 'PegControls', PegControls );

inherit( Panel, PegControls );
export default PegControls;