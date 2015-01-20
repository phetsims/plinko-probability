// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model for Plinko Probability
 *
 * @author Martin Veillette (Berea College)
 */

define( function( require ) {
    'use strict';

    var Ball = require( 'PLINKO/common/model/Ball' );
    var DerivedProperty = require( 'AXON/DerivedProperty' );
    var GaltonBoard = require( 'PLINKO/common/model/GaltonBoard' );
    var inherit = require( 'PHET_CORE/inherit' );
    var PlinkoConstants = require( 'PLINKO/common/PlinkoConstants' );
    var PropertySet = require( 'AXON/PropertySet' );
    var ObservableArray = require( 'AXON/ObservableArray' );

    function PlinkoProbabilityLabModel() {

      var thisModel = this;

      PropertySet.call( this, {
        numberOfRowsForSlider: 12, ///  may not always be an integer
        probability: 0.5,
        fraction: false,
        number: false,
        autoScale: false,
        ball: false,
        path: false,
        none: false,
        pegHorizontalDistance: 1,
        pegDiagonalDistance: 1 / Math.sqrt( 2 ),
        pegInterval: 0.05,
        histogramVisible: false,
        isPlaying: false,
        isSoundEnabled: true

      } );

      this.numberOfRowsProperty = new DerivedProperty( [ this.numberOfRowsForSliderProperty ],
        function( numberOfRowsForSlider ) {
          return Math.round( numberOfRowsForSlider );
        } );

      this.trialNumber = 0; //number of current trial (current ball drop)
      this.landedBallsNumber = 0; //number of balls in the histogram
      this.average = 0;  ///average of the sample (near zero for p = 0.5)
      this.sumOfSquares = 0; //sum of squares of trials, used to compute the variance
      this.variance = 0; // (unbiased) sample variance
      this.standardDeviation = 0; //standard deviation (a.k.a. sigma) the square root of the variance
      this.standardDeviationOfMean = 0; ////standard deviation of the mean

      this.galtonBoard = new GaltonBoard( PlinkoConstants.ROWS_RANGE.max );
      this.balls = new ObservableArray();
      //    this.histogram = new Array( this.maxNumberOfRows ).map( Number.prototype.valueOf, 0 );  //
      this.histogram = [];
      // there are one more bin than the maxNumber of Rows
      for ( var i = 0; i < PlinkoConstants.ROWS_RANGE.max + 1; i++ ) {
        this.histogram.push( 0 );
      }

      this.numberOfRowsProperty.link( function( numberOfRows ) {
        thisModel.balls.clear();
        thisModel.histogram = [];
        thisModel.histogramTotalNumber = 0;
        //  thisModel.histogram.map( Number.prototype.valueOf, 0 );  //
        for ( var i = 0; i < PlinkoConstants.ROWS_RANGE.max + 1; i++ ) {
          thisModel.histogram.push( 0 );
        }
      } );

      //this.balls.addItemAddedListener( function( addedBall ) {
      //  addedBall.indexProperty.link( function( binIndex ) {
      //    thisModel.histogram[binIndex]++;
      //    thisModel.histogramTotalNumber++;
      //    thisModel.updateStatistics[binIndex];
      //    console.log( thisModel.histogram );
      //    // Add the removal listener for if and when this ball is removed from the model.
      //    thisModel.balls.addItemRemovedListener( function removalListener( removedBall ) {
      //      if ( removedBall === addedBall ) {
      //        thisModel.balls.removeItemRemovedListener( removalListener );
      //      }
      //    } );
      //  } );
      //} );

      //this.balls.forEach( function( ball ) {
      //  ball.indexProperty.link( function( index ) {
      //    thisModel.histogram[index]++;
      //    console.log( thisModel.histogram );
      //  } );
      //} );

      this.isPlayingProperty.link( function( isPlaying ) {
        if ( isPlaying ) {
          for ( var i = 0; i < 1; i++ ) {
            thisModel.addNewBall();
          }
        }
      } );
    }

    return inherit( PropertySet, PlinkoProbabilityLabModel, {
      step: function( dt ) {
        if ( dt > 1000 ) {
          //TODO why do we need this condition
          dt = 1000;
        }
        for ( var i = 0; i < this.balls.length; i++ ) {
          this.balls.get( i ).step( 20 * dt, this.probability, this.numberOfRowsProperty.value );
        }
      },

      reset: function() {
        PropertySet.prototype.reset.call( this );
      },

      addNewBall: function() {
        var self = this;
        var addedBall = new Ball();
        this.balls.push( addedBall );
        addedBall.on( 'landed', function() {
          self.addBallToHistogram( addedBall.binIndex );
          self.balls.remove( addedBall );
        } );
      },

      //choose a random step direction: +1 with prob p or -1 with prob q = 1-p
      nextStep: function() {
        var step;
        var randNbr = Math.random();
        if ( randNbr < this.probability ) {
          step = 1;
        }
        else {
          step = -1;
        }
        return step;
      },

      getTheoreticalAverage: function() {
        return this.numberOfRowsProperty.value * this.probability;
      },

      getTheoreticalStandardDeviation: function() {
        return Math.sqrt( this.numberOfRowsProperty.value * this.probability * (1 - this.probability) );
      },

      getTheoreticalStandardDeviationOfMean: function() {
        if ( this.landedBallsNumber > 0 ) {
          return Math.sqrt( this.numberOfRowsProperty.value * this.probability * (1 - this.probability ) / this.landedBallsNumber );
        }
        else {
          return 'Not A Number';
        }

      },
      /**
       * http://en.wikipedia.org/wiki/Binomial_coefficient
       *
       * @param {number} n, the number of rows of pegs
       * @param {number} k, the bin number
       * @returns {number}  "n choose k"= n!/( k! (n-k)!)
       */
      getBinomialCoefficient: function( n, k ) {
        // we want (n)*(n-1)*(n-2)..(n-k+1) divided by (k)*(k-1)*(k-2)...*2*1
        var coefficient = 1;
        var i;
        for ( i = n - k + 1; i <= n; i++ ) {
          coefficient *= i;
        }
        for ( i = 1; i <= k; i++ ) {
          coefficient /= i;
        }
        return coefficient;
      },

      /**
       *http://en.wikipedia.org/wiki/Binomial_distribution
       *
       * @param {number} n , the number of rows of pegs
       * @param {number} k , the bin number
       * @param {number} p, probability of getting k
       * @returns {number} P(n,k,p)= ("n choose k") * p^k * p^(n-k)
       */
      getBinomialProbability: function( n, k, p ) {
        var binomialCoefficient = this.getBinomialCoefficient( n, k );
        var statisticalWeight = Math.pow( p, k ) * Math.pow( 1 - p, n - k );
        return binomialCoefficient * statisticalWeight;
      },

      /**
       * http://en.wikipedia.org/wiki/Binomial_distribution
       *
       * @returns {number}
       */
      getBinomialDistribution: function() {
        var binomialCoefficientsArray = [];
        var k;
        // let's not try to be clever and let's go forward with the brute force approach
        for ( k = 0; k < this.numberOfRowsProperty.value; k++ ) {
          binomialCoefficientsArray.push( this.getBinomialProbability( this.numberOfRowsProperty.value, k, this.probability ) );
        }
        return binomialCoefficientsArray;
      },

      updateStatistics: function( binIndex ) {
        var N = this.landedBallsNumber;
        this.average = ((N - 1) * this.average + binIndex) / N;
        this.sumOfSquares += binIndex * binIndex;
        this.variance = (this.sumOfSquares - N * this.average * this.average) / (N - 1);
        this.standardDeviation = Math.sqrt( this.variance );
        this.standardDeviationOfMean = this.standardDeviation / Math.sqrt( N );

        console.log(
          'N=', N,
          'mu=', this.average.toFixed( 3 ),
          'sd=', this.standardDeviation.toFixed( 3 ),
          'sdm=', this.standardDeviationOfMean.toFixed( 3 )
        );
      },

      resetStatistics: function() {
        this.trialNumber = 0;
        this.landedBallsNumber = 0;
        this.average = 0;
        this.sumOfSquares = 0;
        this.variance = 0;
        this.standardDeviation = 0;
        this.standardDeviationOfMean = 0;
      },

      addBallToHistogram: function( binIndex ) {
        this.landedBallsNumber++;
        this.histogram[ binIndex ]++;
        console.log( 'histogram', this.histogram );
        this.updateStatistics( binIndex );
      }

    } )
      ;

  }
)
;

