"use client";

import { cn } from "@heroui/theme";
import { Image } from "@heroui/image";
import Link from "next/link";

import { ROUTES } from "./routes";

import { PreviewWidget } from "@/components/preview-widget";
import { SearchWidget } from "@/components/search-widget";
import { cities } from "@/data/cities";
import { useGetUsersQuery } from "@/redux/services/userApi";
import { useSelector } from "react-redux";

export default function Home() {
	const cities1 = cities.slice(0, 6);
	const cities2 = cities.slice(6, 12);
	const cities3 = cities.slice(12, 18);
	const cities4 = cities.slice(18, 24);
	const cities5 = cities.slice(24, 30);
	const cities6 = cities.slice(30, 34);

	const { data: mens } = useGetUsersQuery({ sex: "male" });
	const { data: womans } = useGetUsersQuery({ sex: "female" });

	const state = useSelector((state: any) => state);
	const search = state?.search?.search ? state.search.search : null;
	const { data: users } = useGetUsersQuery(search, { skip: !search.sex && !search.city && !search.minage && !search.maxage });

	return (
		<>
			<div className="relative">
				<img
					alt=""
					className="hidden sm:flex rounded-b-[50px] flex-col relative z-10 min-h-[700px] object-cover"
					src="/bg.png"
				/>
				<Image
					alt=""
					className="flex sm:hidden rounded-b-[50px] flex-col relative z-10 min-h-[434px]"
					radius="none"
					src="/bg-m.png"
				/>

				<div className="w-full absolute top-[100px] sm:top-[130px]">
					<div className="flex justify-center md:justify-start items-center gap-[5%] md:px-[40px] relative z-10">
						<SearchWidget />

						<div className="hidden md:flex flex-col md:w-[750px] gap-8">
							<h1 className="text-[26px] lg:text-[36px] font-semibold text-white lg:leading-[56px]">
								Поиск лучших содержанок и самых успешных мужчин
							</h1>
							<ul className="hidden md:block text-white uppercase list-disc leading-7 ml-4">
								<li>Бесплатная регистрация</li>
								<li>Реальные анкеты</li>
								<li>Качественные фото</li>
								<li>Голоса девушек</li>
							</ul>
						</div>
					</div>

					{!users?.length && womans?.length ? (
						<div className="pt-[4%] sm:pt-[40px] bg-gray dark:bg-black">
							<h2 className="text-[26px] sm:text-[36px] text-white font-semibold sm:pl-[40px] z-20 relative text-center sm:text-start">
								Содержанки
							</h2>

							<div className="w-full grid grid-cols-2 lg:grid-cols-4 mt-[30px] gap-3 sm:gap-[50px] z-20 relative px-3 sm:px-[40px]">
								{womans?.map((item: any, idx: number) => (
									<div key={item._id} className="flex justify-center">
										<PreviewWidget
											className={cn({
												"lg:mt-[50px] lg:-mb-[50px]":
													idx === 1 ||
													idx === 2 ||
													idx === 5 ||
													idx === 6 ||
													idx === 9 ||
													idx === 10 ||
													idx === 13 ||
													idx === 14,
											})}
											item={item}
										/>
									</div>
								))}
							</div>
						</div>
					) : null}

					<div className="pt-[40px] sm:pt-[100px] bg-gray dark:bg-black">
						{!users?.length && mens?.length ? (
							<>
								<h2 className="text-[26px] sm:text-[36px] text-black dark:text-white font-semibold sm:pl-[40px] z-20 relative text-center sm:text-start">
									Наши мужчины
								</h2>

								<div className="w-full grid grid-cols-2 lg:grid-cols-4 mt-[30px] gap-3 sm:gap-[50px] z-20 relative px-3 sm:px-[40px]">
									{mens?.map((item: any, idx: number) => (
										<div key={item._id} className="flex justify-center">
											<PreviewWidget
												className={cn({
													"lg:mt-[50px] lg:-mb-[50px]":
														idx === 1 ||
														idx === 2 ||
														idx === 5 ||
														idx === 6 ||
														idx === 9 ||
														idx === 10 ||
														idx === 13 ||
														idx === 14,
												})}
												item={item}
											/>
										</div>
									))}
								</div>
							</>
						) : null}

						{users?.length ? (
							<>
								<h2 className="text-[26px] sm:text-[36px] text-white font-semibold sm:pl-[40px] z-20 relative text-center sm:text-start">
									Результаты поиска
								</h2>

								<div className="w-full grid grid-cols-2 lg:grid-cols-4 mt-[30px] gap-3 sm:gap-[50px] z-20 relative px-3 sm:px-[40px]">
									{users?.map((item: any, idx: number) => (
										<div key={item._id} className="flex justify-center">
											<PreviewWidget
												className={cn({
													"lg:mt-[50px] lg:-mb-[50px]":
														idx === 1 ||
														idx === 2 ||
														idx === 5 ||
														idx === 6 ||
														idx === 9 ||
														idx === 10 ||
														idx === 13 ||
														idx === 14,
												})}
												item={item}
											/>
										</div>
									))}
								</div>
							</>
						) : null}

						<div className="bg-white dark:bg-foreground-200 p-6 m-3 sm:m-9 mb-0 mt-[70px] sm:mt-[120px] rounded-[36px] relative z-10">
							<Image
								alt="BLOW"
								className="object-cover float-left mr-8 mb-5 sm:mb-3"
								height={510}
								src={`/info.png`}
								width={570}
							/>
							<p className="">
								<span className="text-[24px] text-primary font-semibold">
									BLOW
								</span>
							</p>
							<p className="mt-4">
								Добро пожаловать на наш сайт — платформу, где состоятельные
								мужчины находят очаровательных спутниц. Мы сделали сервис
								простым и удобным, чтобы каждый мужчина мог подобрать себе
								девушку для приятного общения и взаимовыгодных отношений, а
								девушки – встретить щедрого покровителя. BLOW – это сайт
								знакомств для успешных мужчин и привлекательных девушек, ценящих
								комфорт и заботу. Термин «содержанка» нередко воспринимается
								неоднозначно. На самом деле, это элегантная, умная женщина,
								которая не стремится к браку или долгосрочным обязательствам.
								Она ищет состоятельного мужчину, готового поддерживать её,
								создавая атмосферу уюта и удовольствия. В свою очередь, мужчина
								хочет проводить время с красивой девушкой без ожиданий серьезных
								отношений.
							</p>
							<p className="mt-4">
								Деловые и амбициозные мужчины дорожат своим временем. Они
								предпочитают отдыхать в компании очаровательных спутниц — на
								курортах, во время шопинга за границей и в других приятных
								местах. Если вы ищете обеспеченного партнера или покровителя,
								регистрируйтесь на сайте BLOW и создавайте свою анкету.
							</p>
							<p className="mt-4">
								На нашем сайте ежедневно появляются новые девушки, ищущие
								состоятельного мужчину для отношений в формате любовницы в
								Москве. Успешному бизнесмену важны не только интимные встречи,
								но и душевное общение с понимающей спутницей, готовой разделить
								его взгляды на жизнь. Именно здесь, на BLOW, вас ждет
								очаровательная девушка, мечтающая познакомиться с обеспеченным
								мужчиной. Ведь рядом с такой прекрасной молодой дамой можно
								по-настоящему ощутить радость и гармонию.
							</p>
							<p className="mt-4">
								Если вам хочется тепла, заботы и ярких эмоций, но из-за
								напряженного графика не остается времени на долгие поиски – вы
								обратились по адресу! Здесь вы легко найдете очаровательную
								содержанку, которая скрасит ваши вечера или с удовольствием
								составит компанию в путешествии.
							</p>

							<p className="mt-6">
								<span className="text-[20px] sm:text-[24px] leading-6 text-primary font-semibold">
									Лучший сайт для знакомства с любовницами и влиятельными
									спонсорами
								</span>
							</p>
							<p className="mt-4">
								Мечтаете о щедром и успешном спонсоре? Или ищете красивую и
								заботливую любовницу? Добро пожаловать! Здесь вас ждут только
								актуальные анкеты реальных пользователей. Зарегистрированная у
								нас содержанка обязательно привлечет внимание состоятельного
								мужчины, а каждый спонсор сможет найти молодую, привлекательную
								спутницу с фото, соответствующую его вкусам и желаниям.
							</p>

							<p className="mt-6">
								<span className="text-[20px] sm:text-[24px] leading-6 text-primary font-semibold">
									Самые состоятельные любовники для роскошных женщин
								</span>
							</p>
							<p className="mt-4">
								Фраза «Ищу богатого любовника» — это не просто мечта о роскошной
								жизни, а реальная возможность найти достойного мужчину, который
								по достоинству оценит вашу красоту и элегантность. Ведь даже
								самый драгоценный бриллиант нуждается в крепкой и достойной
								оправе.{" "}
							</p>
							<p className="mt-4">
								Если вы хотите найти спонсора в Москве, Санкт-Петербурге или
								другом городе, просто заполните анкету с фото на нашем сайте.
								Здесь вас ждут реальные респектабельные мужчины, готовые
								воплотить ваши мечты в жизнь. Наш сайт знакомств создан для
								девушек, которые стремятся к финансовой стабильности и ярким
								эмоциям. Ведь успешный мужчина-спонсор — это не просто партнер,
								а проводник в мир благополучия и комфорта.
							</p>
						</div>

						<div className="pt-[60px] sm:pt-[70px] bg-gray text-black/50 dark:text-white/50 leading-6 dark:bg-black px-6 sm:px-12">
							<h2 className="text-[20px] sm:text-[24px] font-semibold">
								Найди любовницу или спонсора рядом с тобой – знакомься, общайся
								и наслаждайся приятным обществом в своем городе! 
							</h2>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-6 mt-[40px] sm:mt-[30px] px-6 sm:px-12 pb-[50px] gap-6 text-sm sm:text-base">
							<div className="flex flex-col gap-2 sm:gap-1">
								{cities1?.map((item: any) => (
									<Link
										key={item.value}
										className="cursor-pointer hover:text-primary hover:underline"
										href={`${ROUTES.HOME}/?city=${item.value}`}
									>
										{item.label}
									</Link>
								))}
							</div>

							<div className="flex flex-col gap-2 sm:gap-1">
								{cities2?.map((item: any) => (
									<Link
										key={item.value}
										className="cursor-pointer hover:text-primary hover:underline"
										href={`${ROUTES.HOME}/?city=${item.value}`}
									>
										{item.label}
									</Link>
								))}
							</div>

							<div className="flex flex-col gap-2 sm:gap-1">
								{cities3?.map((item: any) => (
									<Link
										key={item.value}
										className="cursor-pointer hover:text-primary hover:underline"
										href={`${ROUTES.HOME}/?city=${item.value}`}
									>
										{item.label}
									</Link>
								))}
							</div>

							<div className="flex flex-col gap-2 sm:gap-1">
								{cities4?.map((item: any) => (
									<Link
										key={item.value}
										className="cursor-pointer hover:text-primary hover:underline"
										href={`${ROUTES.HOME}/?city=${item.value}`}
									>
										{item.label}
									</Link>
								))}
							</div>

							<div className="flex flex-col gap-2 sm:gap-1">
								{cities5?.map((item: any) => (
									<Link
										key={item.value}
										className="cursor-pointer hover:text-primary hover:underline"
										href={`${ROUTES.HOME}/?city=${item.value}`}
									>
										{item.label}
									</Link>
								))}
							</div>

							<div className="flex flex-col gap-2 sm:gap-1">
								{cities6?.map((item: any) => (
									<Link
										key={item.value}
										className="cursor-pointer hover:text-primary hover:underline"
										href={`${ROUTES.HOME}/?city=${item.value}`}
									>
										{item.label}
									</Link>
								))}
								<div className="cursor-pointer text-primary hover:text-dark font-semibold mt-6">
									Все города
								</div>
							</div>
						</div>

						<footer className="bg-gray dark:bg-black w-full">
							<div className="bg-dark rounded-t-[50px] px-3 sm:px-12 py-[28px] grid grid-cols-1 sm:grid-cols-3 text-white items-center text-xs sm:text-base">
								<div className="sm:hidden flex justify-center">
									<Image
										alt="BLOW"
										height={40}
										radius="none"
										src="/logo.png"
										width={101}
									/>
								</div>
								<p className="text-center sm:twxt-left mt-5 sm:mt-0">
									{new Date().getFullYear()} © BLOW. Сайт для лиц старше 18-ти
									лет.
								</p>
								<div className="hidden sm:flex justify-center">
									<Image
										alt="BLOW"
										height={40}
										radius="none"
										src="/logo.png"
										width={101}
									/>
								</div>
								<div className="mt-4 sm:mt-0 flex items-center justify-center sm:justify-end gap-6">
									<div className="underline cursor-pointer hover:text-primary text-nowrap">
										Свяжись с нами
									</div>
									<div className="underline cursor-pointer hover:text-primary text-nowrap">
										Правила
									</div>
									<div className="underline cursor-pointer hover:text-primary text-nowrap">
										Договор оферта
									</div>
								</div>
							</div>
						</footer>
					</div>
				</div>
			</div>
		</>
	);
}
