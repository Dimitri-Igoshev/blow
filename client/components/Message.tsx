"use client";

import { FC } from "react";
import { Image } from "@heroui/image";
import { config } from "@/common/env";
import { format } from "date-fns";
import { cn } from "@heroui/theme";

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
	return (
		<div
			className={cn("flex flex-col gap-2", {
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
					<p className="font-semibold">
						{left ? message?.sender?.firstName : "Вы"}
					</p>
				</div>
			) : null}

			<div
				className={cn(
					"flex flex-col justify-between bg-white dark:bg-foreground-100 rounded-[12px] px-5 p-3",
					{
						["rounded-tr-none"]: !left,
						["rounded-tl-none"]: left,
					}
				)}
			>
				<p>{message.text}</p>
				<p className="text-[10px] text-right mt-1">
					<b>{format(new Date(message?.updatedAt), "HH:mm")} </b>
					<span className="text-[9px]">
						{format(new Date(message?.updatedAt), "dd.MM.yyyy")}
					</span>
				</p>
			</div>
		</div>
	);
};
