import React from "react";
import { Button } from "./ui/button";
import { supabseBrowser } from "@/lib/supabase/browser";
import { LIMIT_MESSAGES } from "@/lib/constant";
import { getFromAndTo } from "@/lib/utils";
import { useMessage } from "@/lib/store/messages";
import { toast } from "sonner";

export default function LoadMoreMessages() {
  const page = useMessage((state) => state.page);
  const setMessages = useMessage((state) => state.setMessages);
  const hasMore = useMessage((state) => state.hasMore);

  const fetchMore = async () => {
    const { from, to } = getFromAndTo(page, LIMIT_MESSAGES);
    const supabase = await supabseBrowser();

    const { data, error } = await supabase
      .from("messages")
      .select("*,users(*)")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
    } else {
      setMessages(data.reverse());
    }
  };

  if (hasMore) {
    return (
      <Button onClick={fetchMore} variant='outline' className='w-full'>
        Load More
      </Button>
    );
  }
  return <></>;
}
