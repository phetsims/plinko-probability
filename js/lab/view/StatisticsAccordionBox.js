// Copyright 2014-2021, University of Colorado Boulder

/**
 * Accordion Box that displays statistics associated with the histogram in Plinko Probability Simulation lab tab
 *
 * @author Martin Veillette (Berea College)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import merge from '../../../../phet-core/js/merge.js';
import { HBox } from '../../../../scenery/js/imports.js';
import { Text } from '../../../../scenery/js/imports.js';
import { VBox } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import Checkbox from '../../../../sun/js/Checkbox.js';
import PlinkoProbabilityConstants from '../../common/PlinkoProbabilityConstants.js';
import EquationNode from '../../common/view/EquationNode.js';
import plinkoProbability from '../../plinkoProbability.js';
import plinkoProbabilityStrings from '../../plinkoProbabilityStrings.js';
import HistogramIcon from './HistogramIcon.js';

const idealString = plinkoProbabilityStrings.ideal;
const muString = plinkoProbabilityStrings.mu;
const nString = plinkoProbabilityStrings.n;
const sigmaString = plinkoProbabilityStrings.sigma;
const sMeanString = plinkoProbabilityStrings.sMean;
const sString = plinkoProbabilityStrings.s;
const xBarString = plinkoProbabilityStrings.xBar;

// constants
const CONTENT_Y_SPACING = 10; // vertical spacing of elements in the accordion box's content

// options for the title of the panel
const OPTIONS_TITLE = {
  leftHandSideFont: PlinkoProbabilityConstants.TEXT_FONT_BOLD,
  leftHandSideFill: PlinkoProbabilityConstants.SAMPLE_FONT_COLOR,
  rightHandSideFont: PlinkoProbabilityConstants.TEXT_FONT_BOLD,
  rightHandSideFill: PlinkoProbabilityConstants.SAMPLE_FONT_COLOR,
  maxDecimalPlaces: 0
};

// options for sample statistics
const OPTIONS_SAMPLE = {
  leftHandSideFont: PlinkoProbabilityConstants.TEXT_FONT,
  leftHandSideFill: PlinkoProbabilityConstants.SAMPLE_FONT_COLOR,
  rightHandSideFont: PlinkoProbabilityConstants.TEXT_FONT,
  rightHandSideFill: PlinkoProbabilityConstants.SAMPLE_FONT_COLOR
};

// options for the theoretical statistics
const OPTIONS_THEORETICAL = {
  leftHandSideFont: PlinkoProbabilityConstants.TEXT_FONT,
  leftHandSideFill: PlinkoProbabilityConstants.THEORETICAL_FONT_COLOR,
  rightHandSideFont: PlinkoProbabilityConstants.TEXT_FONT,
  rightHandSideFill: PlinkoProbabilityConstants.THEORETICAL_FONT_COLOR
};

class StatisticsAccordionBox extends AccordionBox {

  /**
   * @param {LabModel} model
   * @param {Property.<boolean>} isTheoreticalHistogramVisibleProperty
   * @param {Object} [options]
   */
  constructor( model, isTheoreticalHistogramVisibleProperty, options ) {

    const numberLandedBallsText = new EquationNode( nString, 0, OPTIONS_TITLE );

    options = merge( {

      fill: PlinkoProbabilityConstants.PANEL_BACKGROUND_COLOR,
      cornerRadius: 10,

      // title
      titleNode: numberLandedBallsText,
      titleAlignX: 'left',
      titleXMargin: 5,

      // expand/collapse button
      buttonAlign: 'right',
      buttonXMargin: 10,
      buttonYMargin: 10,
      expandCollapseButtonOptions: {
        sideLength: 20,
        touchAreaXDilation: 10,
        touchAreaYDilation: 10
      },

      // content
      contentXMargin: 8,
      contentYMargin: 10

    }, options );

    // create the EquationNode(s) that will populate the panel
    const sampleAverageText = new EquationNode( xBarString, 0, OPTIONS_SAMPLE );
    const sampleStandardDeviationText = new EquationNode( sString, 0, OPTIONS_SAMPLE );
    const sampleStandardDeviationOfMeanText = new EquationNode( sMeanString, 0, OPTIONS_SAMPLE );
    const theoreticalAverageText = new EquationNode( muString, 0, OPTIONS_THEORETICAL );
    const theoreticalStandardDeviationText = new EquationNode( sigmaString, 0, OPTIONS_THEORETICAL );

    // link is present for the life of the simulation, no need to dispose
    Multilink.multilink(
      [ model.numberOfRowsProperty, model.probabilityProperty ],
      ( numberOfRows, probability ) => {
        assert && assert( Number.isInteger( numberOfRows ), 'the number of rows must be an integer' );
        theoreticalAverageText.setRightHandSideOfEquation( model.getTheoreticalAverage( numberOfRows, probability ) );
        theoreticalStandardDeviationText.setRightHandSideOfEquation( model.getTheoreticalStandardDeviation( numberOfRows, probability ) );
      } );

    // update the statistics display after a ball landed in the bins.
    // no need to remove Listener, present for the lifetime of the simulation
    model.histogram.histogramUpdatedEmitter.addListener( () => {
      numberLandedBallsText.setRightHandSideOfEquation( model.histogram.landedBallsNumber );
      sampleAverageText.setRightHandSideOfEquation( model.histogram.average );
      sampleStandardDeviationText.setRightHandSideOfEquation( model.histogram.standardDeviation );
      sampleStandardDeviationOfMeanText.setRightHandSideOfEquation( model.histogram.standardDeviationOfMean );
    } );

    // create the histogram icon with the text underneath it.
    const histogramIcon = new HistogramIcon();
    const histogramCheckboxIcon = new VBox( {
      align: 'center',
      spacing: 5,
      children: [
        histogramIcon,
        new Text( idealString, {
          font: PlinkoProbabilityConstants.PANEL_READOUT_FONT,
          maxWidth: 1.5 * histogramIcon.width // i18n, determined empirically
        } )
      ]
    } );

    const histogramCheckbox = new Checkbox( histogramCheckboxIcon, isTheoreticalHistogramVisibleProperty );

    const contentNode = new HBox( {
      spacing: 5,
      align: 'top',
      children: [

        // left side of the accordion box
        new VBox( {
          align: 'right',
          spacing: CONTENT_Y_SPACING,
          children: [
            sampleAverageText,
            sampleStandardDeviationText,
            sampleStandardDeviationOfMeanText
          ]
        } ),

        // right side of the accordion box
        new VBox( {
          align: 'right',
          spacing: CONTENT_Y_SPACING,
          children: [
            theoreticalAverageText,
            theoreticalStandardDeviationText,
            histogramCheckbox
          ]
        } )
      ]
    } );

    super( contentNode, options );
  }
}

plinkoProbability.register( 'StatisticsAccordionBox', StatisticsAccordionBox );
export default StatisticsAccordionBox;