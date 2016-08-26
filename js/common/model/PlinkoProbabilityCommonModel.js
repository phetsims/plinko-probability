// Copyright 2014-2016, University of Colorado Boulder

/**
 * Common Model for Plinko Probability
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

  /**
   * Creates common model for Plinko Probability
   * @constructor
   */
  function PlinkoProbabilityCommonModel() {

    // @public
    PropertySet.call( this, {
      probability: PlinkoConstants.BINARY_PROBABILITY_RANGE.defaultValue, // {number} this can be a number between 0 and 1
      histogramMode: 'count', // {string} acceptable values are 'count', 'fraction' and 'cylinder'
      ballMode: 'oneBall', // {string} acceptable values are 'oneBall', 'tenBalls', 'allBalls' and 'continuous'
      isBallCapReached: false, // {boolean} is the maximum of balls reached?
      numberOfRows: PlinkoConstants.ROWS_RANGE.defaultValue /// {number} must be an integer
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
     */
    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.balls.clear(); // clear all the model balls
      this.histogram.reset(); // empty out all the model bins
      this.ballCreationTimeElapsed = 0;
    }
  } );
} );

