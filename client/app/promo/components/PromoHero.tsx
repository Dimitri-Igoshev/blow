"use client";

import NextLink from "next/link";
import { Button, Card, Checkbox, Chip, cn, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import {
	IoImageOutline,
	IoLockClosedOutline,
	IoShieldCheckmarkOutline,
	IoVolumeMediumOutline,
} from "react-icons/io5";
import { ROUTES } from "@/app/routes";
import { HeartIcon } from "@/components/icons";
import { PreviewWidget } from "@/components/preview-widget";
import { motion, AnimatePresence } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRegisterMutation } from "@/redux/services/authApi";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useWindowWidth } from "@/hooks/useWindowWidth";

const profiles = [
	{
		_id: "68cfa698e4c817da85c9bcea",
		email: "aleksei58_03@mail.ru",
		firstName: "Милана",
		sex: "female",
		city: "samara",
		age: 22,
		height: 160,
		weight: 48,
		photos: [
			{
				url: "2025-09-21/1758439064111-59.webp",
				name: "1758439064111-59.webp",
				priority: 0,
			},
		],
		sponsor: true,
		premiumEnd: "2025-09-19T16:22:09.340Z",
		role: "user",
		status: "active",
		raisedAt: "2025-09-19T16:22:09.340Z",
		inTopAt: "2025-09-19T16:22:09.340Z",
		activity: "2025-09-21T07:18:07.919Z",
		visits: [],
		notes: [],
		balance: 0,
		transactions: [],
		services: [
			{
				_id: "6831be446c59cd4bad808bb5",
				quantity: 0,
				expiredAt: "2025-09-22T07:17:45.002Z",
			},
		],
		sessions: [],
		blockList: [],
		slugStatus: "auto",
		isPublic: false,
		isFake: false,
		referers: [],
		contacts: [],
		purchasedContacts: [],
		createdAt: "2025-09-21T07:17:44.870Z",
		updatedAt: "2025-09-21T07:18:08.043Z",
		__v: 0,
		shortId: "GbyeG4QN",
		slug: "22-samara-8",
		confirmToken: "",
	},
	{
		_id: "68cc06832f65d965b7ecb505",
		email: "fake+mfpfrgjc35e20d78e150@blow.ru",
		firstName: "Анна",
		sex: "female",
		city: "moscow",
		age: 26,
		height: 172,
		weight: 70,
		photos: [{ url: "2025-09-18/1758201475596-97.webp", main: true, rank: 1 }],
		sponsor: true,
		traveling: false,
		relationships: false,
		evening: true,
		about: "Только постоянные отношения",
		premiumEnd: "2025-09-18T11:11:01.523Z",
		role: "user",
		status: "active",
		raisedAt: "2025-09-18T11:11:01.523Z",
		inTopAt: "2025-09-18T11:11:01.523Z",
		activity: "2025-09-19T14:00:01.654Z",
		visits: [],
		notes: [],
		balance: 0,
		transactions: [],
		services: [
			{
				_id: "6831be446c59cd4bad808bb5",
				quantity: 0,
				expiredAt: "2025-09-19T13:17:55.581Z",
			},
		],
		sessions: [],
		blockList: [],
		slugStatus: "auto",
		isPublic: false,
		isFake: true,
		referers: [],
		contacts: [],
		purchasedContacts: [],
		createdAt: "2025-09-18T13:17:55.214Z",
		updatedAt: "2025-09-19T14:00:46.892Z",
		__v: 0,
		shortId: "GbckdvZh",
		slug: "26-moscow-25",
	},
	{
		_id: "68cc15662f65d965b7ed46bd",
		email: "fake+mfpi15kjdfdb3d25315f@blow.ru",
		firstName: "Лина",
		sex: "female",
		city: "piter",
		age: 24,
		height: 165,
		weight: 60,
		photos: [{ url: "2025-09-18/1758205287001-96.webp", main: true, rank: 1 }],
		sponsor: true,
		traveling: false,
		relationships: false,
		evening: false,
		about: "",
		premiumEnd: "2025-09-18T11:11:01.523Z",
		role: "user",
		status: "active",
		raisedAt: "2025-09-18T11:11:01.523Z",
		inTopAt: "2025-09-18T11:11:01.523Z",
		activity: "2025-09-20T13:30:02.268Z",
		visits: [],
		notes: [],
		balance: 0,
		transactions: [],
		services: [
			{
				_id: "6831be446c59cd4bad808bb5",
				quantity: 0,
				expiredAt: "2025-09-19T14:21:26.982Z",
			},
		],
		sessions: [],
		blockList: [],
		slugStatus: "auto",
		isPublic: false,
		isFake: true,
		referers: [],
		contacts: [],
		purchasedContacts: [],
		createdAt: "2025-09-18T14:21:26.782Z",
		updatedAt: "2025-09-20T13:30:02.838Z",
		__v: 0,
		shortId: "GbcG0uYl",
		slug: "24-piter-15",
	},
	{
		_id: "68cc18af2f65d965b7ed7560",
		email: "fake+mfpij5wd2f70778e9c58@blow.ru",
		firstName: "Виктория ",
		sex: "female",
		city: "piter",
		age: 23,
		height: 171,
		weight: 56,
		photos: [{ url: "2025-09-18/1758206127240-70.webp", main: true, rank: 1 }],
		sponsor: true,
		traveling: false,
		relationships: true,
		evening: false,
		about: "Ищу отношения ",
		premiumEnd: "2025-09-18T11:11:01.523Z",
		role: "user",
		status: "active",
		raisedAt: "2025-09-18T11:11:01.523Z",
		inTopAt: "2025-09-18T11:11:01.523Z",
		activity: "2025-09-19T13:00:01.777Z",
		visits: [],
		notes: [],
		balance: 0,
		transactions: [],
		services: [
			{
				_id: "6831be446c59cd4bad808bb5",
				quantity: 0,
				expiredAt: "2025-09-19T14:35:27.225Z",
			},
		],
		sessions: [],
		blockList: [],
		slugStatus: "auto",
		isPublic: false,
		isFake: true,
		referers: [],
		contacts: [],
		purchasedContacts: [],
		createdAt: "2025-09-18T14:35:27.021Z",
		updatedAt: "2025-09-19T13:00:31.850Z",
		__v: 0,
		shortId: "GbcKOD5U",
		slug: "23-piter-15",
	},
	{
		_id: "68cbeff02f65d965b7eb8f9c",
		email: "fake+mfpcbluiacebb7b13d82@blow.ru",
		firstName: "Полина",
		sex: "female",
		city: "piter",
		age: 18,
		height: 162,
		weight: 50,
		photos: [{ url: "2025-09-18/1758195696999-73.webp", main: true, rank: 1 }],
		sponsor: true,
		traveling: false,
		relationships: false,
		evening: true,
		about:
			"Ищу состоятельного щедрого мужчину, с которым можно будет провести вечер",
		premiumEnd: "2025-09-18T11:11:01.523Z",
		role: "user",
		status: "active",
		raisedAt: "2025-09-18T11:11:01.523Z",
		inTopAt: "2025-09-18T11:11:01.523Z",
		activity: "2025-09-19T15:00:00.923Z",
		visits: [],
		notes: [],
		balance: 0,
		transactions: [],
		services: [
			{
				_id: "6831be446c59cd4bad808bb5",
				quantity: 0,
				expiredAt: "2025-09-19T11:41:36.984Z",
			},
		],
		sessions: [],
		blockList: [],
		slugStatus: "auto",
		isPublic: false,
		isFake: true,
		referers: [],
		contacts: [],
		purchasedContacts: [],
		createdAt: "2025-09-18T11:41:36.809Z",
		updatedAt: "2025-09-19T15:00:02.369Z",
		__v: 0,
		shortId: "GbbNaSQ2",
		slug: "18-piter-12",
	},
	{
		_id: "68cafdfe525265ec4fb6a604",
		email: "fake+mfobg23r07d12f4fab22@blow.ru",
		firstName: "Di",
		sex: "female",
		city: "piter",
		age: 22,
		height: null,
		weight: null,
		photos: [{ url: "2025-09-17/1758133758720-20.webp", main: true, rank: 1 }],
		sponsor: true,
		traveling: false,
		relationships: false,
		evening: true,
		about: "Жду ваши предложения)",
		premiumEnd: "2025-09-17T17:00:52.783Z",
		role: "user",
		status: "active",
		raisedAt: "2025-09-17T17:00:52.783Z",
		inTopAt: "2025-09-17T17:00:52.783Z",
		activity: "2025-09-20T03:00:01.677Z",
		visits: [],
		notes: [],
		balance: 0,
		transactions: [],
		services: [
			{
				_id: "6831be446c59cd4bad808bb5",
				quantity: 0,
				expiredAt: "2025-09-18T18:29:18.704Z",
			},
		],
		sessions: [],
		blockList: [],
		slugStatus: "auto",
		isPublic: false,
		isFake: true,
		referers: [],
		contacts: [],
		purchasedContacts: [],
		createdAt: "2025-09-17T18:29:18.650Z",
		updatedAt: "2025-09-20T03:00:02.257Z",
		__v: 0,
		shortId: "Gb652awF",
		slug: "di-22-spb",
		voice: "",
	},
];

