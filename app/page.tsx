import ChatAbout from "@/components/ChatAbout";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessages from "@/components/ChatMessages";
import ListMessages from "@/components/ListMessages";
import InitUser from "@/lib/store/InitUser";
import { supabaseServer } from "@/lib/supabase/server";
import React from "react";

export default async function page() {
  const supabase = supabaseServer();
  const { data } = await (await supabase).auth.getSession();
  console.log(data.session?.user);

  return (
    <>
      <div className='max-w-3xl mx-auto md:py-10 h-screen'>
        <div className='h-full border rounded-md flex flex-col relative'>
          <ChatHeader user={data.session?.user} />
          {data.session?.user ? (
            <>
              <ChatMessages />
              <ChatInput />
            </>
          ) : (
            <ChatAbout />
          )}
        </div>
      </div>
      <InitUser user={data.session?.user} />
    </>
  );
}
