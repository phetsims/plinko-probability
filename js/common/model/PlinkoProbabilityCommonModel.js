// Copyright 2014-2017, University of Colorado Boulder

/**
 * Common model (base type) for Plinko Probability
 *
 * @author Martin Veillette (Berea College)
 */
define( function( require ) {
  'use strict';

  // modules
  var Emitter = require( 'AXON/Emitter' );
  var GaltonBoard = require( 'PLINKO_PROBABILITY/common/model/GaltonBoard' );
  var Histogram = require( 'PLINKO_PROBABILITY/common/model/Histogram' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var plinkoProbability = require( 'PLINKO_PROBABILITY/plinkoProbability' );
  var PlinkoProbabilityConstants = require( 'PLINKO_PROBABILITY/common/PlinkoProbabilityConstants' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );

  // phet-io modules
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  // constants
  var BALL_MODE_VALUES = [ 'oneBall', 'tenBalls', 'allBalls', 'continuous' ]; // values for ballModeProperty
  var HOPPER_MODE_VALUES = [ 'ball', 'path', 'none' ]; // values for hopperModeProperty

  /**
   * @constructor
   */
  function PlinkoProbabilityCommonModel() {

    // @public {number} this can be a number between 0 and 1
    this.probabilityProperty = new Property( PlinkoProbabilityConstants.BINARY_PROBABILITY_RANGE.defaultValue );

    // @public {string} controls how many balls are dispensed when the 'play' button is pressed, see BALL_MODE_VALUES
    this.ballModeProperty = new Property( 'oneBall', { phetioType: PropertyIO( TString ) } );

    // {string} controls what comes out of the hopper above the Galton board, see HOPPER_MODE_VALUES
    this.hopperModeProperty = new Property( 'ball', { phetioType: PropertyIO( TString ) } );

    // {boolean} is the maximum number of balls reached?
    this.isBallCapReachedProperty = new Property( false );

    // {number} number of rows in the Galton board, must be an integer
    this.numberOfRowsProperty = new Property( PlinkoProbabilityConstants.ROWS_RANGE.defaultValue );

    // validate string values
    this.ballModeProperty.link( function( ballMode ) {
      assert && assert( _.includes( BALL_MODE_VALUES, ballMode ), 'invalid ballMode: ' + ballMode );
    } );
    this.hopperModeProperty.link( function( hopperMode ) {
      assert && assert( _.includes( HOPPER_MODE_VALUES, hopperMode ), 'invalid hopperMode: ' + hopperMode );
    } );

    this.ballCreationTimeElapsed = 0; // @public {number} - time elapsed since last ball creation
    this.balls = new ObservableArray(); // @public
    this.galtonBoard = new GaltonBoard( this.numberOfRowsProperty ); // @public
    this.histogram = new Histogram( this.numberOfRowsProperty ); // @public

    // @public Fires when one or more balls moves.
    // See https://github.com/phetsims/plinko-probability/issues/62 for details.
    this.ballsMovedEmitter = new Emitter();

    var eraseThis = this.erase.bind( this );
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

