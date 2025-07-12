import type { ForwardResponse, IncomingPayload } from "../types";

import { NextRequest } from "next/server";

// https://securepay.tinkoff.ru/v2/Init
// https://rest-api-test.tinkoff.ru/v2/Init

// {
//   "TerminalKey": "TinkoffBankTest",
//   "Amount": 140000,
//   "OrderId": "21090",
//   "Description": "Подарочная карта на 1000 рублей",
//   "Token": "68711168852240a2f34b6a8b19d2cfbd296c7d2a6dff8b23eda6278985959346",
//   "DATA": {
//     "Phone": "+71234567890",
//     "Email": "a@test.com"
//   },
//   "Receipt": {
//     "Email": "a@test.ru",
//     "Phone": "+79031234567",
//     "Taxation": "osn",
//     "Items": [
//       {
//         "Name": "Наименование товара 1",
//         "Price": 10000,
//         "Quantity": 1,
//         "Amount": 10000,
//         "Tax": "vat10",
//         "Ean13": "303130323930303030630333435"
//       },
//       {
//         "Name": "Наименование товара 2",
//         "Price": 20000,
//         "Quantity": 2,
//         "Amount": 40000,
//         "Tax": "vat20"
//       },
//       {
//         "Name": "Наименование товара 3",
//         "Price": 30000,
//         "Quantity": 3,
//         "Amount": 90000,
//         "Tax": "vat10"
//       }
//     ]
//   }
// }

export async function POST(req: NextRequest) {
	try {
		const data: IncomingPayload = await req.json();

		data.TerminalKey = "1752254920336DEMO";

		console.log(333, data)

		const { payerId, ...rest } = data;

		// const password =
		//   "c2e08d259f7c5754c425c58ad89c97e3552fcb2407840aef23aa44379d2edc8e";
		// const authHeader =
		//   "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

		const paymentData = {
  TerminalKey: "1752254920336DEMO",
  Amount: 19200,
  OrderId: "21090",
  Description: "Подарочная карта на 1000 рублей",
  Token: "a202c5ac3dca5b52ef8fbee86fc44254dd39e78f2553863ffac9c7efe0f3c9e5",
  DATA: {
    Phone: "+71234567890",
    Email: "a@test.com",
  },
  Receipt: {
    Email: "a@test.ru",
    Phone: "+79031234567",
    Taxation: "osn",
    Items: [
      {
        Name: "Наименование товара 1",
        Price: 10000,
        Quantity: 1,
        Amount: 10000,
        Tax: "vat10",
        Ean13: "303130323930303030630333435",
      },
      {
        Name: "Наименование товара 2",
        Price: 3500,
        Quantity: 2,
        Amount: 7000,
        Tax: "vat20",
      },
      {
        Name: "Наименование товара 3",
        Price: 550,
        Quantity: 4,
        Amount: 2200, // 550 * 4, было 4200 — ошибка, если не опечатка
        Tax: "vat10",
      },
    ],
  },
};


		const res = await fetch("https://rest-api-test.tinkoff.ru/v2/Init", {
			method: "POST",
			// headers: {
			//   Authorization: authHeader,
			//   "Content-Type": "application/json",
			// },
			body: JSON.stringify(paymentData),
		});

		if (!res.ok) {
			console.error("Ошибка при запросе:", res.status);

			// вот здесь ты получаешь нужный URL:
			console.log("URL ответа:", res.url);

			console.log("[FORWARD RESPONSE]", res);

				const transaction = fetch("https://blow.igoshev.de/api/payment", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		console.log("[TRANSACTION RESPONSE]", transaction);

		return Response.json(res.url);

			// const html = await res.text(); // HTML-ответ вместо JSON
			// console.error("Ответ сервера (HTML):", html);

			// throw new Error(`Запрос не удался: ${res.status}`);
		}

		// const result = await res.json(); // теперь безопасно
		// console.log("Успешный ответ:", result);

		// console.log(444, res);

		// const result: ForwardResponse = await res.json();

		// console.log("[FORWARD RESPONSE]", result);

		// const transaction = fetch("https://blow.igoshev.de/api/payment", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify(data),
		// });

		// console.log("[TRANSACTION RESPONSE]", transaction);

		// return Response.json(result);
	} catch (error) {
		console.error("[FORWARD ERROR]", error);

		return new Response(
			JSON.stringify({ message: "Ошибка при отправке данных" }),
			{ status: 500 }
		);
	}
}

// export async function POST(req: NextRequest) {
// 	try {
// 		const data: IncomingPayload = await req.json();

// 		const { payerId, ...rest } = data;

// 		const res = await fetch("https://lk.cactuspay.pro/api/?method=create", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify(rest),
// 		});

// 		const result: ForwardResponse = await res.json();

// 		const transaction = fetch("https://blow.igoshev.de/api/payment", {
// 			method: "POST",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify(data),
// 		});

// 		console.log("[TRANSACTION RESPONSE]", transaction);

// 		return Response.json(result);
// 	} catch (error) {
// 		console.error("[FORWARD ERROR]", error);

// 		return new Response(
// 			JSON.stringify({ message: "Ошибка при отправке данных" }),
// 			{ status: 500 }
// 		);
// 	}
// }

// export async function POST(req: NextRequest) {
//   try {
//     const data: IncomingPayload = await req.json();

//     const username = "29228";
//     const password =
//       "c2e08d259f7c5754c425c58ad89c97e3552fcb2407840aef23aa44379d2edc8e";
//     const authHeader =
//       "Basic " + Buffer.from(`${username}:${password}`).toString("base64");

//     const res = await fetch("https://checkout.overpay.io/ctp/api/checkouts", {
//       method: "POST",
//       headers: {
//         Authorization: authHeader,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     const result: ForwardResponse = await res.json();

//     console.log("[FORWARD RESPONSE]", result);

//     const transaction = fetch("https://blow.igoshev.de/api/payment", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     console.log("[TRANSACTION RESPONSE]", transaction);

//     return Response.json(result);
//   } catch (error) {
//     console.error("[FORWARD ERROR]", error);

//     return new Response(
//       JSON.stringify({ message: "Ошибка при отправке данных" }),
//       { status: 500 },
//     );
//   }
// }
