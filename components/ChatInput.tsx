"use client";
import { supabseBrowser } from "@/lib/supabase/browser";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";

export default function ChatInput() {
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const setOptimisticids = useMessage((state) => state.setOptimisticids);
  const supabase = supabseBrowser();
  const handleSendMessage = async (text: string) => {
    if (text.trim()) {
      const newMessage = {
        id: uuidv4(),
        text,
        send_by: user?.id,
        is_edit: false,
        created_at: new Date().toString(),
        users: {
          id: user?.id,
          avatar_url: user?.user_metadata.avatar_url,
          created_at: new Date().toString(),
          display_name: user?.user_metadata.user_name,
        },
      };

      addMessage(newMessage as Imessage);
      setOptimisticids(newMessage.id);
      // call to supabase
      const { error } = await supabase.from("messages").insert({
        id: newMessage.id, // add id here
        text,
      });
      if (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Message cannot be empty");
    }
  };
  return (
    <div className='p-5'>
      <Input
        placeholder='Send message'
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
