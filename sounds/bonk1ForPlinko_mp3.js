/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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p4mlwIMgTFaD+g5DAAmO/7+KZM23kVotiw3q198u7//7MsRFggbEMyJM9eCAxgTlJY4MKuvm9/26ejtQNpk0uJpoELRhG9JZd7MgaG5gY4hwIO44AS+X/aYj0ihIJgOXIU9IFBmVEbogfQHKMRaHVaXKtq+sjagAVoQ0AqPsMqLiw66HqgAIhKqAJLD8reZTQKwhxDt2GBWLBSCUlvLHPLETa+B0cHwOnjwDMsJAM0hgiPgYOj4Mnx4DJ8v/+zDEVYMGdCckTXBk0P6GY0GOmCiGb3Kd4ACtV+qAIQJmGHP0KoAIFxAiDYnk106EqM5MU4glkvCUjJJNQiSpOjK5ipaMuHIdkMSVJWEpeSi0lElwlFqEkxnJiwZKkpjQxPWjJKSGQsWDhsVg4XFyebNk2aMy6wdLAC1QENIidaYdMlhilsj9d7AMgcNpVZp2LMdeZSrYTOXtGSX/+zLEXwAHdC0rLeWECX0Q5eScMBP0obY+MnVZCiZ+UXW5QikLjzd6wItQiVH0cHAoGubAj8Sf8//12/S9NeUe60kwXa4XQ9w0OrQHAXCRqucQNACA4Fr2icQZiSSY71VqO3fnIHFGFlhiLwTYk0n7bft6uyDlTnWFRpG1qi4gOgVoBsIYaUUaAnD2pBRnmgGCklwvWjeonUen5FIW//syxFWDBfgbDs3hhBDAhKFFjYwSVtX50iKMfhn+3/7//+bt/PvXrpS7HshH0QWY7F6VXiaf6y1rtb4GneG1ZHG5hwAIDGFPR0YiYeAqbrEDBmC6MVisVhgUCgkQKQ84KIECBAgQQm/xERBbh4e/w8PDw8A/w8MAAAA/lgAAEz//jw+ecv1uOHqKf1JJwRg/9aKwJMOWMgKNMjeBtv/7MsRpg0c4MwhOZESA6pmgwY4IKXCckGoHSaYmK12s7WrK1atW2CjvBQoKCgr/hBQUCiv+kFBQV3/0FJBX//5BQ1VMQU1FMy45OS4zVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zDEcwPKUF8SDaRpiOMHIwDMMBlVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/+zLEcIPAAAGkAAAAIAAANIAAAARVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;