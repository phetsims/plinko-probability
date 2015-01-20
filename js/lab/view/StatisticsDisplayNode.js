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
  var EquationNode = require( 'PLINKO/lab/view/EquationNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HistogramIcon = require( 'PLINKO/lab/view/HistogramIcon' );
//  var HStrut = require( 'SUN/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
  var Property = require( 'AXON/Property' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  //var bestFitLineString = require( 'string!PLINKO/bestFitLine' );

  // strings

  var muGreekString = '\u03BC';
  var sigmaGreekString = '\u03C3';
//  var overlineString = '\u0305';
  var xOverlineString = '\u0078\u0305';
  var sMeanString = '\u0073<sub>mean</sub>';

  /**
   *
   * @param {PlinkoProbabilityLabModel} model
   * @param {Object} options
   * @constructor
   */
  function StatisticsDisplayPanel( model, options ) {

    this.model = model;
    // var thisPanel = this;

    // property of the accordion Box that control its expansion
    this.expandedProperty = new Property( false );

    var optionsTitle = {
      leftHandSideFont: PlinkoConstants.TEXT_FONT_BOLD,
      leftHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR,
      rightHandSideFont: PlinkoConstants.TEXT_FONT_BOLD,
      rightHandSideFill: PlinkoConstants.SAMPLE_FONT_COLOR
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
      theoreticalAverageText.setRightHandSideOfEquation( model.getTheoreticalAverage() );
      theoreticalStandardDeviationText.setRightHandSideOfEquation( model.getTheoreticalStandardDeviation() );
    } );

    model.balls.addItemAddedListener( function( addedBall ) {

      //TODO: fix since it set the text before the ball is added
      addedBall.on( 'landed', function() {
        numberLandedBallsText.setRightHandSideOfEquation( model.landedBallsNumber );
        sampleAverageText.setRightHandSideOfEquation( model.average );
        sampleStandardDeviationText.setRightHandSideOfEquation( model.standardDeviation );
        sampleStandardDeviationOfMeanText.setRightHandSideOfEquation( model.standardDeviationOfMean );
      } );

      // Add the removal listener for if and when this dataPoint is removed from the model.
      model.balls.addItemRemovedListener( function removalListener( removedBall ) {
        if ( removedBall === addedBall ) {
          model.balls.removeItemRemovedListener( removalListener );
        }
      } );
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
        expandedProperty: this.expandedProperty,
        resize: false,
        buttonAlign: 'right',
        titleNode: numberLandedBallsText,
        titleAlign: 'left',
        titleXMargin: 10,
        contentXMargin: 8,
        contentYMargin: 5
      }, options )
    );

  }

  return inherit( AccordionBox, StatisticsDisplayPanel, {
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