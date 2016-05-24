// Copyright 2014-2015, University of Colorado Boulder

/**
 * Equation Node that renders a text node of an equation of the form  'text' = 'number'
 * The left hand side of the equation can make use of <sup> and <sub> html tags
 * The numerical value can be updated through a public method.
 *
 * Martin Veillette (Berea College)
 */

define( function( require ) {
  'use strict';

  // modules
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  /**
   *
   * @param {string} leftHandSideOfEquation - the string that should appear on the left hand side of the equation
   * @param {number} rightHandSideOfEquation - the value (number) that should appear on the right hand side
   * @param {Object} [options]
   * @constructor
   */
  function EquationNode( leftHandSideOfEquation, rightHandSideOfEquation, options ) {

    options = _.extend( {
      leftHandSideFont: new PhetFont( 16 ),
      rightHandSideFont: new PhetFont( 16 ),
      leftHandSideFill: 'blue',
      rightHandSideFill: 'blue',
      positionOfEqualSign: 30,// position of the equal sign, (the left hand side is defined as zero).
      maxDecimalPlaces: 3
    }, options );

    // @private
    this.options = options;

    Node.call( this );

    this.leftHandSideOfEquationText = new SubSupText( leftHandSideOfEquation,
      {
        font: options.leftHandSideFont,
        fill: options.leftHandSideFill,
        subScale: 0.5
      } );
    this.equalSignText = new Text( ' = ',
      {
        font: options.leftHandSideFont,
        fill: options.leftHandSideFill
      } );
    this.rightHandSideOfEquationText = new Text( this.roundNumber( rightHandSideOfEquation ),
      {
        font: options.rightHandSideFont,
        fill: options.rightHandSideFill
      } );

    var hStrut = new HStrut( options.positionOfEqualSign );

    var mutableEquationText = new Node( {
      children: [
        hStrut,
        this.leftHandSideOfEquationText,
        this.equalSignText,
        this.rightHandSideOfEquationText
      ]
    } );

    // in general, we align the equation with respect to the equal sign (that's aesthetically pleasing)
    // but we don't want to to enforce this rule if the left hand side of the equation is too long.
    this.leftHandSideOfEquationText.right = options.positionOfEqualSign;
    this.equalSignText.left = this.leftHandSideOfEquationText.right;
    this.rightHandSideOfEquationText.left = this.equalSignText.right;

    this.addChild( mutableEquationText );
  }

  plinkoProbability.register( 'EquationNode', EquationNode );

  return inherit( Node, EquationNode, {
    /**
     *
     * @param {number} number
     * @public
     */
    setRightHandSideOfEquation: function( number ) {
      this.rightHandSideOfEquationText.text = this.roundNumber( number );
    },

    /**
     * Function that returns (for numbers smaller than ten) a number (as a string)  with a fixed number of decimal places
     * whereas for numbers larger than ten, the number/string is returned a fixed number of significant figures
     *
     * @param {number} number
     * @returns {string}
     * @private
     */
    roundNumber: function( number ) {

      // eg. if maxDecimalPlaces =3
      // 9999.11 -> 9999  (number larger than 10^3) are rounded to unity
      // 999.111 -> 999.1
      // 99.1111 -> 99.11
      // 9.11111 -> 9.111
      // 1.11111 -> 1.111
      // 0.11111 -> 0.111
      // 0.01111 -> 0.011
      // 0.00111 -> 0.001
      // 0.00011 -> 0.000

      // number = mantissa times 10^(exponent) where the mantissa is between 1 and 10 (or -1 to -10)
      var exponent = Math.floor( Math.log10( Math.abs( number ) ) );

      var decimalPlaces;
      if ( exponent >= this.options.maxDecimalPlaces ) {
        decimalPlaces = 0;
      }
      else if ( exponent > 0 ) {
        decimalPlaces = this.options.maxDecimalPlaces - exponent;
      }
      else {
        decimalPlaces = this.options.maxDecimalPlaces;
      }

      return Util.toFixed( number, decimalPlaces );
    }
  } );
} )
;
