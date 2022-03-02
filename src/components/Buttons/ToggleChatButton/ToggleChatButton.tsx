import React, { useEffect, useState } from 'react';
import ChatIcon from '../../../icons/ChatIcon';
import clsx from 'clsx';
import { createStyles, IconButton, makeStyles, Theme } from '@material-ui/core';
import useChatContext from '../../../hooks/useChatContext/useChatContext';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';

export const ANIMATION_DURATION = 700;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconContainer: {
      width: `${theme.iconButtonWidth}px`,
    },
    circle: {
      width: '10px',
      height: '10px',
      backgroundColor: '#5BB75B',
      borderRadius: '50%',
      position: 'absolute',
      top: '12px',
      left: '28px',
      opacity: 0,
      transition: `opacity ${ANIMATION_DURATION * 0.5}ms ease-in`,
    },
    hasUnreadMessages: {
      opacity: 1,
    },
    ring: {
      border: '3px solid #5BB75B',
      borderRadius: '30px',
      height: '14px',
      width: '14px',
      position: 'absolute',
      left: '26px',
      top: '9px',
      opacity: 0,
    },
    animateRing: {
      animation: `$expand ${ANIMATION_DURATION}ms ease-out`,
      animationIterationCount: 1,
    },
    '@keyframes expand': {
      '0%': {
        transform: 'scale(0.1, 0.1)',
        opacity: 0,
      },
      '50%': {
        opacity: 1,
      },
      '100%': {
        transform: 'scale(1.4, 1.4)',
        opacity: 0,
      },
    },
    iconButton: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: '12px',
    },
    hover: {
      '&:hover': {
        borderBottom: `5px ${theme.brand} solid`,
        color: `${theme.brand}`,
      },
    },
  })
);

export default function ToggleChatButton() {
  const classes = useStyles();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { isChatWindowOpen, setIsChatWindowOpen, conversation, hasUnreadMessages } = useChatContext();
  const { setIsBackgroundSelectionOpen } = useVideoContext();

  const toggleChatWindow = () => {
    setIsChatWindowOpen(!isChatWindowOpen);
    setIsBackgroundSelectionOpen(false);
  };

  useEffect(() => {
    if (shouldAnimate) {
      setTimeout(() => setShouldAnimate(false), ANIMATION_DURATION);
    }
  }, [shouldAnimate]);

  useEffect(() => {
    if (conversation && !isChatWindowOpen) {
      const handleNewMessage = () => setShouldAnimate(true);
      conversation.on('messageAdded', handleNewMessage);
      return () => {
        conversation.off('messageAdded', handleNewMessage);
      };
    }
  }, [conversation, isChatWindowOpen]);

  return (
    <>
      <IconButton
        data-cy-chat-button
        classes={{ label: classes.iconButton, root: classes.hover }}
        onClick={toggleChatWindow}
        disabled={!conversation}
      >
        <div className={classes.iconContainer}>
          <ChatIcon />
          <div className={clsx(classes.ring, { [classes.animateRing]: shouldAnimate })} />
          <div className={clsx(classes.circle, { [classes.hasUnreadMessages]: hasUnreadMessages })} />
        </div>
        <div className={classes.label}>Chat</div>
      </IconButton>
    </>
  );
}
