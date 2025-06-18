// app/api/webhook/route.ts

import { NextRequest } from "next/server";
import { IncomingPayload } from "../types";

export async function POST(req: NextRequest) {
	try {
		const data: IncomingPayload = await req.json();

		const response = await fetch(
			`https://blow.ru/api/notification`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}
		);

		const result = await response.json();

		console.log('[NOTIFICATION RESPONSE]', result);

		return Response.json({
			message: "Данные получены и пересланы",
			notificationResponse: result,
		});
	} catch (error) {
		console.error("[WEBHOOK ERROR]", error);
		return new Response(JSON.stringify({ message: "Ошибка сервера" }), {
			status: 500,
		});
	}
}
