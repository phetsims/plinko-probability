// Copyright 2002-2015, University of Colorado Boulder

/**
 * Accordion Box Node in That Display Statistics in Plinko Probability Simulation
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var CheckBox = require( 'SUN/CheckBox' );
  var EquationNode = require( 'PLINKO_PROBABILITY/lab/view/EquationNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HistogramIcon = require( 'PLINKO_PROBABILITY/lab/view/HistogramIcon' );
//  var HStrut = require( 'SUN/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var Property = require( 'AXON/Property' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  //var bestFitLineString = require( 'string!PLINKO_PROBABILITY/bestFitLine' );

  // strings

  var muGreekString = '\u03BC';
  var sigmaGreekString = '\u03C3';
//  var overlineString = '\u0305';
  var xOverlineString = '\u0078\u0305';
  var sMeanString = '\u0073<sub>mean</sub>';

  /**
   *
   * @param {PlinkoProbabilityLabModel} model
   * @param {Property.<boolean>} expandedAccordionBoxProperty
   * @param {Object} [options]
   * @constructor
   */
  function StatisticsDisplayAccordionBox( model, expandedAccordionBoxProperty, options ) {

    this.model = model;
    // var thisPanel = this;



    var optionsTitle = {
      leftHandSideFont: PlinkoConstants.TEXT_FONT_BOLD,
      leftHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR,
      rightHandSideFont: PlinkoConstants.TEXT_FONT_BOLD,
      rightHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR,
      maxSigFigs: 0
    };

    var optionsSample = {
      leftHandSideFont: PlinkoConstants.TEXT_FONT,
      leftHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR,
      rightHandSideFont: PlinkoConstants.TEXT_FONT,
      rightHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR
    };

    var optionsTheoretical = {
      leftHandSideFont: PlinkoConstants.TEXT_FONT,
      leftHandSideFill: PlinkoConstants.THEORETICAL_FONT_COLOR,
      rightHandSideFont: PlinkoConstants.TEXT_FONT,
      rightHandSideFill: PlinkoConstants.THEORETICAL_FONT_COLOR
    };

    var numberLandedBallsText = new EquationNode( 'N', 0, optionsTitle );
    var sampleAverageText = new EquationNode( xOverlineString, 0, optionsSample );
    var sampleStandardDeviationText = new EquationNode( 's', 0, optionsSample );
    var sampleStandardDeviationOfMeanText = new EquationNode( sMeanString, 0, optionsSample );

    var theoreticalAverageText = new EquationNode( muGreekString, 0, optionsTheoretical );
    var theoreticalStandardDeviationText = new EquationNode( sigmaGreekString, 0, optionsTheoretical );
    //var theoreticalStandardDeviationOfMeanText = new EquationNode( 'sd', 0, optionsTheoretical );

    Property.multilink( [ model.numberOfRowsProperty, model.probabilityProperty ], function( numberOfRows, probability ) {
      var integerNumberOfRows = numberOfRows;
      theoreticalAverageText.setRightHandSideOfEquation( model.getTheoreticalAverage( integerNumberOfRows, probability ) );
      theoreticalStandardDeviationText.setRightHandSideOfEquation( model.getTheoreticalStandardDeviation( integerNumberOfRows, probability ) );
    } );

    model.histogram.on( 'statisticsUpdated', function() {
      numberLandedBallsText.setRightHandSideOfEquation( model.histogram.landedBallsNumber,  {maxSigFigs: 0} );
      sampleAverageText.setRightHandSideOfEquation( model.histogram.average );
      sampleStandardDeviationText.setRightHandSideOfEquation( model.histogram.standardDeviation );
      sampleStandardDeviationOfMeanText.setRightHandSideOfEquation( model.histogram.standardDeviationOfMean );
    } );


    var histogramCheckBox = new CheckBox( new HistogramIcon(), model.histogramVisibleProperty );

    AccordionBox.call( this, new HBox( {
          spacing: 30,
          children: [
            new VBox( {
              spacing: 5, children: [
                sampleAverageText,
                sampleStandardDeviationText,
                sampleStandardDeviationOfMeanText
              ],
              align: 'left'
            } ),
            new VBox( {
              spacing: 5, children: [
                theoreticalAverageText,
                theoreticalStandardDeviationText,
                //             theoreticalStandardDeviationOfMeanText,
                histogramCheckBox
              ],
              align: 'left'
            } )
          ]
        }
      ),

      _.extend( {
        cornerRadius: 10,
        fill: PlinkoConstants.PANEL_BACKGROUND_COLOR,
        buttonXMargin: 10,
        buttonYMargin: 6,
        expandedProperty: expandedAccordionBoxProperty,
        resize: false,
        buttonAlign: 'right',
        titleNode: numberLandedBallsText,
        titleAlignX: 'left',
        titleXMargin: 10,
        contentXMargin: 8,
        contentYMargin: 5
      }, options )
    );

  }

  return inherit( AccordionBox, StatisticsDisplayAccordionBox, {
      reset: function() {
        this.expandedProperty.reset();
      },

      updateDisplay: function() {

      }
    }
  )
    ;
} )
;