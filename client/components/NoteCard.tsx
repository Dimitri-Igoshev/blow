"use client";

import { ROUTES } from "@/app/routes"
import { config } from "@/common/env"
import { useGetUserQuery } from "@/redux/services/userApi"
import { Image } from "@heroui/image";
import { useRouter } from "next/navigation"

export const NoteCard = ({ note }: any) => {
  const { data: user } = useGetUserQuery(note._id)
  const router = useRouter();

	return (
		<button className="bg-white dark:bg-black flex gap-5 rounded-[24px] p-5 cursor-pointer" onClick={() => router.push(ROUTES.ACCOUNT.SEARCH + "/" + note._id)}>
      <div className="rounded-[18px] overflow-hidden">
			<Image
				alt=""
				className="z-0 relative w-full h-full xl:h-[100px] xl:w-[90px]"
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
			<p className="text-[18px]">{note.text}</p>
		</button>
	);
};
