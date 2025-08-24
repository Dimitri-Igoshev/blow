"use client";

import { FC } from "react";
import { Image } from "@heroui/image";
import { format } from "date-fns";
import { cn } from "@heroui/theme";

import { config } from "@/common/env";
import { useGetMeQuery } from "@/redux/services/userApi";
import { maskContacts } from "@/helper/maskContacts";
import { isPremium } from "@/helper/checkIsActive";
import { Button } from "@heroui/button"
import { MdOutlineFileDownload } from "react-icons/md"

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
	const premium = isPremium(me);

	const handleDownload = async () => {
    const fileUrl = `${config.MEDIA_URL}/${message?.fileUrl}`;
    
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", ""); // 💾 имя файла
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

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
						className={cn("font-semibold line-clamp-1", {
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
						"flex flex-col justify-between bg-white dark:bg-foreground-100 rounded-[12px] px-5 p-3 -mt-3 md:max-w-[50%]",
						{
							["rounded-tr-none"]: !left,
							["rounded-tl-none"]: left,
						}
					)}
				>
					{message?.fileUrl ? (
						<div className="relative group">
							<Image
								alt=""
								className="rounded-lg z-0 relative min-w-[200px]"
								src={`${config.MEDIA_URL}/${message?.fileUrl}`}
								style={{ objectFit: "cover" }}
							/>
							<Button
								isIconOnly
								className="absolute bottom-3 right-3 opacity-75 hover:opacity-100 transition-all"
								color="secondary"
								radius="full"
								variant="solid"
								onPress={handleDownload}
							>
								<MdOutlineFileDownload className="text-[20px]" />
							</Button>
						</div>
					) : null}
					<p>{message.text}</p>
				</div>

				<p className="text-[10px] text-right mt-1">
					{format(new Date(message?.createdAt), "HH:mm dd.MM.yyyy")}
					{/* <span className="text-[9px]">
						{format(new Date(message?.updatedAt), "dd.MM.yyyy")}
					</span> */}
				</p>
			</div>
		</div>
	);
};
