/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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H0KgiPLJIjBDVSABhgYzDnrTqSUkjVgBIqzaDo21y/w1GsOczwqBBStbyPIt362UXWxuItS4Ys7nJdf1UGHEFQIVRAE4tqn/+zLEgAMHLDEYTukmgQqH4oXdGRIeZTwOFR05pCV/MCiMwqVbiq8yLa0KP0gB+jp7V3BaPu4yL7XktyDrISlHPPFxxsbjgyLLHh0ZAUhjdA7a5C3ZgcHRqHQx+GxjjxijyI8OW7DF++cG1DVe8FbL9Pb3d2v4H77Vb3Nbjb7ZALJLSo8AQKqxWjVepALIgsGzKe5PwdbQCWXqJmeQ//syxIYDB7wvFCx3ZAD5h+KJ3QzYaokrl3av5hm3RvmsuupG0YqpiJkwUKrHvYpmXIH0Akkbdk7qNPRwFhWd2Bx6YeYWVmCFrYo7NWQc+1WtQ5+12jRK8hyHZidlnklslI8wjYKsVFZ9B484KCEiXUONg+rCAIhE5SStwFVwQKDVfMNqIABGAAqMjOoLu+VijrUh4iYLcj0IqRrO6//7MMSLgwe8IxhOZYgQ4Ifihd0I2OUQ9ZPOoRYjN2LfFha9AFeHEjAqUrAf468yOSCEz3NDlVhCDz8pTYRW5nJ6z/6rJVo8sJkXvPHpzZVIln9L2qSf71MNJPzyKnei9uKQ+ywFCZ8DaeEKBRoiJwAWU4lwhGA0tcKPrd+SQ793OV3/n1F2FyfjRlymEqxIaw2gZA2MABle8jI1xf/7MsSUAgbkIxrOZSZRAQfiRc2s0OjzhBaYgtZNlBYBkAiBCYRA5ActjkRptmQG7rFbkV+zN7PIFv1yg2oEgtawvZE1F4v2bVpzJqXTLInXZa4UNuq+xAJgqQCYKoDRCuZIlzJEuZRJNIVHoUnoU3Ik3Ik3IknoUnoUnxmKopiiWUklmKopiiUaSSzFUUxSLDBliQSimTJZUSWbFxL/+zLEnAIHeCsUTmVmQNIEI5jNmJIBImCWPhGJolDiHQLBqHBPLCtx9wYBQrUSH4sa1En4sjU1+LI1Nfi3FG8W4o3i3VVMQU1FMy45OS4zVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxKeDxjwhEg3oxkDRhWMAnZiQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MMS4A8wAfxYGZSGIvYSbAMYwUFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError )
  .catch( e => { console.warn( 'promise rejection caught for audio decode, error = ' + e ) } );
export default wrappedAudioBuffer;