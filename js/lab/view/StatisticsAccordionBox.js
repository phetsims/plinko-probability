// Copyright 2014-2015, University of Colorado Boulder

/**
 * Accordion Box that displays statistics associated with the histogram in Plinko Probability Simulation lab tab
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var CheckBox = require( 'SUN/CheckBox' );
  var EquationNode = require( 'PLINKO_PROBABILITY/common/view/EquationNode' );
  var HistogramIcon = require( 'PLINKO_PROBABILITY/lab/view/HistogramIcon' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var muGreekString = require( 'string!PLINKO_PROBABILITY/muGreek' );
  var sigmaGreekString = require( 'string!PLINKO_PROBABILITY/sigmaGreek' );
  var xOverlineString = require( 'string!PLINKO_PROBABILITY/xOverline' );
  var meanString = require( 'string!PLINKO_PROBABILITY/mean' );
  var sString = require( 'string!PLINKO_PROBABILITY/s' );
  var sMeanString = sString + '<sub>' + meanString + '</sub>';
  var nString = require( 'string!PLINKO_PROBABILITY/n' );
  var idealString = require( 'string!PLINKO_PROBABILITY/ideal' );

  // constants
  var IDEAL_MAX_TEXT_WIDTH = 45; // maximum length of the Ideal string

  // options for the title of the panel
  var OPTIONS_TITLE = {
    leftHandSideFont: PlinkoConstants.TEXT_FONT_BOLD,
    leftHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR,
    rightHandSideFont: PlinkoConstants.TEXT_FONT_BOLD,
    rightHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR,
    maxDecimalPlaces: 0
  };

  // options for sample statistics
  var OPTIONS_SAMPLE = {
    leftHandSideFont: PlinkoConstants.TEXT_FONT,
    leftHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR,
    rightHandSideFont: PlinkoConstants.TEXT_FONT,
    rightHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR
  };

  // options for the theoretical statistics
  var OPTIONS_THEORETICAL = {
    leftHandSideFont: PlinkoConstants.TEXT_FONT,
    leftHandSideFill: PlinkoConstants.THEORETICAL_FONT_COLOR,
    rightHandSideFont: PlinkoConstants.TEXT_FONT,
    rightHandSideFill: PlinkoConstants.THEORETICAL_FONT_COLOR
  };

  /**
   *
   * @param {LabModel} model
   * @param {Property.<boolean>} isTheoreticalHistogramVisibleProperty
   * @param {Property.<boolean>} expandedAccordionBoxProperty
   * @param {Object} [options]
   * @constructor
   */
  function StatisticsAccordionBox( model, isTheoreticalHistogramVisibleProperty, expandedAccordionBoxProperty, options ) {

    var numberLandedBallsText = new EquationNode( nString, 0, OPTIONS_TITLE );

    options = _.extend( {
      cornerRadius: 10,
      fill: PlinkoConstants.PANEL_BACKGROUND_COLOR,
      buttonXMargin: 10,
      buttonYMargin: 10,
      expandedProperty: expandedAccordionBoxProperty,
      resize: false,
      buttonAlign: 'right',
      titleNode: numberLandedBallsText,
      titleAlignX: 'left',
      titleXMargin: 5,
      contentXMargin: 8,
      contentYMargin: 10,
      minWidth: 0
    }, options );

    // create the EquationNode(s) that will populate the panel
    var sampleAverageText = new EquationNode( xOverlineString, 0, OPTIONS_SAMPLE );
    var sampleStandardDeviationText = new EquationNode( sString, 0, OPTIONS_SAMPLE );
    var sampleStandardDeviationOfMeanText = new EquationNode( sMeanString, 0, OPTIONS_SAMPLE );
    var theoreticalAverageText = new EquationNode( muGreekString, 0, OPTIONS_THEORETICAL );
    var theoreticalStandardDeviationText = new EquationNode( sigmaGreekString, 0, OPTIONS_THEORETICAL );

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
    var histogramCheckBoxIcon = new VBox( {
      align: 'center',
      spacing: 5,
      children: [
        new HistogramIcon(),
        new Text( idealString, { font: PlinkoConstants.PANEL_READOUT_FONT, maxWidth: IDEAL_MAX_TEXT_WIDTH } )
      ]
    } );

    var histogramCheckBox = new CheckBox( histogramCheckBoxIcon, isTheoreticalHistogramVisibleProperty );

    var contentNode = new HBox( {
      spacing: 5,
      children: [

        // left side of the accordion box
        new VBox( {
          align: 'left',
          spacing: 10,
          children: [
            sampleAverageText,
            sampleStandardDeviationText,
            sampleStandardDeviationOfMeanText
          ]
        } ),

        // right side of the accordion box
        new VBox( {
          align: 'left',
          spacing: 5,
          children: [
            theoreticalAverageText,
            theoreticalStandardDeviationText,
            new HBox( {
              children: [ new HStrut( 30 ), histogramCheckBox ]
            } )
          ]
        } )
      ]
    } );

    AccordionBox.call( this, contentNode, options );
  }

  plinkoProbability.register( 'StatisticsAccordionBox', StatisticsAccordionBox );

  return inherit( AccordionBox, StatisticsAccordionBox, {

    /**
     * resets the panel to the unexpanded state
     * @public
     */
    reset: function() {
      this.expandedProperty.reset();
    }
  } );
} );

