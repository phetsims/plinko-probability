// Copyright 2015-2022, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play Button and three radio buttons.
 *
 * @author Martin Veillette (Berea College)
 */

import merge from '../../../../phet-core/js/merge.js';
import MathSymbols from '../../../../scenery-phet/js/MathSymbols.js';
import { HBox, HStrut, Text } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import PlinkoProbabilityConstants from '../../common/PlinkoProbabilityConstants.js';
import PlinkoProbabilityQueryParameters from '../../common/PlinkoProbabilityQueryParameters.js';
import BallNode from '../../common/view/BallNode.js';
import PlayButton from '../../common/view/PlayButton.js';
import plinkoProbability from '../../plinkoProbability.js';

// constants
const BALL_RADIUS = PlinkoProbabilityConstants.BALL_RADIUS;

class IntroPlayPanel extends Panel {

  /**
   * @param {IntroModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {
      align: 'center',
      xMargin: 7,
      yMargin: 15,
      stroke: 'black',
      lineWidth: 1,
      minWidth: 0.1,
      titleToControlsVerticalSpace: 5
    }, options );

    const fontOptions = { font: PlinkoProbabilityConstants.PANEL_FONT, maxWidth: 190 };

    // Creation of radio button group for ball setting
    const ballModeRadioButtons = new VerticalAquaRadioButtonGroup( model.ballModeProperty, [
      {
        createNode: tandem => new HBox( {
          spacing: BALL_RADIUS / 2,
          children: [ new BallNode( BALL_RADIUS ), new Text( `${MathSymbols.TIMES}1`, fontOptions ) ]
        } ), value: 'oneBall'
      },
      {
        createNode: tandem => new HBox( {
          spacing: BALL_RADIUS / 2,
          children: [ new BallNode( BALL_RADIUS ), new Text( `${MathSymbols.TIMES}10`, fontOptions ) ]
        } ), value: 'tenBalls'
      },
      {
        createNode: tandem => new HBox( {
          spacing: BALL_RADIUS / 2,
          children: [ new BallNode( BALL_RADIUS ), new Text( MathSymbols.TIMES + PlinkoProbabilityQueryParameters.maxBallsIntro, fontOptions ) ]
        } ), value: 'maxBalls'
      }
    ], {
      radioButtonOptions: { radius: 8 },
      spacing: 10,     // vertical spacing between each radio button
      touchAreaXDilation: 5
    } );

    //Creation of play button
    const playButton = new PlayButton( {
      listener: model.updateBallsToCreateNumber.bind( model ),
      enabled: true
    } );

    // Disables play button if maximum amount of balls are dropped
    model.isBallCapReachedProperty.lazyLink( isBallCapReached => {
      playButton.enabled = !isBallCapReached;
    } );

    //Creation of play button panel box
    const playAndRadioButtonBox = new HBox( {
      spacing: 0,
      children: [
        new HStrut( 20 ),     // spacing between left panel margin and play button
        playButton,
        new HStrut( 25 ),     // spacing between play button and radio buttons
        ballModeRadioButtons,
        new HStrut( 10 )      // spacing between radio buttons and right margin
      ]
    } );

    super( playAndRadioButtonBox, options );
  }
}

plinkoProbability.register( 'IntroPlayPanel', IntroPlayPanel );
export default IntroPlayPanel;