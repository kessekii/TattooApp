import React, { useEffect, useState } from 'react';
import { Channel } from 'stream-chat-react';

import { init, SearchIndex } from 'emoji-mart';
import data from '@emoji-mart/data';

import { ChatUpgrades } from './ChatUpgrades';
import { GamingChatInner } from './GamingChatInner';
import { GamingChatNotification } from './GamingChatNotification';
import { GamingParticipants } from './GamingParticipants';
import { GamingThreadHeader } from './GamingThreadHeader';

import { getColor, getRandomUserRole, participants } from '../../assets/data';
import { useChecklist } from '../../hooks/useChecklistTasks';

import { useConnectUser } from '../../hooks/useConnectUser';
import { useLayoutController } from '../../contexts/LayoutController';
import type { Channel as ChannelT } from 'stream-chat';
import type { StreamChatType } from '../../global';
import { MessageTimestampController } from '../../contexts/MessageTimestampController';
import ChatComponent from '../../pages/components/chat';

init({ data });

const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('apikey') || import.meta.env.REACT_APP_STREAM_KEY;
const userId = urlParams.get('user') || import.meta.env.REACT_APP_USER_ID;
const userToken = urlParams.get('user_token') || import.meta.env.REACT_APP_USER_TOKEN;
const targetOrigin = urlParams.get('target_origin') || import.meta.env.REACT_APP_TARGET_ORIGIN;

const userToConnect = {
  id: userId!,
  color: getColor(),
  userRole: getRandomUserRole(),
};

export const GamingChat = (props: {chatId}) => {
  const [channel, setChannel] = useState<ChannelT<StreamChatType> | null>(null);
  const { memberListVisible, popUpText, upgradePanelVisible, chatVisible } = useLayoutController();
  const chatClient = useConnectUser<StreamChatType>(apiKey!, userToConnect, userToken);
  useChecklist({ chatClient, targetOrigin });

  useEffect(() => {
   

    const loadChat = async () => {
      const channel = chatClient.channel('gaming', 'gaming-demo', { name: 'Gaming Demo' });
      await channel.watch();
      setChannel(channel);
    };

    loadChat();
  }, [chatClient]);

  

  return (
    <section
      className={`sidebar ${memberListVisible} ${chatVisible} ${
        upgradePanelVisible ? 'show-upgrade' : ''
      }`}
    >
      <ChatComponent chatId={props.chatId}></ChatComponent>
      <GamingParticipants participants={participants} />
      <ChatUpgrades />
    </section>
  );
};
