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
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );

  // constants
  var BALL_MODE_VALUES = [ 'oneBall', 'tenBalls', 'allBalls', 'continuous' ]; // values for ballModeProperty
  var HOPPER_MODE_VALUES = [ 'ball', 'path', 'none' ]; // values for hopperModeProperty

  /**
   * @constructor
   */
  function PlinkoProbabilityCommonModel() {

    // @public
    PropertySet.call( this, {

      // {number} this can be a number between 0 and 1
      probability: PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.defaultValue,

      // {string} controls how many balls are dispensed when the 'play' button is pressed, see BALL_MODE_VALUES
      ballMode: 'oneBall',

      // {string} controls what comes out of the hopper above the Galton board, see HOPPER_MODE_VALUES
      hopperMode: 'ball',

      // {boolean} is the maximum number of balls reached?
      isBallCapReached: false,

      // {number} number of rows in the Galton board, must be an integer
      numberOfRows: PlinkoProbabilityConstants.ROWS_RANGE.defaultValue
    } );

    // validate string values
    this.ballModeProperty.link( function( ballMode ) {
      assert && assert( _.contains( BALL_MODE_VALUES, ballMode ), 'invalid ballMode: ' + ballMode );
    } );
    this.hopperModeProperty.link( function( hopperMode ) {
      assert && assert( _.contains( HOPPER_MODE_VALUES, hopperMode ), 'invalid hopperMode: ' + hopperMode );
    } );

    this.ballCreationTimeElapsed = 0; // @public {number} - time elapsed since last ball creation
    this.balls = new ObservableArray(); // @public
    this.galtonBoard = new GaltonBoard( this.numberOfRowsProperty ); // @public
    this.histogram = new Histogram( this.numberOfRowsProperty ); // @public

    // @public Indicates whether some ball has moved since the previous time step.
    // The view uses this to decide whether to call BallsNode.invalidatePaint.
    // This is an odd approach, necessitated by the fact that this sim doesn't follow the MVC pattern.
    // See https://github.com/phetsims/plinko-probability/issues/62 for details.
    this.someBallMoved = false;
  }

  plinkoProbability.register( 'PlinkoProbabilityCommonModel', PlinkoProbabilityCommonModel );

  return inherit( PropertySet, PlinkoProbabilityCommonModel, {

    /**
     * @override
     * @public
     */
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.balls.clear(); // clear all the model balls
      this.histogram.reset(); // empty out all the model bins
      this.ballCreationTimeElapsed = 0;
      this.someBallMoved = false;
    }
  } );
} );

