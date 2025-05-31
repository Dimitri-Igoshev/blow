"use client";

import { Button } from "@heroui/button";

import {
	useCreateMailingMutation,
	useGetMailingsQuery,
} from "@/redux/services/mailingApi";
import { useGetMeQuery } from "@/redux/services/userApi";
import { InfoModal } from "@/components/InfoModal";
import {
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
	Textarea,
} from "@heroui/react";
import { ROUTES } from "@/app/routes";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MAILINGS_ID = "6831854519e3572edace86b7";

export default function AccountMailings() {
	const router = useRouter();

	const { data: me } = useGetMeQuery(null);
	const { data: mailings } = useGetMailingsQuery(null);

	const male = me?.sex === "male";
	const quantity =
		me?.services.find((item: any) => item?._id === MAILINGS_ID)?.quantity > 0;

	const {
		isOpen: isPremiumRequired,
		onOpen: onPremiumRequired,
		onOpenChange: onPremiumRequiredChange,
	} = useDisclosure();

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [text, setText] = useState("");

	const addMailing = () => {
		if (!quantity) {
			onPremiumRequired();
		} else {
			onOpen();
		}
	};

	const [createMailing] = useCreateMailingMutation();

	const save = () => {
		createMailing({
			owner: me?._id,
			text,
		});
	};

	return (
		<div className="flex w-full flex-col px-9 h-screen pt-[84px] gap-[30px]">
			<div className="flex w-full items-center justify-between">
				<h1 className="font-semibold text-[36px]">Рассылки</h1>

				{male ? (
					<Button
						className=""
						color={quantity ? "primary" : "default"}
						radius="full"
						onPress={addMailing}
					>
						Создать
					</Button>
				) : null}
			</div>

			{mailings ? (
				<div className="flex flex-col gap-3">
					{mailings?.map((mailing: any) => (
						<div
							key={mailing._id}
							className="bg-white w-full flex-col sm:flex-row dark:bg-black flex gap-5 rounded-[24px] p-5 cursor-pointer"
						>
							{mailing.text}
						</div>
					))}
				</div>
			) : (
				<p>Еще нет рассылок...</p>
			)}

			<InfoModal
				isOpen={isPremiumRequired}
				title={"Вы не можете создать рассылку"}
				text={
					"Для того чтобы создавать рассылки, Вам нужно купить соответствующий пакет услуг"
				}
				onOpenChange={onPremiumRequiredChange}
				onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
				actionBtn="Купить"
			/>

			<Modal
				backdrop="blur"
				className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
				classNames={{
					closeButton: "m-3.5",
				}}
				isOpen={isOpen}
				placement="center"
				size="sm"
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1 text-[20px]">
								Создание рассылки
							</ModalHeader>
							<ModalBody>
								<Textarea
									label="Текст рассылки"
									placeholder="Опишите здесь суть своего предложения..."
									value={text}
									onChange={(e) => setText(e.target.value)}
								/>
							</ModalBody>
							<ModalFooter>
								<div className="flex flex-raw w-full gap-3">
									<Button className="w-full" radius="full" onPress={onClose}>
										Отменить
									</Button>
									<Button
										color="primary"
										className="w-full"
										radius="full"
										onPress={save}
									>
										Сохранить
									</Button>
								</div>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
