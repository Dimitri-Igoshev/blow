// app/api/webhook/route.ts

import { NextRequest } from "next/server";

import { IncomingPayload } from "../types";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const data: IncomingPayload = await req.json();

    console.log('Получены данные от внешнего API:', data);

    // Отправляем внутреннее уведомление
    const result = await fetch('https://blow.igoshev.de/api/payment/notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId: data.OrderId, status: data.Status }),
    });

    if (result.ok) {
      return new Response('OK', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    // В случае ошибки от внутреннего API
    return new Response(JSON.stringify({ message: 'Ошибка сервера при зачислении средств' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);

    return new Response(JSON.stringify({ message: 'Ошибка сервера' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}