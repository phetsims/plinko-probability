// Copyright 2014-2022, University of Colorado Boulder

/**
 * Constants used throughout this simulation.
 *
 * @author Martin Veillette (Berea College)
 */

import Bounds2 from '../../../dot/js/Bounds2.js';
import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Color from '../../../scenery/js/util/Color.js';
import ButtonNode from '../../../sun/js/buttons/ButtonNode.js';
import { ThreeDAppearanceStrategy } from '../../../sun/js/buttons/RoundButton.js';
import plinkoProbability from '../plinkoProbability.js';
import PlinkoProbabilityQueryParameters from './PlinkoProbabilityQueryParameters.js';

const PlinkoProbabilityConstants = {

  BACKGROUND_COLOR: 'rgb(186,231,249)',

  GALTON_BOARD_BOUNDS: new Bounds2( -1 / 2, -1, 1 / 2, 0 ),

  HISTOGRAM_BOUNDS: new Bounds2( -1 / 2, -1.70, 1 / 2, -1.03 ),
  CYLINDER_BOUNDS: new Bounds2( -1 / 2, -1.80, 1 / 2, -1.05 ),
  RESET_ALL_BUTTON_SCALE: 0.75,

  // font sizes and weight (for statistics display node)
  TEXT_FONT: new PhetFont( { size: 18 } ), // default font for text
  TEXT_FONT_BOLD: new PhetFont( { size: 22, weight: 'bold' } ), // default font for bold font (N=)

  CHECKBOX_TEXT_FONT: new PhetFont( { size: 16 } ),
  MAJOR_TICK_FONT: new PhetFont( { size: 16 } ),

  // panels
  PANEL_VERTICAL_SPACING: 7,
  PANEL_RIGHT_PADDING: 30,
  CONTROL_PANEL_CORNER_RADIUS: 10,
  SMALL_PANEL_CORNER_RADIUS: 5,
  CONTROL_PANEL_BACKGROUND_COLOR: 'rgb(255, 245, 238)',
  BALL_RADIUS: 8, // radius of the Ball for Play panel

  PANEL_FONT: new PhetFont( 18 ),
  PANEL_READOUT_FONT: new PhetFont( { size: 18 } ),

  PANEL_BACKGROUND_COLOR: 'white',
  SAMPLE_FONT_COLOR: 'rgb(237,28,36)',
  THEORETICAL_FONT_COLOR: 'blue',

  BINARY_PROBABILITY_RANGE: new RangeWithValue( 0, 1, 0.5 ),

  //TODO Bad things happen if ROWS_RANGE.min is !== 5. See https://github.com/phetsims/plinko-probability/issues/84
  ROWS_RANGE: new RangeWithValue( PlinkoProbabilityQueryParameters.minRow,
    PlinkoProbabilityQueryParameters.maxRow,
    PlinkoProbabilityQueryParameters.defaultRow ),

  // constants for the ball and the pegs
  BALL_COLOR: 'rgb(237,28,36)', // color of the Ball.
  BALL_HIGHLIGHT_COLOR: 'white', // color of the Ball's glare
  PEG_COLOR: 'rgb(115,99,87)', //brown
  BALL_SIZE_FRACTION: 0.193,  // radius of the ball compared to the horizontal separation of the pegs.

  PEG_HEIGHT_FRACTION_OFFSET: 0.7, // ranges between zero and 1

  // constants
  SOUND_TIME_INTERVAL: 0.1,   // in second, minimum sound time interval between two sounds

  // histogram
  HISTOGRAM_BAR_COLOR_FILL: 'rgb(237,28,36)', // red
  HISTOGRAM_BAR_COLOR_STROKE: 'rgb(193,39,45)', // darker shade of red
  BINOMIAL_DISTRIBUTION_BAR_COLOR_STROKE: 'blue',

  // cylinder
  CYLINDER_BASE_COLOR: new Color( 171, 189, 196, 0.5 ), // must be of type Color
  SIDE_CYLINDER_STROKE_COLOR: 'rgb( 120, 120, 100 )',
  TOP_CYLINDER_STROKE_COLOR: 'rgb( 120, 120, 100 )',
  TOP_CYLINDER_FILL_COLOR: 'rgb(212, 230, 238 )',

  // play pause buttons
  PLAY_PAUSE_BUTTON_RADIUS: 30,
  PLAY_PAUSE_BUTTON_APPEARANCE_STRATEGY: PlinkoProbabilityQueryParameters.play3D ?
                                         ThreeDAppearanceStrategy :
                                         ButtonNode.FlatAppearanceStrategy // see issue #26
};

plinkoProbability.register( 'PlinkoProbabilityConstants', PlinkoProbabilityConstants );

export default PlinkoProbabilityConstants;