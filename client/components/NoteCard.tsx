"use client";

import { Image } from "@heroui/image";
import { useRouter } from "next/navigation";

import { ROUTES } from "@/app/routes";
import { config } from "@/common/env";
import { useGetUserQuery } from "@/redux/services/userApi";
import { Avatar } from "@heroui/react";
import { CameraIcon } from "@/common/icons";

export const NoteCard = ({ note }: any) => {
	const { data: user } = useGetUserQuery(note._id);
	const router = useRouter();

	return (
		<button
			className="bg-white flex-col sm:flex-row dark:bg-foreground-100 flex gap-5 rounded-[24px] p-5 cursor-pointer"
			onClick={() => router.push(ROUTES.ACCOUNT.SEARCH + "/" + note._id)}
		>
			{/* <div className="min-w-[60px]"> */}
			{/* <Avatar
				showFallback
				// isBordered={isPremium(me)}
				fallback={
					<CameraIcon
						className="animate-pulse w-6 h-6 text-default-500"
						fill="currentColor"
						size={20}
					/>
				}
				src={
					user?.photos[0]?.url
						? `${config.MEDIA_URL}/${user?.photos[0]?.url}`
						: user?.sex === "male"
							? "/men.jpg"
							: "/woman.jpg"
				}
				onClick={() => router.push(`${ROUTES.ACCOUNT.SEARCH}/${user?._id}`)}
			/> */}
			{/* </div> */}
			<div className="rounded-[18px] overflow-hidden min-w-full sm:min-w-[90px]">
        <Image
          alt=""
          className="z-0 relative w-full h-auto sm:h-[120px] sm:w-[90px]"
          radius="none"
          src={
            user?.photos[0]?.url
              ? `${config.MEDIA_URL}/${user.photos[0].url}`
              : user?.sex === "male"
                ? "/men2.png"
                : "/woman2.png"
          }
        />
      </div>
			<p className="text-[18px] text-left">{note.text}</p>
		</button>
	);
};
