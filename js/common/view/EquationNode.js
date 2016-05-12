// Copyright 2014-2015, University of Colorado Boulder

/**
 * Equation Node that renders a text node of an equation of the form  'text' = 'number'
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

  // strings
//  var plusString = '\u002B'; // we want a large + sign
//  var minusString = '\u2212';


  /**
   *
   * @param {string} leftHandSideOfEquation
   * @param {number} rightHandSideOfEquation
   * @param {Object} [options]
   * @constructor
   */
  function EquationNode( leftHandSideOfEquation, rightHandSideOfEquation, options ) {

    options = _.extend( {
      leftHandSideFont: new PhetFont( 16 ),
      rightHandSideFont: new PhetFont( 16 ),
      leftHandSideFill: 'blue',
      rightHandSideFill: 'blue',
      maxSigFigs: 3
    }, options );

    Node.call( this );

    this.leftHandSideOfEquationText = new SubSupText( leftHandSideOfEquation,
      {
        font: options.leftHandSideFont,
        fill: options.leftHandSideFill,
        subScale: 0.25
      } );
    this.equalSignText = new Text( ' = ',
      {
        font: options.leftHandSideFont,
        fill: options.leftHandSideFill
      } );
    this.rightHandSideOfEquationText = new Text( this.roundNumber( rightHandSideOfEquation, options ),
      {
        font: options.rightHandSideFont,
        fill: options.rightHandSideFill
      } );

    var mutableEquationText = new Node( {
      children: [
        new HStrut( 5 ),
        this.leftHandSideOfEquationText,
        this.equalSignText,
        this.rightHandSideOfEquationText
      ]
    } );

    this.equalSignText.left = 30;
    this.leftHandSideOfEquationText.right = this.equalSignText.left;
    this.rightHandSideOfEquationText.left = 50;
    this.addChild( mutableEquationText );
  }

  plinkoProbability.register( 'EquationNode', EquationNode );

  return inherit( Node, EquationNode, {
    setRightHandSideOfEquation: function( number, options ) {
      this.rightHandSideOfEquationText.text = this.roundNumber( number, options );
    },

    /**
     * Function that returns (for numbers smaller than ten) a number (as a string)  with a fixed number of decimal places
     * whereas for numbers larger than ten, the number/string is returned a fixed number of significant figures
     *
     * @param {number} number
     * @param {Object} [options]
     * @returns {string}
     */
    roundNumber: function( number, options ) {
      options = _.extend( {
        maxSigFigs: 3
      }, options );

      // eg. if maxSigFigs =3
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
      if ( exponent >= options.maxSigFigs ) {
        decimalPlaces = 0;
      }
      else if ( exponent > 0 ) {
        decimalPlaces = options.maxSigFigs - exponent;
      }
      else {
        decimalPlaces = options.maxSigFigs;
      }

      return Util.toFixed( number, decimalPlaces );
    }
  } );
} )
;
