import { useEffect } from "react";
import { initLiveChat } from "../lib/livechatLoader";

export default function LiveChatScript() {
  useEffect(() => {
    initLiveChat();
  }, []);
  return null;
}
