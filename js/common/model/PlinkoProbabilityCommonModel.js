// Copyright 2014-2019, University of Colorado Boulder

/**
 * Common model (base type) for Plinko Probability
 *
 * @author Martin Veillette (Berea College)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Emitter = require( 'AXON/Emitter' );
  const GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
  const Histogram = require( 'PLINKO_PROBABILITY/common/model/Histogram' );
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  const PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  const StringProperty = require( 'AXON/StringProperty' );

  // constants
  const BALL_MODE_VALUES = [ 'oneBall', 'tenBalls', 'maxBalls', 'continuous' ]; // values for ballModeProperty
  const HOPPER_MODE_VALUES = [ 'ball', 'path', 'none' ]; // values for hopperModeProperty

  /**
   * @constructor
   */
  function PlinkoProbabilityCommonModel() {

    // @public {number} this can be a number between 0 and 1
    this.probabilityProperty = new NumberProperty( PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.defaultValue, {
      range: PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE
    } );

    // @public {string} controls how many balls are dispensed when the 'play' button is pressed
    this.ballModeProperty = new StringProperty( 'oneBall', {
      validValues: BALL_MODE_VALUES
    } );

    // {string} controls what comes out of the hopper above the Galton board
    this.hopperModeProperty = new StringProperty( 'ball', {
      validValues: HOPPER_MODE_VALUES
    } );

    // {boolean} is the maximum number of balls reached?
    this.isBallCapReachedProperty = new BooleanProperty( false );

    // {number} number of rows in the Galton board
    this.numberOfRowsProperty = new NumberProperty( PlinkoProbabilityConstants.ROWS_RANGE.defaultValue, {
      range: PlinkoProbabilityConstants.ROWS_RANGE,
      numberType: 'Integer'
    } );

    this.ballCreationTimeElapsed = 0; // @public {number} - time elapsed since last ball creation
    this.balls = new ObservableArray(); // @public
    this.galtonBoard = new GaltonBoard( this.numberOfRowsProperty ); // @public
    this.histogram = new Histogram( this.numberOfRowsProperty ); // @public

    // @public Fires when one or more balls moves.
    // See https://github.com/phetsims/plinko-probability/issues/62 for details.
    this.ballsMovedEmitter = new Emitter();

    const eraseThis = this.erase.bind( this );
    this.probabilityProperty.link( eraseThis );
    this.numberOfRowsProperty.link( eraseThis );
  }

  plinkoProbability.register( 'PlinkoProbabilityCommonModel', PlinkoProbabilityCommonModel );

  return inherit( Object, PlinkoProbabilityCommonModel, {

    /**
     * Called when the 'Reset All' button is pressed.
     *
     * @override
     * @public
     */
    reset: function() {
      this.probabilityProperty.reset();
      this.ballModeProperty.reset();
      this.hopperModeProperty.reset();
      this.isBallCapReachedProperty.reset();
      this.numberOfRowsProperty.reset();
      this.erase();
    },

    /**
     * Called when the erase button is pressed.
     *
     * @public
     */
    erase: function() {
      this.balls.clear(); // clear the balls on the galton board
      this.histogram.reset(); // reset the histogram statistics
      this.isBallCapReachedProperty.set( false );
      this.ballsMovedEmitter.emit();
    }
  } );
} );

