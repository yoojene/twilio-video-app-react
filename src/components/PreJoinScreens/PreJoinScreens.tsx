import React, { useState, useEffect, FormEvent } from 'react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import MediaErrorSnackbar from './MediaErrorSnackbar/MediaErrorSnackbar';
import RoomNameScreen from './RoomNameScreen/RoomNameScreen';
import { useAppState } from '../../state';
import { useParams } from 'react-router-dom';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';
import useChatContext from '../../hooks/useChatContext/useChatContext';
import { CircularProgress } from '@material-ui/core';
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
    console.log(localStorage.getItem('userName'));
    console.log(localStorage.getItem('agentName'));
    console.log(localStorage.getItem('roomName'));

    checkIsUser() ? setName(localStorage.getItem('userName')!) : setName(localStorage.getItem('agentName')!);

    setRoomName(localStorage.getItem('roomName')!);
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
