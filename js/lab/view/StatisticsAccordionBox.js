// Copyright 2014-2019, University of Colorado Boulder

/**
 * Accordion Box that displays statistics associated with the histogram in Plinko Probability Simulation lab tab
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const Checkbox = require( 'SUN/Checkbox' );
  const EquationNode = require( 'PLINKO_PROBABILITY/common/view/EquationNode' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const HistogramIcon = require( 'PLINKO_PROBABILITY/lab/view/HistogramIcon' );
  const inherit = require( 'PHET_CORE/inherit' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  const Property = require( 'AXON/Property' );
  const Text = require( 'SCENERY/nodes/Text' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const idealString = require( 'string!PLINKO_PROBABILITY/ideal' );
  const muString = require( 'string!PLINKO_PROBABILITY/mu' );
  const nString = require( 'string!PLINKO_PROBABILITY/n' );
  const sigmaString = require( 'string!PLINKO_PROBABILITY/sigma' );
  const sMeanString = require( 'string!PLINKO_PROBABILITY/sMean' );
  const sString = require( 'string!PLINKO_PROBABILITY/s' );
  const xBarString = require( 'string!PLINKO_PROBABILITY/xBar' );

  // constants
  var CONTENT_Y_SPACING = 10; // vertical spacing of elements in the accordion box's content

  // options for the title of the panel
  var OPTIONS_TITLE = {
    leftHandSideFont: PlinkoProbabilityConstants.TEXT_FONT_BOLD,
    leftHandSideFill: PlinkoProbabilityConstants.SAMPLE_FONT_COLOR,
    rightHandSideFont: PlinkoProbabilityConstants.TEXT_FONT_BOLD,
    rightHandSideFill: PlinkoProbabilityConstants.SAMPLE_FONT_COLOR,
    maxDecimalPlaces: 0
  };

  // options for sample statistics
  var OPTIONS_SAMPLE = {
    leftHandSideFont: PlinkoProbabilityConstants.TEXT_FONT,
    leftHandSideFill: PlinkoProbabilityConstants.SAMPLE_FONT_COLOR,
    rightHandSideFont: PlinkoProbabilityConstants.TEXT_FONT,
    rightHandSideFill: PlinkoProbabilityConstants.SAMPLE_FONT_COLOR
  };

  // options for the theoretical statistics
  var OPTIONS_THEORETICAL = {
    leftHandSideFont: PlinkoProbabilityConstants.TEXT_FONT,
    leftHandSideFill: PlinkoProbabilityConstants.THEORETICAL_FONT_COLOR,
    rightHandSideFont: PlinkoProbabilityConstants.TEXT_FONT,
    rightHandSideFill: PlinkoProbabilityConstants.THEORETICAL_FONT_COLOR
  };

  /**
   * @param {LabModel} model
   * @param {Property.<boolean>} isTheoreticalHistogramVisibleProperty
   * @param {Property.<boolean>} expandedAccordionBoxProperty
   * @param {Object} [options]
   * @constructor
   */
  function StatisticsAccordionBox( model, isTheoreticalHistogramVisibleProperty, expandedAccordionBoxProperty, options ) {

    var numberLandedBallsText = new EquationNode( nString, 0, OPTIONS_TITLE );

    options = _.extend( {

      fill: PlinkoProbabilityConstants.PANEL_BACKGROUND_COLOR,
      cornerRadius: 10,

      // title
      titleNode: numberLandedBallsText,
      titleAlignX: 'left',
      titleXMargin: 5,

      // expand/collapse button
      expandedProperty: expandedAccordionBoxProperty,
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
    var sampleAverageText = new EquationNode( xBarString, 0, OPTIONS_SAMPLE );
    var sampleStandardDeviationText = new EquationNode( sString, 0, OPTIONS_SAMPLE );
    var sampleStandardDeviationOfMeanText = new EquationNode( sMeanString, 0, OPTIONS_SAMPLE );
    var theoreticalAverageText = new EquationNode( muString, 0, OPTIONS_THEORETICAL );
    var theoreticalStandardDeviationText = new EquationNode( sigmaString, 0, OPTIONS_THEORETICAL );

    // link is present for the life of the simulation, no need to dispose
    Property.multilink( [ model.numberOfRowsProperty, model.probabilityProperty ], function( numberOfRows, probability ) {
      assert && assert( Number.isInteger( numberOfRows ), 'the number of rows must be an integer' );
      theoreticalAverageText.setRightHandSideOfEquation( model.getTheoreticalAverage( numberOfRows, probability ) );
      theoreticalStandardDeviationText.setRightHandSideOfEquation( model.getTheoreticalStandardDeviation( numberOfRows, probability ) );
    } );

    // update the statistics display after a ball landed in the bins.
    // no need to remove Listener, present for the lifetime of the simulation
    model.histogram.histogramUpdatedEmitter.addListener( function() {
      numberLandedBallsText.setRightHandSideOfEquation( model.histogram.landedBallsNumber );
      sampleAverageText.setRightHandSideOfEquation( model.histogram.average );
      sampleStandardDeviationText.setRightHandSideOfEquation( model.histogram.standardDeviation );
      sampleStandardDeviationOfMeanText.setRightHandSideOfEquation( model.histogram.standardDeviationOfMean );
    } );

    // create the histogram icon with the text underneath it.
    var histogramIcon = new HistogramIcon();
    var histogramCheckboxIcon = new VBox( {
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

    var histogramCheckbox = new Checkbox( histogramCheckboxIcon, isTheoreticalHistogramVisibleProperty );

    var contentNode = new HBox( {
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

    AccordionBox.call( this, contentNode, options );
  }

  plinkoProbability.register( 'StatisticsAccordionBox', StatisticsAccordionBox );

  return inherit( AccordionBox, StatisticsAccordionBox, {

    // @public
    reset: function() {
      this.expandedProperty.reset();
    }
  } );
} );

