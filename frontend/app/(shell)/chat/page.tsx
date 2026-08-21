"use client";

import { useEffect } from "react";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { Composer } from "@/components/chat/composer";
import { useChatStore } from "@/lib/store";

export default function ChatPage() {
  const { messages, init, uploadPhoto, sendUserText } = useChatStore();

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className="flex min-h-screen flex-col">
      <ChatHeader />
      <div className="flex-1">
        <MessageList messages={messages} onUpload={uploadPhoto} />
      </div>
      <Composer onSend={sendUserText} onUpload={uploadPhoto} />
    </div>
  );
}
