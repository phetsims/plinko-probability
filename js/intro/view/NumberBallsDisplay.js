// Copyright 2015-2022, University of Colorado Boulder

/**
 * Panel Display of the number of balls that have landed in Plinko Probability Simulation Intro
 *
 * @author Martin Veillette (Berea College)
 */

import merge from '../../../../phet-core/js/merge.js';
import Panel from '../../../../sun/js/Panel.js';
import PlinkoProbabilityConstants from '../../common/PlinkoProbabilityConstants.js';
import EquationNode from '../../common/view/EquationNode.js';
import plinkoProbability from '../../plinkoProbability.js';
import PlinkoProbabilityStrings from '../../PlinkoProbabilityStrings.js';

class NumberBallsDisplay extends Panel {

  /**
   * @param {Histogram} histogram
   * @param {Object} [options]
   */
  constructor( histogram, options ) {

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

    const numberLandedBallsText = new EquationNode( PlinkoProbabilityStrings.n, 0, optionsTitle );

    histogram.histogramUpdatedEmitter.addListener( () => {
      numberLandedBallsText.setRightHandSideOfEquation( histogram.landedBallsNumber );
    } );

    super( numberLandedBallsText, options );
  }
}

plinkoProbability.register( 'NumberBallsDisplay', NumberBallsDisplay );
export default NumberBallsDisplay;