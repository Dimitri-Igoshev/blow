import { FC, useRef } from "react";
import { cn } from "@heroui/theme";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { PiWaveform } from "react-icons/pi";
import { useRouter } from "next/navigation";

import { config } from "@/common/env";
import { getCityString } from "@/helper/getCityString";
import { ROUTES } from "@/app/routes";
import { getActivityString } from "@/helper/getActivityString";
import { isPremium, isTop } from "@/helper/checkIsActive";
import { useGetMeQuery } from "@/redux/services/userApi";
import { InfoModal } from "./InfoModal";
import { useDisclosure } from "@heroui/react";

interface ProfilePreviewProps {
	item: any;
	className?: string;
}

export const ProfilePreview: FC<ProfilePreviewProps> = ({
	item,
	className = "",
}) => {
	const router = useRouter();
	const { data: me } = useGetMeQuery(null);

	const audioRef = useRef<any>(null);

	const premium = isPremium(me);

	const {
		isOpen: isPremiumRequired,
		onOpen: onPremiumRequired,
		onOpenChange: onPremiumRequiredChange,
	} = useDisclosure();

	const {
		isOpen: isRegistrationRequired,
		onOpen: onRegistrationRequired,
		onOpenChange: onRegistrationRequiredChange,
	} = useDisclosure();

	const handlePlay = () => {
		if (!me || me?.status !== "active") {
			onRegistrationRequired();
			return
		}

		if (!premium && me?.sex === "male") {
			onPremiumRequired();
			return
		}

		const audio = new Audio(`${config.MEDIA_URL}/${item?.voice}`);
		audio.play().catch((err) => {
			console.error("Ошибка воспроизведения:", err);
		});
	};

	return (
		<>
			<div
				className={cn(
					"bg-white dark:bg-foreground-100 p-6 flex flex-col xl:flex-row gap-6 rounded-[32px] col-span-1 w-full",
					className
				)}
			>
				<button
					className="overflow-hidden relative rounded-[20px] min-h-[345px] min-w-[230px] cursor-pointer"
					onClick={() => router.push(ROUTES.ACCOUNT.SEARCH + "/" + item?._id)}
				>
					<Image
						alt=""
						className="z-0 relative w-full sm:w-auto h-full xl:h-[345px] xl:w-[230px] object-cover"
						radius="none"
						src={
							item?.photos[0]?.url
								? `${config.MEDIA_URL}/${item.photos[0].url}`
								: item?.sex === "male"
									? "/men2.png"
									: "/woman2.png"
						}
					/>
					<div className="bg-transparent absolute -right-[70px] top-[20px] z-0">
						{isTop(item) ? (
							<div className="bg-primary w-[200px] h-[30px] rotate-45 flex justify-center items-center">
								<Image alt="" className="w-[40px]" src="/top.png" />
							</div>
						) : null}
					</div>
				</button>

				<div className="flex flex-col justify-between gap-6 w-full">
					<div className="flex flex-col gap-1 mt-1">
						<div className="flex gap-1.5 items-center">
							{getActivityString(item?.activity) === "онлайн" ? (
								<>
									<div className="w-2 h-2 rounded-full bg-green-400" />
									<p className="-mt-[2px] text-[12px]">сейчас онлайн</p>
								</>
							) : (
								<p className="-mt-[2px] text-[12px]">
									{getActivityString(item?.activity)}
								</p>
							)}
						</div>

						<div className="flex justify-between items-center">
							<p className="text-[24px] font-semibold">
								{item?.firstName
									? item.firstName
									: item.sex === "male"
										? "Мужчина"
										: "Девушка"}
							</p>
							<p>
								{item?.age ? item.age + ", " : ""}
								{getCityString(item?.city)}
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<p className="font-semibold">Данные</p>
						<p className="text-[14px]">
							рост - {item?.height} см{" "}
							<span className="ml-3">вес - {item?.weight} кг</span>
						</p>
					</div>

					<div className="flex flex-col gap-1">
						<p className="font-semibold">Цели знакомства</p>
						<ul className="list-disc leading-5 ml-4 text-[14px]">
							{item.sponsor ? (
								<li>
									{item?.sex === "male" ? "стану спонсором" : "ищу спонсора"}
								</li>
							) : null}
							{item.traveling ? <li>совместные путешествия</li> : null}
							{item.relationships ? <li>постоянные отношения</li> : null}
							{item.evening ? <li>провести вечер</li> : null}
						</ul>
					</div>

					<div className="grid grid-cols-5 gap-3 w-full items-end">
						<div className="col-span-3">
							{item?.voice ? (
								<button
									onClick={handlePlay}
									className="bg-primary text-white rounded-full h-[38px] px-3.5 flex gap-1 items-center"
								>
									<PiWaveform className="w-5 h-5" />
									<p>Голос</p>
								</button>
							) : null}
						</div>
						<Button
							className="w-full z-0 relative col-span-2"
							color="secondary"
							radius="full"
							variant="solid"
							onPress={() =>
								router.push(ROUTES.ACCOUNT.SEARCH + "/" + item?._id)
							}
						>
							Профиль
						</Button>
					</div>
				</div>
			</div>

			<InfoModal
				actionBtn="Купить"
				isOpen={isPremiumRequired}
				text={
					"Для того чтобы получить доступ к прослушиванию голоса, Вам нужно купить премиум подписку"
				}
				title={"Нужен премиум"}
				onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
				onOpenChange={onPremiumRequiredChange}
			/>

			<InfoModal
				isOpen={isRegistrationRequired}
				text={
					"Для того чтобы получить доступ к прослушиванию голоса, Вам нужна регистрация и премиум подписка"
				}
				title={"Нужны регистрация и премиум"}
				onOpenChange={onRegistrationRequiredChange}
			/>
		</>
	);
};