const headingVariants = {
	hidden: { y: -24, opacity: 0 },
	visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const chipsContainer = {
	hidden: { opacity: 0, y: -16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { staggerChildren: 0.08, delayChildren: 0.2 },
	},
};

const chipItem = {
	hidden: { opacity: 0, y: -16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.45, ease: "easeOut" },
	},
};

const cardsContainer = {
	hidden: {},
	visible: {
		transition: {
			delay: 0.25, // общая задержка перед началом анимации контейнера (опционально)
			delayChildren: 0.3, // задержка перед ПЕРВЫМ ребёнком
			staggerChildren: 0.08, // интервал между детьми
			// staggerDirection: 1 // 1 — слева направо, -1 — справа налево
		},
	},
};

const cardItem = {
	hidden: { x: -60, opacity: 0 },
	visible: {
		x: 0,
		opacity: 1,
		transition: { duration: 0.5, ease: "easeOut" },
	},
};

const registerAppear = {
	hidden: { opacity: 0, scale: 0.85, filter: "blur(8px)" as any },
	visible: {
		opacity: 1,
		scale: 1,
		filter: "blur(0px)" as any,
		transition: { duration: 0.55, ease: "easeOut", delay: 0.2 },
	},
};

type Inputs = {
	email: string;
	firstName: string;
	password: string;
};

