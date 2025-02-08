// Copyright 2015-2025, University of Colorado Boulder

/**
 * Scenery Node that represents a Panel with a Play/Pause and two radio buttons .
 *
 * @author Martin Veillette (Berea College)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/layout/nodes/HBox.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import HStrut from '../../../../scenery/js/nodes/HStrut.js';
import BooleanToggleNode from '../../../../sun/js/BooleanToggleNode.js';
import Panel from '../../../../sun/js/Panel.js';
import VerticalAquaRadioButtonGroup from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import PlinkoProbabilityConstants from '../../common/PlinkoProbabilityConstants.js';
import BallNode from '../../common/view/BallNode.js';
import PauseButton from '../../common/view/PauseButton.js';
import PlayButton from '../../common/view/PlayButton.js';
import plinkoProbability from '../../plinkoProbability.js';

// constants
const BALL_RADIUS = PlinkoProbabilityConstants.BALL_RADIUS;

class LabPlayPanel extends Panel {

  /**
   * @param {LabModel} model
   * @param {Object} [options]
   */
  constructor( model, options ) {

    options = merge( {
      align: 'center',
      xMargin: 10,
      yMargin: 10,
      stroke: 'black',
      lineWidth: 1,
      minWidth: 0,
      titleToControlsVerticalSpace: 5
    }, options );

    // create the icon for oneBall mode, a representation for a ball

    // create an ellipsis (the punctuation mark, not the geometrical shape)
    const threeDots = new HBox( {
      spacing: 2,
      children: [
        new HStrut( BALL_RADIUS ),
        new Circle( 1, { fill: 'black' } ),
        new Circle( 1, { fill: 'black' } ),
        new Circle( 1, { fill: 'black' } )
      ]
    } );

    // the ball size is not necessarily twice the radius
    const ballWidth = new BallNode( BALL_RADIUS ).width;

    // create the vertical radio group buttons for the one ball and continuous mode.
    const ballModeRadioButtons = new VerticalAquaRadioButtonGroup( model.ballModeProperty, [ {
      createNode: () => new BallNode( BALL_RADIUS ), value: 'oneBall'
    }, {
      createNode: () => new HBox( {
        align: 'bottom',
        spacing: -ballWidth / 2, // negative spacing
        children: [
          new BallNode( BALL_RADIUS ),
          new BallNode( BALL_RADIUS ),
          new BallNode( BALL_RADIUS ),
          new BallNode( BALL_RADIUS ),
          new BallNode( BALL_RADIUS ),
          threeDots
        ]
      } ), value: 'continuous'
    }
    ], {
      radioButtonOptions: { radius: 8 },
      touchAreaXDilation: 5,
      align: 'left',
      spacing: 13 // vertical spacing between radio buttons
    } );

    // true makes the play button visible, false makes the pause button visible
    const playButtonVisibleProperty = new BooleanProperty( true );

    // create the play button
    const playButton = new PlayButton( {
      listener: () => {
        if ( model.isBallCapReachedProperty.get() ) {
          model.isBallCapReachedProperty.notifyListenersStatic();
        }
        else {
          if ( model.ballModeProperty.get() === 'continuous' ) {
            playButtonVisibleProperty.set( false ); // make the pause button visible
            model.isPlayingProperty.set( true ); //set isPlayingProperty to true signifying that balls are being dropped
          }
          else {
            model.addNewBall(); // if it is not continuous then we assume it is at 'oneBall'
          }
        }
      }
    } );

    // create the pause button
    const pauseButton = new PauseButton( {
      listener: () => {
        playButtonVisibleProperty.set( true ); // make the play button visible
        model.isPlayingProperty.set( false ); // set isPlayingProperty to false signifying that no balls are being dropped
      }
    } );

    const playPlayPauseButton = new BooleanToggleNode( playButtonVisibleProperty, playButton, pauseButton );

    // link the ballModeProperty to the state of the playPauseButton
    model.ballModeProperty.link( () => {
      model.isPlayingProperty.set( false ); // if the radio buttons change then we would like to change the playing property
      playButtonVisibleProperty.set( true );
    } );

    // create the content of the panel, with the play pause button and the radio buttons
    const startVBox = new HBox( {
      spacing: 20,
      children: [
        playPlayPauseButton,
        ballModeRadioButtons
      ]
    } );

    super( startVBox, options );

    // @public
    this.playButtonVisibleProperty = playButtonVisibleProperty;

    // Disables play button if maximum amount of balls are dropped
    model.isBallCapReachedProperty.lazyLink( isBallCapReached => {
      playButton.enabled = !isBallCapReached;
    } );
  }
}

plinkoProbability.register( 'LabPlayPanel', LabPlayPanel );
export default LabPlayPanel;