'use client';

import { useGetChatsQuery } from "@/redux/services/chatApi"
import { useGetMeQuery } from "@/redux/services/userApi"

export const Messages = () => {
  const { data: me } = useGetMeQuery(null);
  const { data: chats } = useGetChatsQuery(me?._id, { skip: !me?._id });

  return (
    <div>
      <h2>Сообщения</h2>
      <ul>
        {chats?.[0]?.messages.map((msg, idx) => (
          <li key={idx}>
            {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
};
