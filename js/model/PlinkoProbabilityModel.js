// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for Plinko Probability
 */

define( function( require ) {
  'use strict';

  var Property = require( 'AXON/Property' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var Ball = require ( 'PLINKO/model/Ball' );


  function PlinkoProbabilityModel() {
    this.numberOfRows = new Property(23);
    this.probability = new Property(0.5);

    this.balls = new ObservableArray([]);

    this.fraction = new Property(false);
    this.number = new Property(false);
    this.autoScale = new Property(false);

    this.ball = new Property(false);
    this.path = new Property(false);
    this.none = new Property(false);
  }

  PlinkoProbabilityModel.prototype = {
    constructor: PlinkoProbabilityModel,

    step: function( dt ) {
      if (dt > 1000) {
        dt = 1000;
      }

    },

    reset: function() {

    },

    //Minimum Number of Rows
    minNumOfRows: 5,
    //Maximum Number of Rows
    maxNumOfRows: 40,
    pegHorizontalDistance: new Property(1),
    pegDiagonalDistance: new Property(1 / Math.sqrt(2)),
    pegInterval: new Property(0.05),

    addNewBall: function () {
      this.balls.push(new Ball());
    }

  };

  return PlinkoProbabilityModel;
} );
