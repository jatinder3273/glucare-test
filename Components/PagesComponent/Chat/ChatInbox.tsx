import React from "react";

import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
  ChannelList,
} from "stream-chat-react";

const ChatInbox = ({
  chatClientInstance,
  filtersListParams,
  channel,
  loader,
}: any) => {
  return (
    <Chat client={chatClientInstance} theme="messaging light">
      {!loader ? (
        <>
          <ChannelList
            filters={filtersListParams.channelFilters}
            options={filtersListParams.options}
          />
          <Channel>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </>
      ) : (
        ""
      )}
    </Chat>
  );
};

export default ChatInbox;
