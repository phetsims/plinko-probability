// Copyright 2014-2016, University of Colorado Boulder

/**
 * Common model (base type) for Plinko Probability
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
  var Histogram = require( 'PLINKO_PROBABILITY/common/model/Histogram' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  var PlinkoConstants = require( 'PLINKO_PROBABILITY/common/PlinkoConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );

  // constants
  var BALL_MODE_VALUES = [ 'oneBall', 'tenBalls', 'allBalls', 'continuous' ]; // values for ballModeProperty
  var HOPPER_MODE_VALUES = [ 'ball', 'path', 'none' ]; // values for hopperModeProperty

  /**
   * Creates common model for Plinko Probability
   * @constructor
   */
  function PlinkoProbabilityCommonModel() {

    // @public
    PropertySet.call( this, {

      // {number} this can be a number between 0 and 1
      probability: PlinkoConstants.BINARY_PROBABILITY_RANGE.defaultValue,

      // {string} controls how many balls are dispensed when the 'play' button is pressed, see BALL_MODE_VALUES
      ballMode: 'oneBall',

      // {string} controls what comes out of the hopper above the Galton board, see HOPPER_MODE_VALUES
      hopperMode: 'ball',

      // {boolean} is the maximum number of balls reached?
      isBallCapReached: false,

      // {number} number of rows in the Galton board, must be an integer
      numberOfRows: PlinkoConstants.ROWS_RANGE.defaultValue
    } );

    // validate string values
    this.ballModeProperty.link( function( ballMode ) {
      assert && assert( _.contains( BALL_MODE_VALUES, ballMode ), 'invalid ballMode: ' + ballMode );
    } );
    this.hopperModeProperty.link( function( hopperMode ) {
      assert && assert( _.contains( HOPPER_MODE_VALUES, hopperMode ), 'invalid hopperMode: ' + hopperMode );
    } );

    this.ballCreationTimeElapsed = 0; // @public {number} - time elapsed since last ball creation;

    // create an observable array of the model balls
    this.balls = new ObservableArray(); // @public

    // create the model for the Galton Board which describes the position of the pegs and their visibility
    this.galtonBoard = new GaltonBoard( this.numberOfRowsProperty ); // @public

    // create the model for the histogram
    this.histogram = new Histogram( this.numberOfRowsProperty ); // @public
  }

  plinkoProbability.register( 'PlinkoProbabilityCommonModel', PlinkoProbabilityCommonModel );

  return inherit( PropertySet, PlinkoProbabilityCommonModel, {

    /**
     * Reset of the model attributes.
     * @public
     * @override
     */
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.balls.clear(); // clear all the model balls
      this.histogram.reset(); // empty out all the model bins
      this.ballCreationTimeElapsed = 0;
    }
  } );
} );

