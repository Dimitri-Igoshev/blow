"use client";

import { ru } from "date-fns/locale";
import { format } from "date-fns";
import { useDisclosure } from "@heroui/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { ServiceCard } from "@/components/ServiceCard";
import { useGetServicesQuery } from "@/redux/services/serviceApi";
import {
	useBuyServiceMutation,
	useBuyServicesKitMutation,
	useGetMeQuery,
} from "@/redux/services/userApi";
import { InfoModal } from "@/components/InfoModal";
import { MAILING_ID } from "@/helper/checkIsActive";
import { useCreatePaymentMutation } from "@/redux/services/paymentApi";
import { useRouter } from "next/navigation";

export default function AccountServices() {
	const { data: me } = useGetMeQuery(null);
	const { data: services } = useGetServicesQuery(null);

	// const [addBalance] = useAddBalanceMutation();
	const [createPayment] = useCreatePaymentMutation();

	const addMoney = async (price: number) => {
		if (!me?._id) return;

		const win = window.open("", "_blank");

		// const body = {
		// 	payerId: me._id,
		// 	checkout: {
		// 		test: false,
		// 		transaction_type: "payment",
		// 		attempts: 3,
		// 		iframe: true,
		// 		order: {
		// 			currency: "RUB",
		// 			amount: price * 100,
		// 			description: "Пополнение счета на сайте blow.ru",
		// 			tracking_id: uuidv4().toString(), //идентификатор транзакции на стороне торговца
		// 			additional_data: {
		// 				contract: ["recurring", "card_on_flie"],
		// 			}, //заполнить при необходимости получить в ответе токен.
		// 		},
		// 		settings: {
		// 			return_url: "https://blow.ru/account/services", //URL, на который будет перенаправлен покупатель после завершения оплаты.
		// 			success_url: "https://blow.ru/account/services",
		// 			decline_url: "https://blow.ru/account/services",
		// 			fail_url: "https://blow.ru/account/services",
		// 			cancel_url: "https://blow.ru/account/services",
		// 			notification_url: "https://blow.ru/api/notification", //адрес сервера торговца, на который система отправит автоматическое уведомление с финальным статусом транзакции.
		// 			button_next_text: "Вернуться в магазин",
		// 			auto_pay: false,
		// 			language: "ru",
		// 			customer_fields: {
		// 				// visible: [
		// 				// 	me?.firstName || "",
		// 				// 	me?.lastName || "", //массив дополнительных полей на виджете
		// 				// ],
		// 			},
		// 			payment_method: {
		// 				types: ["credit_card"], //массив доступных платежных методов
		// 				/*"credit_card": {
		//                 "token": "13dded21-ed69-4590-8bcb-db522a89735c"
		//             }*/ //токен необходимо отправить при использовании auto_pay
		// 			},
		// 		},
		// 	},
		// };

		const body = {
			payerId: me._id,
			token: "c35920a427827ce7643b5ba1",
			amount: price,
			description: "Пополнение счета на сайте blow.ru",
			method: "card",
			order_id: uuidv4().toString(),
		};

		try {
			const response = await fetch("/api/payment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body), // передаем данные в body
			});

			const result = await response.json();

			console.log(123, result)

			if (win) {
				win.location.href = result?.response?.url;
			}
		} catch (error) {
			if (win) {
				win.close(); // Закрываем вкладку, если не удалось получить URL
			}

			console.error("Ошибка при отправке данных:", error);
		}
	};

	const getSubtitle = (item: any): string => {
		const isExist = me?.services.find((i: any) => i._id === item._id);

		if (!isExist) return "";

		if (isExist?.quantity) {
			return `осталось ${isExist.quantity}`;
		} else if (isExist?.expiredAt) {
			return new Date(isExist.expiredAt) < new Date(Date.now())
				? ""
				: `до ${format(new Date(isExist.expiredAt), "dd.MM.yyyy, HH:mm", {
						locale: ru,
					})}`;
		} else {
			return "";
		}
	};

	const [getService] = useBuyServiceMutation();
	const [getServicesKit] = useBuyServicesKitMutation();
	const [info, setInfo] = useState({
		title: "",
		text: "",
	});

	const buyService = (item: any, value: any) => {
		if (me?.balance < +value?.price) {
			setInfo({
				title: "Ошибка",
				text: "Недостаточно средств!",
			});

			return onOpen();
		}

		if (item?._id === "6830b9a752bb4caefa0418a8" && me?.sex === "male") {
			onPremiumRequired();
			return;
		}

		if (!item?.services?.length) {
			getService({
				userId: me._id,
				serviceId: item._id,
				name: item?.name,
				period: value?.period,
				quantity: value?.quantity,
				price: value?.price,
			})
				.unwrap()
				.then((res) => {
					setInfo({
						title: "Поздравляем",
						text: "Услуга добавлена!",
					});

					return onOpen();
				})
				.catch((e) => console.log("ошибка покупки сервиса"));
		} else {
			const option = item.options.find((i: any) => i.price == value.price);

			getServicesKit({
				userId: me._id,
				serviceId: item._id,
				name: item?.name,
				period: value?.period,
				price: value?.price,
				services: item?.services,
				servicesOptions: option?.servicesOptions,
			})
				.unwrap()
				.then((res) => {
					setInfo({
						title: "Поздравляем",
						text: "Премиум добавлен!",
					});

					return onOpen();
				})
				.catch((e) => console.log("ошибка покупки сервисного набора"));
		}
	};

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const womenServices = services?.filter(
		(item: any) => item?._id !== MAILING_ID
	);
	// const menServices = services?.filter((item: any) => item?._id !== TOP_ID);

	const genderServices = me?.sex === "male" ? services : womenServices;

	const {
		isOpen: isPremiumRequired,
		onOpen: onPremiumRequired,
		onOpenChange: onPremiumRequiredChange,
	} = useDisclosure();

	const router = useRouter();

	return (
		<div className="flex w-full flex-col px-9 pt-[84px] gap-[30px] min-h-screen">
			<div className="flex w-full items-center justify-between">
				<h1 className="font-semibold text-[36px]">Услуги</h1>
			</div>

			<ServiceCard
				oneTime
				buttonText="Пополнить"
				defaultVlue={{ period: "", price: "5000" }}
				list={[
					"При оплате картой в выписке и личном кабинете не будет указано, что платеж связан с сайтом знакомств.",
					"Ваши данные карты остаются конфиденциальными. Мы их не видим, и банк не передает эту информацию третьим лицам.",
					"Мы не подключаем автоподписки и не выполняем повторные списания.",
				]}
				subtile={`${me?.balance || 0} ₽`}
				title="Кошелек"
				transactions={me?.transactions || []}
				onClick={({ price }) => addMoney(price)}
			/>

			{genderServices?.map((item: any) => (
				<ServiceCard
					key={item._id}
					buttonText={item?.btn || "Купить"}
					options={item.options}
					subtile={getSubtitle(item)}
					text={item.description}
					title={item.name}
					onClick={(value: any) => buyService(item, value)}
				/>
			))}

			{/* <ServiceCard
        buttonText="Продлить"
        defaultVlue={{ period: "month", price: "7900" }}
        subtile="осталось 3 дня"
        text="Чтобы продолжить знакомиться с новыми девушками после окончания пробного периода, необходимо активировать премиум-аккаунт. Пробный период длится 24 часа с момента начала общения, давая вам возможность оценить, насколько вам интересно знакомство и встречи на нашем сайте."
        title="Премиум аккаунт"
        onClick={(value: any) => console.log(value)}
      />

      <ServiceCard
        oneTime
        buttonText="Поднять"
        defaultVlue={{ period: "", price: "200" }}
        subtile="Вы на 145 месте"
        text='Поднятие анкеты выведет ее в поиске на первое место после анкет из раздела "ТОП". Если у вас уже оплачено размещение в "ТОП", поднятие сделает вашу анкету первой в этой категории.'
        title="Поднятие анкеты"
        onClick={(value: any) => console.log(value)}
      />

      <ServiceCard
        buttonText="В топ"
        defaultVlue={{ period: "month", price: "1000" }}
        subtile=""
        text='Для закрепления анкеты в "ТОП" требуется активный премиум-аккаунт. Это необходимо, потому что без премиум-аккаунта вы не сможете отвечать на сообщения девушек, и вложенные средства не принесут желаемого результата.'
        title="В топ"
        onClick={(value: any) => console.log(value)}
      /> */}

			<InfoModal
				isOpen={isOpen}
				text={info.text}
				title={info.title}
				onOpenChange={onOpenChange}
			/>

			<InfoModal
				// actionBtn="Купить"
				isOpen={isPremiumRequired}
				text={`Для закрепления анкеты в "ТОП" требуется активный премиум-аккаунт. Это необходимо, потому что без премиум-аккаунта вы не сможете отвечать на сообщения девушек, и вложенные средства не принесут желаемого результата.`}
				title={"Нужен премиум"}
				// onAction={() => router.push(ROUTES.ACCOUNT.SERVICES)}
				onOpenChange={onPremiumRequiredChange}
			/>
		</div>
	);
}
