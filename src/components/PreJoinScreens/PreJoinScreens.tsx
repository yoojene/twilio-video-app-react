import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import { USERNAME, AGENTNAME, ROOMNAME } from '../../constants';
import useUser from '../../utils/useUser/useUser';

export enum Steps {
  roomNameStep,
  deviceSelectionStep,
}

export default function PreJoinScreens() {
  const { user } = useAppState();
  const { getAudioAndVideoTracks } = useVideoContext();

  const { URLRoomName, URLUserName } = useParams();
  const [step, setStep] = useState(Steps.roomNameStep);

  const [name, setName] = useState<string>(user?.displayName || '');
  const [roomName, setRoomName] = useState<string>('');

  const [mediaError, setMediaError] = useState<Error>();
  const checkIsUser = useUser();

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
      if (user?.displayName) {
        setStep(Steps.deviceSelectionStep);
      }
    }
  }, [user, URLRoomName]);

  useEffect(() => {
    if (URLUserName) {
      setName(URLUserName);
    }
  }, [URLUserName]);

  useEffect(() => {
    if (step === Steps.roomNameStep && !mediaError) {
      getAudioAndVideoTracks().catch(error => {
        console.log('Error acquiring local media:');
        console.dir(error);
        setMediaError(error);
      });
    }
  }, [getAudioAndVideoTracks, step, mediaError]);

  useEffect(() => {
    console.log('pre join screen ueffect');

    let userName;
    let agentName;
    let roomName;

    // Check local storage for values which are stored from the API (Agent) / SMS link (User), fall back to constants if empty.
    localStorage.getItem('userName') === 'undefined' || !localStorage.getItem('userName')
      ? (userName = USERNAME)
      : (userName = localStorage.getItem('userName'));
    localStorage.getItem('agentName') === 'undefined' || !localStorage.getItem('agentName')
      ? (agentName = AGENTNAME)
      : (agentName = localStorage.getItem('agentName'));
    localStorage.getItem('roomName') === 'undefined' || !localStorage.getItem('roomName')
      ? (roomName = ROOMNAME)
      : (roomName = localStorage.getItem('userName'));

    console.log(userName);
    console.log(agentName);
    console.log(roomName);

    checkIsUser() ? setName(userName!) : setName(agentName!);

    setRoomName(roomName!);
  }, []);

  return (
    <IntroContainer>
      <MediaErrorSnackbar error={mediaError} />
      {step === Steps.roomNameStep && (
        <RoomNameScreen name={name} roomName={roomName} setName={setName} setRoomName={setRoomName} />
      )}

      {step === Steps.deviceSelectionStep && (
        <DeviceSelectionScreen name={name} roomName={roomName} setStep={setStep} />
      )}
    </IntroContainer>
  );
}
