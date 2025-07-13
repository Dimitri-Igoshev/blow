// app/api/webhook/route.ts

import { NextRequest } from "next/server";

import { IncomingPayload } from "../types";

export async function POST(req: NextRequest) {
	try {
		const data: IncomingPayload = await req.json();

		console.log("Полученные данные от внешнего API:", data);

		// Пример: делаем какие-то дополнительные действия с полученными данными
		// Например, можно добавить какое-то поле или изменить данные
		// const processedData = {
		//   ...data,
		//   receivedAt: new Date().toISOString(), // Добавим время получения
		//   status: 'processed', // Статус обработки
		// };

		// Возвращаем результат обработки данных
		// return Response.json({
		//   status: 'success',
		//   message: 'Данные успешно получены и обработаны!',
		//   processedData,
		// });

		const result = await fetch(
			`https://blow.igoshev.de/api/payment/notification`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ orderId: data.OrderId, status: data.Status }),
			}
		);

		// const result = await response.json();

		// console.log('[NOTIFICATION RESPONSE]', result);
		if (result.status === 200) {
			return new Response("OK", {
				status: 200,
				headers: {
					"Content-Type": "text/plain",
				},
			});
		}

		return new Response(
			JSON.stringify({ message: "Ошибка сервера при зачислении средств" })
		);
	} catch (error) {
		console.error("[WEBHOOK ERROR]", error);

		return new Response(JSON.stringify({ message: "Ошибка сервера" }), {
			status: 500,
		});
	}
}
