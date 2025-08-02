import { FC, useRef } from "react";
import { cn } from "@heroui/theme";
import { Button } from "@heroui/button";
import { PiWaveform } from "react-icons/pi";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { config } from "@/common/env";
// import { getCityString } from "@/helper/getCityString";
import { ROUTES } from "@/app/routes";
import { getActivityString } from "@/helper/getActivityString";
import { isPremium, isTop } from "@/helper/checkIsActive";
import { useGetMeQuery } from "@/redux/services/userApi";
import { InfoModal } from "./InfoModal";
import { useDisclosure } from "@heroui/react";
import { useCityLabel } from "@/helper/getCityString";

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
			return;
		}

		if (!premium && me?.sex === "male") {
			onPremiumRequired();
			return;
		}

		const audio = new Audio(`${config.MEDIA_URL}/${item?.voice}`);
		audio.play().catch((err) => {
			console.error("Ошибка воспроизведения:", err);
		});
	};

	const { getCityLabel } = useCityLabel();

	return (
		<>
			<div
				className={cn(
					"relative bg-white dark:bg-foreground-100 p-3 sm:p-6 flex flex-col xl:flex-row gap-3 sm:gap-6 rounded-[32px] col-span-1 w-full pb-[60px] sm:pb-6",
					className
				)}
			>
				<button
					className="relative w-full sm:w-[300px] aspect-[2/3] overflow-hidden rounded-[20px] cursor-pointer"
					onClick={() => router.push(ROUTES.ACCOUNT.SEARCH + "/" + item?._id)}
				>
					<Image
						alt=""
						src={
							item?.photos?.[0]?.url
								? `${config.MEDIA_URL}/${item.photos[0].url}`
								: item?.sex === "male"
									? "/men2.png"
									: "/woman2.png"
						}
						fill
						className="object-cover"
					/>
					{/* ТОП лейбл */}
					{isTop(item) && (
						<div className="absolute -right-[70px] top-[20px] z-10">
							<div className="bg-primary w-[133px] h-[20px] sm:w-[200px] sm:h-[30px] rotate-45 flex justify-center items-center">
								<Image alt="" className="w-[27px] sm:w-[40px]" src="/top.png" />
							</div>
						</div>
					)}
				</button>

				<div className="flex flex-col justify-between gap-3 sm:gap-6 w-full">
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

						<div className="flex justify-between items-center flex-wrap">
							<p className="text-[16px] line-clamp-1 sm:text-[24px] font-semibold w-full sm:w-auto">
								{item?.firstName
									? item.firstName
									: item.sex === "male"
										? "Мужчина"
										: "Девушка"}
							</p>
							<p className="text-[12px] sm:text-base">
								{item?.age ? item.age + ", " : ""}
								{getCityLabel(item?.city)}
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<p className="font-semibold text-[14px] sm:text-base">Данные</p>
						<div className="text-[14px] flex flex-wrap gap-1">
							<p className="w-full sm:w-auto">рост - {item?.height} см,</p>
							<p>вес - {item?.weight} кг</p>
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<p className="font-semibold text-[12px] sm:text-base">
							Цели знакомства
						</p>
						<ul className="list-disc leading-5 ml-4 text-[12px] sm:text-[14px]">
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

					<div className="absolute sm:relative p-3 sm:p-0 bottom-0 left-0 right-0 mt-auto flex flex-row sm:justify-end sm:items-center sm:gap-3 gap-2 w-full">
						{/* Кнопка "Голос", если есть */}
						{item?.voice && (
							<>
								<button
									onClick={handlePlay}
									className="w-full hidden sm:flex sm:w-auto justify-center bg-primary text-white rounded-full h-[38px] px-3.5 flex gap-1 items-center"
								>
									<PiWaveform className="w-5 h-5" />
									<p>Голос</p>
								</button>
								<Button isIconOnly color="primary" radius="full" className="flex sm:hidden" onPress={handlePlay}>
									<PiWaveform className="w-5 h-5" />
								</Button>
							</>
						)}

						{/* Кнопка "Профиль" */}
						<Button
							className="w-full sm:w-auto flex"
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
