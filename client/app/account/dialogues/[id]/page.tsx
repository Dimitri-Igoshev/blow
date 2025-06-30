"use client";

import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { cn } from "@heroui/theme";
import { use, useEffect, useRef, useState } from "react";
import { useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";

import {
  useGetChatMessagesQuery,
  useGetChatsQuery,
  useSendMessageMutation,
  useUpdateMessageMutation,
} from "@/redux/services/chatApi";
import { useGetMeQuery } from "@/redux/services/userApi";
import { config } from "@/common/env";
import { getCityString } from "@/helper/getCityString";
import { Message } from "@/components/Message";
import { InfoModal } from "@/components/InfoModal";
import { isPremium } from "@/helper/checkIsActive";
import { ROUTES } from "@/app/routes";

interface ProfileViewProps {
  params: any;
}

export default function AccountDialogues({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [currentChat, setCurrentChat] = useState<any>();
  const [text, setText] = useState("");

  const { data: me } = useGetMeQuery(null);
  const { data: chats, refetch } = useGetChatsQuery(me?._id, {
    skip: !me?._id,
  });
  const { data: chat, refetch: refetch2 } = useGetChatMessagesQuery(
    // @ts-ignore
    currentChat?._id,
    { skip: !currentChat?._id },
  );

  const [send] = useSendMessageMutation();

  const getInterlocutor = (chat: any) => {
    return chat?.sender?._id === me?._id ? chat.recipient : chat.sender;
  };

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
      refetch2();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!chats || currentChat) return;

    if (id === "1") {
      setCurrentChat(chats[0]);
      readMessages(chats[0]);
    } else {
      setCurrentChat(chats.find((item: any) => item._id === id));
      readMessages(chats.find((item: any) => item._id === id));
    }
  }, [chats]);

  const {
    isOpen: isPremiumRequired,
    onOpen: onPremiumRequired,
    onOpenChange: onPremiumRequiredChange,
  } = useDisclosure();

  const handleSubmit = async () => {
    if (!text) return;

    const body = {
      chat: chat?._id,
      sender: me._id,
      recipient: getInterlocutor(currentChat)._id,
      text,
    };

    send(body)
      .then((res) => setText(""))
      .catch((err) => setText(""));
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        setText((prev) => prev + "\n");
      } else {
        event.preventDefault();
        if (text.trim() !== "") {
          handleSubmit();
        }
      }
    }
  };

  useEffect(() => {
    if (!me) return;
    if (me?.sex === "male" && !isPremium(me)) {
      onPremiumRequired();
    }
  }, [me]);

  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      // @ts-ignore
      container.scrollTop = container.scrollHeight;
    }
  }, [chat]);

  const [sortedChats, setSortedChats] = useState<any[]>([]);

  function sortChatsByLastMessage(chats: any) {
    return [...chats].sort((a: any, b: any) => {
      const aLastMessage = a.messages[0];
      const bLastMessage = b.messages[0];

      const aDate = aLastMessage
        ? new Date(aLastMessage.updatedAt)
        : new Date(0);
      const bDate = bLastMessage
        ? new Date(bLastMessage.updatedAt)
        : new Date(0);

      // @ts-ignore
      return bDate - aDate;
    });
  }

  useEffect(() => {
    if (!chat) return;

    setSortedChats(sortChatsByLastMessage(chats));
  }, [chat]);

  const hasUnreadedMesages = (chat: any) => {
    let quantity = 0;

    chat?.messages?.forEach((message: any) => {
      if (message?.sender !== me?._id && message.isReaded === false) {
        quantity += 1;
      }
    });

    return quantity;
  };

  const [updateMessage] = useUpdateMessageMutation();

  const readMessages = (chat: any) => {
    chat?.messages?.forEach(async (message: any) => {
      if (!message.isReaded && message?.sender !== me?._id) {
        updateMessage({ id: message._id, body: { isReaded: true } });
      }
    });
  };

  return (
    <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-[30px] min-h-screen max-h-screen sm:max-h-auto">
      <div className="flex w-full items-center justify-between">
        {currentChat ? (
          <Button
            className="flex md:hidden items-center ml-3"
            radius="full"
            onPress={() => setCurrentChat(null)}
          >
            Назад
          </Button>
        ) : (
          <h1 className="flex md:hidden font-semibold text-[36px]">Диалоги</h1>
        )}
        <h1 className="hidden md:flex font-semibold text-[36px]">Диалоги</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 h-[100%]">
        <div
          className={cn(
            "col-span-1 flex-col gap-1 w-full mt-8 overflow-y-scroll hide-scroll relative",
            {
              "hidden md:flex": currentChat,
              flex: !currentChat,
            },
          )}
          style={{ height: (window.innerHeight / 100) * 65 }}
        >
          {sortedChats?.map((chat: any) => (
            <button
              key={chat._id}
              className={cn(
                "h-[60px] flex gap-2.5 bg-white dark:bg-foreground-100 p-[5px] justify-between items-center transition-all",
                {
                  ["md:mr-6 rounded-[24px]"]: currentChat?._id !== chat._id,
                  ["md:mr-0 rounded-[24px] rounded-r-none"]:
                    currentChat?._id === chat._id,
                },
              )}
              onClick={() => {
                setCurrentChat(chat);

                if (hasUnreadedMesages(chat)) {
                  readMessages(chat);
                }
              }}
            >
              <Image
                alt=""
                className="rounded-[20px] z-0 relative w-[50px] min-w-[50px] min-h-[50px]"
                height={50}
                src={
                  getInterlocutor(chat)?.photos[0]?.url
                    ? `${config.MEDIA_URL}/${getInterlocutor(chat)?.photos[0]?.url}`
                    : me?.sex === "male"
                      ? "/men.jpg"
                      : "/woman.jpg"
                }
                style={{ objectFit: "cover" }}
                width={50}
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(
                    ROUTES.ACCOUNT.SEARCH + "/" + getInterlocutor(chat)?._id,
                  );
                }}
              />

              <div className="flex flex-col justify-center items-start text-sm w-full">
                <p className="font-semibold">
                  {getInterlocutor(chat)?.firstName
                    ? getInterlocutor(chat)?.firstName
                    : getInterlocutor(chat)?.sex === "male"
                      ? "Мужчина"
                      : "Девушка"}
                </p>
                <p className="-mt-[2px]">
                  {getInterlocutor(chat)?.age},{" "}
                  {getCityString(getInterlocutor(chat)?.city)}
                </p>
              </div>

              {currentChat?._id !== chat?._id &&
              hasUnreadedMesages(chat) > 0 ? (
                <div className="w-4 min-w-4 h-4 rounded-full bg-primary text-white text-[8px] flex font-semibold justify-center items-center -mt-[24px] mr-1">
                  {hasUnreadedMesages(chat)}
                </div>
              ) : null}
            </button>
          ))}
        </div>

        <div className="relative col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 flex flex-col h-full pb-[70px]">
          <div className="rounded-[24px] border-[7px] p-3 border-white dark:border-foreground-100">
            <div
              ref={containerRef}
              className={cn(
                "col-span-1 md:col-span-2 p-3 py-3.5 pr-6 lg:col-span-3 xl:col-span-4 w-full rounded-[24px] relative text-[14px] overflow-y-scroll scroll-transparent flex-1",
                {
                  "hidden md:flex": !currentChat,
                },
              )}
              style={{ height: ((window.innerHeight - 210) / 100) * 70 }}
            >
              <div className="flex flex-col gap-4 w-full">
                {chat ? (
                  <>
                    {chat?.map((message: any, idx: number) => (
                      <Message
                        message={message}
                        sameSender={
                          chat?.[idx - 1]?.sender?._id === message?.sender?._id
                        }
                        key={message?._id}
                        // left={message?.sender?._id !== me?._id}
                        left
                      />
                    ))}
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div
            className="flex items-center gap-3 p-3 md:p-0 bg-white dark:bg-foreground-100 md:bg-transparent fixed bottom-0 left-0 right-0 md:static md:mt-3"
          >
            <Input
              classNames={{
                input: "bg-transparent dark:text-white",
                inputWrapper: "dark:bg-foreground-200",
              }}
              placeholder="Текст сообщения"
              radius="full"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              className=""
              color="primary"
              radius="full"
              variant="solid"
              onPress={handleSubmit}
            >
              Отправить
            </Button>
          </div>
        </div>
      </div>

      <InfoModal
        actionBtn="Купить"
        isOpen={isPremiumRequired}
        text={
          "Для того чтобы общаться с девушками, Вам нужно купить премиум подписку"
        }
        title={"Нужен премиум"}
        onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
        onOpenChange={() => router.back()}
      />
    </div>
  );
}