export const PromoHero = () => {
	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<Inputs>();
	const [isLoading, setIsLoading] = useState(false);

	const [registaration] = useRegisterMutation();

	const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
		setIsLoading(true);

		const body: any = {
			email: data.email.toLowerCase(),
			password: data.password,
			sex: "male",
			firstName: data.firstName,
			status: "active",
		};

		registaration(body)
			.unwrap()
			.then((res) => {
				localStorage.setItem("access-token", res.accessToken);
				setIsLoading(false);
				router.push(ROUTES.HOME);
			})
			.catch((error: any) => console.log(error))
			.finally(() => {
				setIsLoading(false);
				router.push(ROUTES.HOME);
			});
	};

	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="flex flex-col justify-between gap-6 mt-[84px] pb-6 px-3 sm:px-[34px] w-full min-h-[calc(100vh-84px)]">
					{/* ВЕРХ: заголовок + чипсы */}
					<div className="flex flex-col gap-6  ml-[22px] sm:ml-0">
						<motion.h1
							className="mt-6 text-3xl sm:text-5xl font-semibold z-10 relative leading-10 sm:leading-normal"
							initial="hidden"
							animate="visible"
							variants={headingVariants}
							viewport={{ once: true, amount: 0.4 }}
						>
							<span className="text-primary">Красивые девушки.</span> Знакомства
							с продолжением.
						</motion.h1>

						<motion.div
							className="flex flex-wrap gap-3 sm:gap-6"
							initial="hidden"
							animate="visible"
							variants={chipsContainer}
							viewport={{ once: true, amount: 0.3 }}
						>
							<motion.div variants={chipItem}>
								<Chip
									size="lg"
									className="bg-transparent border border-foreground-300 text-foreground-300"
									startContent={<IoShieldCheckmarkOutline className="mx-1" />}
								>
									Реальные анкеты и модерация
								</Chip>
							</motion.div>

							<motion.div variants={chipItem}>
								<Chip
									size="lg"
									className="bg-transparent border border-foreground-300 text-foreground-300"
									startContent={<IoImageOutline className="mx-1" />}
								>
									Качественные фото без ботов
								</Chip>
							</motion.div>

							<motion.div variants={chipItem}>
								<Chip
									size="lg"
									className="bg-transparent border border-foreground-300 text-foreground-300"
									startContent={
										<IoVolumeMediumOutline className="mx-1 text-[18px]" />
									}
								>
									Голоса девушек
								</Chip>
							</motion.div>

							<motion.div variants={chipItem}>
								<Chip
									size="lg"
									className="bg-transparent border border-foreground-300 text-foreground-300"
									startContent={
										<IoLockClosedOutline className="mx-1 text-[14px]" />
									}
								>
									Приватность и защита данных
								</Chip>
							</motion.div>
						</motion.div>
					</div>

					{/* НИЗ: сетка карточек + регистрация */}
					<div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] lg:grid-cols-[1fr_1fr] h-full gap-12">
						{/* 6 карточек слева: каскад слева направо */}
						<motion.div
							className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 mt-9 w-full"
							initial="hidden"
							animate="visible"
							variants={cardsContainer}
							viewport={{ once: true, amount: 0.2 }}
						>
							{profiles.slice(0, 6).map((item: any, idx: number) => (
								<motion.div key={item._id} variants={cardItem}>
									<PreviewWidget
										className={cn("w-200px sm:w-[250px]")}
										item={item}
									/>
								</motion.div>
							))}
						</motion.div>

						{/* Регистрация: появление из пустоты (scale + fade + blur) */}
						<div className="flex flex-col items-center justify-center w-full h-full" id="register">
							<motion.div
								className="flex font-semibold text-3xl mb-6 z-10 relative"
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
							>
								Регистрация
							</motion.div>

							<motion.div
								initial="hidden"
								animate="visible"
								variants={registerAppear}
								viewport={{ once: true, amount: 0.4 }}
							>
								<Card
									className="w-full sm:w-[400px] p-6 py-9 rounded-3xl bg-foreground-50/50"
									radius="none"
								>
									<form
										onSubmit={handleSubmit(onSubmit)}
										className=" flex flex-col gap-6"
									>
										<p className="pb-2">
											Начните <span className="font-semibold">бесплатно</span> —
											24 часа премиума
										</p>

										<Input
											classNames={{
												input: "bg-transparent dark:text-white",
												inputWrapper: "dark:bg-foreground-200",
											}}
											placeholder="Email"
											radius="full"
											type="email"
											autoCapitalize="none" // <-- Важно для iPhone
											autoCorrect="off" // <-- Чтобы не исправляло автоматически
											{...register("email", {
												required: { value: true, message: "Обязательное поле" },
												pattern: {
													value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
													message: "Невалидный emaill",
												},
												onChange: (e) => {
													e.target.value =
														e.target.value.charAt(0).toLowerCase() +
														e.target.value.slice(1);
												},
											})}
										/>
										<Input
											classNames={{
												input: "bg-transparent dark:text-white",
												inputWrapper: "dark:bg-foreground-200",
											}}
											placeholder="Ваше имя"
											radius="full"
											type="text"
											{...register("firstName", {
												required: { value: true, message: "Обязательное поле" },
												minLength: { value: 2, message: "Не менее 2 символов" },
											})}
										/>
										<Input
											classNames={{
												input: "bg-transparent dark:text-white",
												inputWrapper: "dark:bg-foreground-200",
											}}
											placeholder="Пароль"
											radius="full"
											type="password"
											{...register("password", {
												required: { value: true, message: "Обязательное поле" },
												minLength: { value: 6, message: "Не менее 6 символов" },
											})}
										/>

										{/* чекбокс можно вернуть позже */}
										<Button
											className="w-full mt-2 font-semibold"
											color="primary"
											// disabled={!accept}
											radius="full"
											size="lg"
											type="submit"
										>
											Получить 24 часа премиума
										</Button>

										<div className="text-center text-foreground-500">
											Без привязки карты. Можно скрыть профиль в любой момент.
										</div>
									</form>
								</Card>
							</motion.div>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
