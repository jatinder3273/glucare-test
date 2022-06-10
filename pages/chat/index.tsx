import React, { useEffect, useState } from "react";
import DashboardLayout from "@components/Layouts/DashboardLayout";
import { StreamChat } from "stream-chat";
import { CHAT_API_KEY, getChatToken, getCurrentUser } from "utils";
import dynamic from "next/dynamic";
import "stream-chat-react/dist/css/index.css";

const ChatInbox = dynamic(
  () => import("@components/PagesComponent/Chat/ChatInbox"),
  { loading: () => <p>Loading...</p> }
);

const ChatStream = () => {
  const [loader, setLoader] = useState(true);
  const [filtersListParams, setFiltersListParams] = useState<any>(null);
  const [channel, setChannel] = useState<any>(null);
  const [chatClientInstance, setChatClientInstance] = useState<any>(null);
  const connectUser = async () => {
    const { currentUser } = getCurrentUser();
    const chatToken = getChatToken();
    const chatClient = StreamChat.getInstance(CHAT_API_KEY);
    setChatClientInstance(chatClient);
    chatClient.connectUser(
      {
        id: `user${currentUser.profile.user}`,
        name: `${currentUser.profile.first_name} ${currentUser.profile.last_name}`,
        image:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png",
      },
      chatToken
    );

    const channelFilters = {
      members: { $in: [`user${currentUser.profile.user}`] },
    };
    const channelSort = { last_message_at: -1 };
    const options = { limit: 10 };
    setFiltersListParams({
      channelFilters,
      channelSort,
      options,
    });
    const filter = {
      type: "messaging",
      members: { $in: [`user${currentUser.profile.user}`] },
    };
    const sort = [{ last_message_at: -1 }];
    // @ts-ignore
    const channels = await chatClient.queryChannels(filter, sort, {
      watch: true, // this is the default
      state: true,
    });
    console.log(channels, "channels");
    setLoader(false);
    setChannel(channels[1]);
  };
  useEffect(() => {
    setLoader(true);
    connectUser();
  }, []);

  if (!chatClientInstance) return null;
  return (
    <DashboardLayout HeaderSubTitle="Chat">
      <ChatInbox
        loader={loader}
        chatClientInstance={chatClientInstance}
        filtersListParams={filtersListParams}
        channel={channel}
      />
    </DashboardLayout>
  );
};

export default ChatStream;
