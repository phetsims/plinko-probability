// Copyright 2002-2015, University of Colorado Boulder

/*
 * RequireJS configuration file for the 'Plinko Probability' sim.
 * Paths are relative to the location of this file.
 */
require.config( {

  deps: [ 'plinko-probability-main' ],

  paths: {

    // third-party libs
    text: '../../sherpa/text-2.0.12',

    // PhET plugins
    image: '../../chipper/js/requirejs-plugins/image',
    string: '../../chipper/js/requirejs-plugins/string',

    // PhET libs, uppercase names to identify them in require.js imports
    AXON: '../../axon/js',
    BRAND: '../../brand/js',
    DOT: '../../dot/js',
    JOIST: '../../joist/js',
    KITE: '../../kite/js',
    PHET_CORE: '../../phet-core/js',
    PHETCOMMON: '../../phetcommon/js',
    REPOSITORY: '..',
    SCENERY: '../../scenery/js',
    SCENERY_PHET: '../../scenery-phet/js',
    SUN: '../../sun/js',

    // sim code
    PLINKO_PROBABILITY: '.'
  },

  // optional cache buster to make browser refresh load all included scripts, can be disabled with ?cacheBuster=false
  urlArgs: phet.chipper.getCacheBusterArgs()
} );
