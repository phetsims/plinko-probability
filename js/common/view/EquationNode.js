// Copyright 2014-2023, University of Colorado Boulder

/**
 * Equation Node that renders a text node of an equation of the form  'text' = 'number'
 * The left hand side of the equation can make use of <sup> and <sub> html tags
 * The numerical value can be updated through a public method.
 *
 * Martin Veillette (Berea College)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { HStrut, Node, RichText, Text } from '../../../../scenery/js/imports.js';
import plinkoProbability from '../../plinkoProbability.js';

class EquationNode extends Node {
  /**
   * @param {string} leftHandSideOfEquation - the string that should appear on the left hand side of the equation
   * @param {number} rightHandSideOfEquation - the value (number) that should appear on the right hand side
   * @param {Object} [options]
   */
  constructor( leftHandSideOfEquation, rightHandSideOfEquation, options ) {

    super();

    options = merge( {
      leftHandSideFont: new PhetFont( 16 ),
      rightHandSideFont: new PhetFont( 16 ),
      leftHandSideFill: 'blue',
      rightHandSideFill: 'blue',
      positionOfEqualSign: 30, // position of the equal sign, (the left hand side is defined as zero).
      maxDecimalPlaces: 3,
      leftHandSideMaxWidth: 45  // maximum width of left hand side of equation
    }, options );

    // @private
    this.options = options;

    const leftHandSideOfEquationText = new RichText( leftHandSideOfEquation, {
      font: options.leftHandSideFont,
      fill: options.leftHandSideFill,
      subScale: 0.5,
      maxWidth: options.leftHandSideMaxWidth
    } );

    const equalSignText = new Text( ' = ', {
      font: options.leftHandSideFont,
      fill: options.leftHandSideFill
    } );

    const rightHandSideOfEquationText = new Text( this.roundNumber( rightHandSideOfEquation ), {
      font: options.rightHandSideFont,
      fill: options.rightHandSideFill
    } );

    // @private
    this.rightHandSideOfEquationText = rightHandSideOfEquationText;

    const hStrut = new HStrut( options.positionOfEqualSign );

    // create the mutable Equation, the right hand side is mutable
    const mutableEquationText = new Node( {
      children: [
        hStrut,
        leftHandSideOfEquationText,
        equalSignText,
        rightHandSideOfEquationText
      ]
    } );

    // in general, we align the equation with respect to the equal sign (that's aesthetically pleasing)
    // but we don't want to to enforce this rule if the left hand side of the equation is too long.
    leftHandSideOfEquationText.right = options.positionOfEqualSign;
    equalSignText.left = leftHandSideOfEquationText.right;
    rightHandSideOfEquationText.left = equalSignText.right;

    this.addChild( mutableEquationText );
  }


  /**
   * Update the value of the right side of the equation (a number)
   *
   * @param {number} value
   * @public
   */
  setRightHandSideOfEquation( value ) {
    this.rightHandSideOfEquationText.string = this.roundNumber( value );
  }

  /**
   * Function that returns (for numbers smaller than ten) a number (as a string)  with a fixed number of decimal places
   * whereas for numbers larger than ten, the number/string is returned a fixed number of significant figures
   *
   * @param {number} number
   * @returns {string}
   * @private
   */
  roundNumber( number ) {

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
    const exponent = Math.floor( Utils.log10( Math.abs( number ) ) );

    let decimalPlaces;
    if ( exponent >= this.options.maxDecimalPlaces ) {
      decimalPlaces = 0;
    }
    else if ( exponent > 0 ) {
      decimalPlaces = this.options.maxDecimalPlaces - exponent;
    }
    else {
      decimalPlaces = this.options.maxDecimalPlaces;
    }

    return Utils.toFixed( number, decimalPlaces );
  }
}

plinkoProbability.register( 'EquationNode', EquationNode );

export default EquationNode;