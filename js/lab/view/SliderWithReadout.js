// Copyright 2002-2015, University of Colorado Boulder

/**
 * Scenery Node of a slider with a title, a numerical readout panel that display the property value.
 * In addition, there are two step buttons on either ends of the numerical display to fine tune the value of the property.
 * The slider has optional tick settings.
 *
 * @author Anton Ulyanov (Mlearner)
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var ArrowButton = require( 'SCENERY_PHET/buttons/ArrowButton' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  function SliderWithReadout( options ) {

    var sliderWithReadout = this;
    options = _.extend( {
        property: new Property( 0.5 ), // property of the slider
        range: new Range( 0, 1 ), // range of the property

        title: '', // (string) title above the numerical display
        patternValueUnit: '{0}', // eg. '{0}  {1}'  {0} is the value and {1} is the unitString
        unitString: 'm',  // will not be used if patterValueUnit does not make use of the {1} element

        readOutFill: 'white', // color of the background rectangular readout fill
        readOutStroke: 'black', // color of the stroke around the background rectangle readout
        readoutBackgroundWidth: 60,  // in scenery coordinates
        readoutBackgroundHeight: 24, // should exceed the value used in displayFont

        buttonStep: 1, // incremental value obtained by pressing the left or right arrows
        decimalPlaces: 0, // the number of decimal places for the numerical value on the display - must be an integer greater or equal to zero
        magneticSnapping: true, // whether the slider sticks to allowed values, i.e. (rounded) values shown on the readout

        verticalSpacing: 8, // control vertical spacing between scenery nodes
        horizontalSpacing: 10, // control spacing between horizontal scenery nodes
        titleFont: new PhetFont( { size: 16, weight: 'bold' } ),
        displayFont: new PhetFont( { size: 14 } ), // font for the numerical display

        // options for the left and right push buttons
        arrowHeight: 15,
        arrowAspectRatio: Math.sqrt( 3 ) / 2  //(width over height)
      },
      options );

    // options for the slider (HSlider)
    options.slider = _.extend( {
        // custom track
        trackSize: new Dimension2( 140, 2 ),
        trackFill: 'black',
        // custom thumb
        thumbSize: new Dimension2( 22, 38 ),
        thumbFillEnabled: 'rgb(50,145,184)',
        thumbFillHighlighted: 'rgb(71,207,255)',
        // custom ticks
        tickFont: new PhetFont( { size: 12 } ),
        majorTickLength: 10,
        minorTickLength: 5,
        majorTickLineWidth: 1.5,
        minorTickLineWidth: 1.5,

        tick: {
          step: 1, minText: '', maxText: ''
        } // step is the distance between ticks (in property value),  (minText and MaxText are Strings)
      },
      options.slider );

    Node.call( this );

    assert && assert( options.property.value <= options.range.max && options.property.value >= options.range.min, 'the property value must be within range' );

    if ( options.magneticSnapping ) {
      // slider will update its position to stick 'magnetically' to nice numerical (property) values at the end of a drag event
      options.slider.constrainValue = function( value ) {
        return Util.toFixedNumber( value, options.decimalPlaces );
      };
    }

    // create label title
    var labelTitle = new Text( options.title, { font: options.titleFont } );

    // @public create slider
    this.hSlider = new HSlider( options.property, options.range, options.slider );

    // create an invisible rectangle that encompasses the slider (and its thumb) such that this node has a width that exceeds
    // the dynamical width of the slider
    // TODO: does it need to be 2* width of thumbSize, why 1 is not enough
    var rectangleSlider = new Rectangle( 0, 0, 2 * options.slider.thumbSize.width + options.slider.trackSize.width, this.hSlider.height );

    // create ticks on slider
    if ( options.slider.tick && options.slider.tick.step ) {
      var tickValue = options.range.min;

      for ( tickValue; tickValue <= options.range.max; tickValue += options.slider.tick.step ) {

        if ( tickValue === options.range.max ) {
          sliderWithReadout.hSlider.addMajorTick( tickValue, new Text( options.slider.tick.maxText, { font: options.slider.tickFont } ) );
        }
        else if ( tickValue === options.range.min ) {
          sliderWithReadout.hSlider.addMajorTick( tickValue, new Text( options.slider.tick.minText, { font: options.slider.tickFont } ) );
        }
        else if ( tickValue === (options.range.min + options.range.max) / 2 ) {
          sliderWithReadout.hSlider.addMajorTick( tickValue );
        }
        else {
          sliderWithReadout.hSlider.addMinorTick( tickValue );
        }
      }
    }

    /**
     *
     * @param {number} increment - add the increment to the property value (subject to clamping)
     * @returns {Function}
     */
    function buttonPropertyUpdate( increment ) {
      return function() {
        options.property.set( Util.clamp( options.property.value + increment, options.range.min, options.range.max ) );
      };
    }

    // define arrow Button Options
    var arrowButtonOptions = { arrowHeight: options.arrowHeight, arrowWidth: options.arrowHeight * options.arrowAspectRatio };

    // create plus button to the right of the value
    var rightArrowButton = new ArrowButton( 'right', buttonPropertyUpdate( options.buttonStep ), arrowButtonOptions );

    // create minus button to the left of the value
    var leftArrowButton = new ArrowButton( 'left', buttonPropertyUpdate( -options.buttonStep ), arrowButtonOptions );

    // Create and add the readout, including the background.
    var readoutText = new Text( '', { font: options.displayFont } );
    var readoutBackground = new Rectangle( 0, 0, options.readoutBackgroundWidth, options.readoutBackgroundHeight, 4, 4,
      {
        fill: options.readOutFill,
        stroke: options.readOutStroke
      }
    );

    //TODO: add labelTitle only if non null: otherwise it will add unnecessary white space at the top
    this.addChild( labelTitle );
    this.addChild( leftArrowButton );
    this.addChild( rightArrowButton );
    this.addChild( readoutBackground );
    this.addChild( readoutText );
    this.addChild( rectangleSlider );
    this.addChild( sliderWithReadout.hSlider );

    // layout
    var centerX = 0; // center horizontal location of the ReadOut
    var centerY = 0; // center vertical location of the Readout.
    labelTitle.centerX = centerX;
    sliderWithReadout.hSlider.centerX = centerX;
    rectangleSlider.centerX = centerX;
    readoutBackground.centerX = centerX;
    readoutText.centerX = centerX;
    readoutBackground.centerY = centerY;
    labelTitle.bottom = readoutBackground.top - options.verticalSpacing;
    sliderWithReadout.hSlider.top = readoutBackground.bottom + options.verticalSpacing;
    readoutText.centerY = readoutBackground.centerY;
    rightArrowButton.centerY = readoutBackground.centerY;
    leftArrowButton.centerY = rightArrowButton.centerY;
    rightArrowButton.left = readoutBackground.right + options.horizontalSpacing;
    leftArrowButton.right = readoutBackground.left - options.horizontalSpacing;

    this.mutate( options );

    /**
     * Updates the display text and enabled/disabled the buttons if necessary
     *
     * @param {number} value
     */
    function updatePropertyObserver( value ) {
      var text = Util.toFixed( value, options.decimalPlaces );
      readoutText.text = StringUtils.format( options.patternValueUnit, text, options.unitString );
      readoutText.centerX = centerX;
      rightArrowButton.enabled = ( value < options.range.max );
      leftArrowButton.enabled = ( value > options.range.min );
    }

    options.property.link( updatePropertyObserver );

  }

  return inherit( Node, SliderWithReadout, {} );
} );