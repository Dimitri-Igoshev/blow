"use client";

import { FC } from "react";
import { Image } from "@heroui/image";
import { config } from "@/common/env";
import { format } from "date-fns";
import { cn } from "@heroui/theme";
import { useGetMeQuery } from "@/redux/services/userApi";

interface MessageProps {
	left?: boolean;
	message?: any;
	sameSender?: boolean;
}

export const Message: FC<MessageProps> = ({
	left = false,
	message,
	sameSender = false,
}) => {
	const { data: me } = useGetMeQuery(null);
	return (
		<div
			className={cn("flex flex-col gap-5", {
				["items-start"]: left,
				["items-end"]: !left,
			})}
		>
			{!sameSender ? (
				<div className="flex items-center gap-2">
					<Image
						alt=""
						className="rounded-full z-0 relative min-w-[30px]"
						height={30}
						src={
							message?.sender?.photos?.[0]?.url
								? `${config.MEDIA_URL}/${message?.sender?.photos?.[0]?.url}`
								: message?.sender?.sex === "male"
									? "/men.jpg"
									: "/woman.jpg"
						}
						style={{ objectFit: "cover" }}
						width={30}
					/>
					<p
						className={cn("font-semibold", {
							["text-primary"]: message?.sender?._id !== me?._id,
						})}
					>
						{left
							? message?.sender?.firstName
								? message?.sender?.firstName
								: message?.sender?.sex === "male"
									? "Мужчина"
									: "Девушка"
							: "Вы"}
					</p>
				</div>
			) : null}

			<div className="flex justify-between items-center gap-6 w-full">
				<div
					className={cn(
						"flex flex-col justify-between bg-white dark:bg-foreground-100 rounded-[12px] px-5 p-3 -mt-3",
						{
							["rounded-tr-none"]: !left,
							["rounded-tl-none"]: left,
						}
					)}
				>
					<p>{message.text}</p>
				</div>

				<p className="text-[10px] text-right mt-1">
					{format(new Date(message?.updatedAt), "HH:mm")}
					{/* <span className="text-[9px]">
						{format(new Date(message?.updatedAt), "dd.MM.yyyy")}
					</span> */}
				</p>
			</div>
		</div>
	);
};
