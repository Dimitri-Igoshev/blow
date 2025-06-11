"use client";

import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { cn } from "@heroui/theme";
import { use, useEffect, useState } from "react";
import {
	useGetChatMessagesQuery,
	useGetChatsQuery,
	useSendMessageMutation,
} from "@/redux/services/chatApi";
import { useGetMeQuery } from "@/redux/services/userApi";
import { config } from "@/common/env";
import { getCityString } from "@/helper/getCityString";
import { Message } from "@/components/Message";
import { InfoModal } from "@/components/InfoModal";
import { useDisclosure } from "@heroui/react"
import { isPremium } from "@/helper/checkIsActive"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/app/routes"

interface ProfileViewProps {
	params: any;
}

export default function AccountDialogues({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const [currentChat, setCurrentChat] = useState(null);
	const [text, setText] = useState("");

	const { data: me } = useGetMeQuery(null);
	const { data: chats, refetch } = useGetChatsQuery(me?._id, {
		skip: !me?._id,
	});
	const { data: chat, refetch: refetch2 } = useGetChatMessagesQuery(
		currentChat?._id
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
		if (!chats) return;

		if (id == 1) {
			setCurrentChat(chats[0]);
		} else {
			setCurrentChat(chats.find((item) => item._id === id));
		}
	}, [chats]);

		const {
				isOpen: isPremiumRequired,
				onOpen: onPremiumRequired,
				onOpenChange: onPremiumRequiredChange,
			} = useDisclosure();

	const handleSubmit = async () => {
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

	// const [windowHeight, setWindowHeight] = useState<number>();

	useEffect(() => {
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = "auto";
		};
	}, []);

	const handleKeyDown = (event) => {
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
		if (me?.sex === 'male' && !isPremium(me)) {
			onPremiumRequired()
		}
	}, [me])

	// useEffect(() => {
	// 	if (window?.innerHeight) return;
	// 	setWindowHeight((window?.innerHeight / 100) * 50);
	// }, [window?.innerHeight]);

	// useEffect(() => {
	// 	if (!chat) return;

	// 	console.log(chat);
	// }, [chat]);

	return (
		<div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-[30px] h-screen">
			{/* <div className="flex w-full items-center justify-between">
				{currentChat ? (
					<button
						className="flex md:hidden items-start h-[16px] ml-3"
						onClick={() => setCurrentChat(null)}
					>
						Назад
					</button>
				) : (
					<h1 className="flex md:hidden font-semibold text-[36px]">Диалоги</h1>
				)}
				<h1 className="hidden md:flex font-semibold text-[36px]">Диалоги</h1>
			</div> */}

			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 h-[100%]">
				<div
					className={cn(
						"col-span-1 flex-col gap-1 w-full mt-8 overflow-y-scroll hide-scroll relative",
						{
							"hidden md:flex": currentChat,
							flex: !currentChat,
						}
					)}
					style={{ height: (window.innerHeight / 100) * 65 }}
				>
					{chats?.map((chat: any) => (
						<button
							key={chat._id}
							className={cn(
								"h-[60px] flex gap-2.5 bg-white dark:bg-foreground-100 p-[5px] justify-between items-center transition-all",
								{
									["md:mr-6 rounded-[24px]"]: currentChat?._id !== chat._id,
									["md:mr-0 rounded-[24px] rounded-r-none"]:
										currentChat?._id === chat._id,
								}
							)}
							onClick={() => setCurrentChat(chat)}
						>
							<Image
								alt=""
								className="rounded-[20px] z-0 relative min-w-[50px] min-h-[50px]"
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
							/>

							<div className="flex flex-col justify-center items-start text-sm w-full">
								<p className="font-semibold">
									{getInterlocutor(chat)?.firstName}
								</p>
								<p className="-mt-[2px]">
									{getInterlocutor(chat)?.age},{" "}
									{getCityString(getInterlocutor(chat)?.city)}
								</p>
							</div>
						</button>
					))}
				</div>

				<div className="relative col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4">
					<div
						className={cn(
							"col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 border-[7px] p-6 border-white dark:border-foreground-100 w-full rounded-[24px] relative text-[14px] overflow-y-scroll hide-scroll",
							{
								"hidden md:flex": !currentChat,
							}
						)}
						style={{ height: (window.innerHeight / 100) * 65 }}
					>
						<div className="flex flex-col gap-1 w-full">
							{chat ? (
								<>
									{chat?.map((message: any, idx: number) => (
										<Message
											message={message}
											key={message?._id}
											left={message?.sender?._id !== me?._id}
											sameSender={
												chat?.[idx - 1]?.sender?._id === message?.sender?._id
											}
										/>
									))}
								</>
							) : null}
						</div>
					</div>

					<div className="mt-3 flex items-center gap-3">
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
				isOpen={isPremiumRequired}
				title={"Нужен премиум"}
				text={
					"Для того чтобы общаться с девушками, Вам нужно купить премиум подписку"
				}
				onOpenChange={() => router.back()}
				onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
				actionBtn="Купить"
			/>
		</div>
	);
}
