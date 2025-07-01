"use client";

import { Image } from "@heroui/image";
import NextLink from "next/link";
import { ROUTES } from "../routes";

const contactsText = `
Наименование организации: Freaks 4U Gaming GmbH
Номер телефона: +79031016945
Почта: admin@blow.ru
Юридический адрес: An der Spreeschanze 10 , 13599 , Berlin , Germany
Служба поддержки пользователей - Telegram - https://t.me/blowadmin`;

export default function ContactsPage() {
	return (
    <div className="min-h-screen flex flex-col justify-between">
		<div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
			<h1 className="text-[36px] font-semibold mt-3 sm:mt-9">Контакты</h1>
			<div className="whitespace-pre-wrap text-sm sm:text-base space-y-4">
				{contactsText}
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
						{new Date().getFullYear()} © BLOW. Сайт для лиц старше 18-ти лет.
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
						<NextLink
							href={ROUTES.CONTACTS}
							className="underline cursor-pointer hover:text-primary text-nowrap"
						>
							Свяжись с нами
						</NextLink>
						<NextLink
							href={ROUTES.POLICY}
							className="underline cursor-pointer hover:text-primary text-nowrap"
						>
							Политики
						</NextLink>
						<NextLink
							href={ROUTES.OFFER}
							className="underline cursor-pointer hover:text-primary text-nowrap"
						>
							Договор оферта
						</NextLink>
					</div>
				</div>
			</footer>
    </div>
	);
}
