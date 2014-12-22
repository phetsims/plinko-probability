// Copyright 2002-2014, University of Colorado Boulder

/**
 * Accordion Box Node in That Display Statistics in Plinko Probability Simulation
 *
 */

define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var CheckBox = require( 'SUN/CheckBox' );
  var EquationNode = require( 'PLINKO/plinko-probability/view/EquationNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HistogramIcon = require( 'PLINKO/plinko-probability/view/HistogramIcon' );
//  var HStrut = require( 'SUN/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  // var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  // var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  // var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  //var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  //var bestFitLineString = require( 'string!PLINKO_PROBABILITY/bestFitLine' );
  //var residualsString = require( 'string!PLINKO_PROBABILITY/residuals' );
  //var squaredResidualsString = require( 'string!PLINKO_PROBABILITY/squaredResiduals' );

  // strings

  var muGreekString = '\u03BC';
  var sigmaGreekString = '\u03C3';
//  var overlineString = '\u0305';
  var xOverlineString = '\u0078\u0305';
  // TODO use subsupText;
  var sMeanString = '\u0073\u2098\u2091\u2090\u2099';
  // constants
//  var FONT = new PhetFont( 11 );
  var PANEL_BACKGROUND_COLOR = 'white';
  var SAMPLE_FONT_COLOR = 'blue';
  var THEORETICAL_FONT_COLOR = 'red';

  function StatisticsDisplayPanel( model, options ) {

    this.model = model;
    // var thisPanel = this;

    // property of the accordion Box that control its expansion
    this.expandedProperty = new Property( false );

    var numberLandedBallsText = new EquationNode( 'N', 0, {fill: SAMPLE_FONT_COLOR} );
    var sampleAverageText = new EquationNode( xOverlineString, 0, {fill: SAMPLE_FONT_COLOR} );
    var sampleStandardDeviationText = new EquationNode( 's', 0, {fill: SAMPLE_FONT_COLOR} );
    var sampleStandardDeviationOfMeanText = new EquationNode( sMeanString, 0, {fill: SAMPLE_FONT_COLOR} );

    var theoreticalAverageText = new EquationNode( muGreekString, 0, {fill: THEORETICAL_FONT_COLOR} );
    var theoreticalStandardDeviationText = new EquationNode( sigmaGreekString, 0, {fill: THEORETICAL_FONT_COLOR} );
    //var theoreticalStandardDeviationOfMeanText = new EquationNode( 'sd', 0, {fill: THEORETICAL_FONT_COLOR} );

    Property.multilink( [model.numberOfRowsProperty, model.probabilityProperty], function( numberOfRows, probability ) {
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
                numberLandedBallsText,
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
        fill: PANEL_BACKGROUND_COLOR,
        buttonXMargin: 10,
        buttonYMargin: 6,
        expandedProperty: this.expandedProperty,
        resize: false,
        //    titleNode:  ,
        titleXMargin: 0,
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