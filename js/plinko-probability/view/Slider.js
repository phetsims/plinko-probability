// Copyright 2002-2015, University of Colorado Boulder

/**
 * Scenery Node of a slider with a title, a numerical panel that display the property value.
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

  function Slider( options ) {
    var thisNode = this,
      defaultOptions = {
        property: new Property( 0.5 ), // property of the slider
        range: new Range( 0, 1 ), // range of the property
        sliderSize: new Dimension2( 200, 110 ),
        tick: {step: 1, minText: '', maxText: ''}, // step is the distance between ticks and minText and MaxText are Strings
        title: '', // title above the numerical display
        patternValueUnit: '{0}', // eg. '{0} = {1}'  see StringUtils for examples
        buttonStep: 1, // incremental value obtained by pressing the left or right arrows
        decimalPlaces: 0, // the number of decimal places for the numerical value on the display - must be an integer greater or equal to zero
        magneticSnapping: true, // whether the slider sticks to values with increment of 10^(decimalPlaces)
        // custom track
        trackSize: new Dimension2( 140, 2 ),
        trackFill: 'black',
        // custom thumb
        thumbSize: new Dimension2( 22, 38 ),
        thumbFillEnabled: 'rgb(50,145,184)',
        thumbFillHighlighted: 'rgb(71,207,255)',
        // custom ticks
        tickLabelSpacing: 1,
        majorTickLength: 20,
        minorTickLength: 8,
        majorTickLineWidth: 1.5,
        minorTickLineWidth: 1.5,

        titleVerticalOffset: 0,
        titleFont: new PhetFont( 18 ),
        displayFont: new PhetFont( 18 ), // font for the numerical display
        tickFont: new PhetFont( 15 )
      };
    Node.call( thisNode );

    assert && assert( options.property.value <= options.range.max && options.property.value >= options.range.min, 'the property value must be within range' );

    options = _.extend( {}, defaultOptions, options );
    if ( !options.endDrag && options.magneticSnapping ) {
      // slider will update its position to magnetically stick to nice numerical values at the end of a drag events
      options.endDrag = function() {
        options.property.set( Util.toFixedNumber( options.property.value, options.decimalPlaces ) );
      };
    }

    thisNode.addChild( new Rectangle( -options.sliderSize.width / 2, 0, options.sliderSize.width, options.sliderSize.height ) );

    this.addChild( new Text( options.title, {centerX: thisNode.centerX, top: options.titleVerticalOffset, font: options.titleFont} ) );

    var hSlider = new HSlider( options.property, options.range, options );
    var hSliderNode = new Node( {children: [hSlider], x: (thisNode.width - options.trackSize.width) / 2, bottom: thisNode.height} );
    thisNode.addChild( hSliderNode );


    if ( options.tick && options.tick.step ) {
      var i = options.range.min;

      for ( i; i <= options.range.max; i += options.tick.step ) {

        if ( i === options.range.max ) {
          hSlider.addMajorTick( i, new Text( options.tick.maxText, {font: options.tickFont} ) );
        }
        else if ( i === options.range.min ) {
          hSlider.addMajorTick( i, new Text( options.tick.minText, {font: options.tickFont} ) );
        }
        else if ( i === (options.range.min + options.range.max) / 2 ) {
          hSlider.addMajorTick( i );
        }
        else {
          hSlider.addMinorTick( i );
        }
      }
    }


    var buttonNode = new Node( {y: 25} );

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

    // plus button to the right of the value
    var plusButton = new ArrowButton( 'right', buttonPropertyUpdate( options.buttonStep ), {
      right: options.sliderSize.width - 15,
      centerY: 15
    } );

    // minus button to the left of the value
    var minusButton = new ArrowButton( 'left', buttonPropertyUpdate( -options.buttonStep ), {left: 15, centerY: 15} );


    buttonNode.addChild( new Rectangle( 0, 0, 90, 30, 5, 5, {
      fill: '#FFF',
      stroke: '#000',
      lineWidth: 1,
      centerX: options.sliderSize.width / 2,
      top: 0
    } ) );


    var valueLabel = new Text( '', {font: options.displayFont, centerX: options.width / 2, top: 5} );

    buttonNode.addChild( plusButton );
    buttonNode.addChild( minusButton );
    buttonNode.addChild( valueLabel );
    this.addChild( buttonNode );


    thisNode.mutate( options );


    /**
     * Updates the display text and enabled/disabled the buttons if necessary
     *
     * @param {number} value
     */
    function updatePropertyObserver( value ) {
      var text = Util.toFixed( value, options.decimalPlaces );
      valueLabel.text = StringUtils.format( options.patternValueUnit, text );
      valueLabel.centerX = options.sliderSize.width / 2;
      plusButton.enabled = ( value <= options.range.max );
      minusButton.enabled = ( value >= options.range.min );
    }

    options.property.link( updatePropertyObserver );

  }

  return inherit( Node, Slider );
} );