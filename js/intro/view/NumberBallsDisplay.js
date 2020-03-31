// Copyright 2015-2020, University of Colorado Boulder

/**
 * Panel Display of the number of balls that have landed in Plinko Probability Simulation Intro
 *
 * @author Martin Veillette (Berea College)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Panel from '../../../../sun/js/Panel.js';
import PlinkoProbabilityConstants from '../../common/PlinkoProbabilityConstants.js';
import EquationNode from '../../common/view/EquationNode.js';
import plinkoProbabilityStrings from '../../plinkoProbabilityStrings.js';
import plinkoProbability from '../../plinkoProbability.js';

const nString = plinkoProbabilityStrings.n;

/**
 * @param {Histogram} histogram
 * @param {Object} [options]
 * @constructor
 */
function NumberBallsDisplay( histogram, options ) {

  options = merge( {
    minWidth: 214, // left border of panel is aligned with the left border of the play panel.
    align: 'left',
    yMargin: 7.5
  }, options );

  const optionsTitle = {
    leftHandSideFont: PlinkoProbabilityConstants.TEXT_FONT_BOLD,
    leftHandSideFill: PlinkoProbabilityConstants.SAMPLE_FONT_COLOR,
    rightHandSideFont: PlinkoProbabilityConstants.TEXT_FONT_BOLD,
    rightHandSideFill: PlinkoProbabilityConstants.SAMPLE_FONT_COLOR,
    maxDecimalPlaces: 0
  };

  const numberLandedBallsText = new EquationNode( nString, 0, optionsTitle );

  histogram.histogramUpdatedEmitter.addListener( function() {
    numberLandedBallsText.setRightHandSideOfEquation( histogram.landedBallsNumber );
  } );

  Panel.call( this, numberLandedBallsText, options );
}

plinkoProbability.register( 'NumberBallsDisplay', NumberBallsDisplay );

inherit( Panel, NumberBallsDisplay );
export default NumberBallsDisplay;