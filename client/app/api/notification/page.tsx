'use client';
import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useExchangeCodeMutation } from '@/redux/services/yoomoneyApi'

export default function YoomoneyCallbackPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const code = sp.get('code');
  const state = sp.get('state');
  const [exchangeCode, { isLoading, data, error }] = useExchangeCodeMutation();

  useEffect(() => {
    const expected = sessionStorage.getItem('ym_state');
    if (state && expected && state !== expected) {
      console.error('State mismatch');
      return;
    }
    if (code) {
      exchangeCode({ code }); // см. RTK Query ниже
    }
  }, [code, state, exchangeCode]);

  if (isLoading) return <p>Завершаем вход…</p>;
  if (error) return <p>Ошибка обмена кода на токен</p>;
  if (data) {
    // здесь можешь сохранить токен в сторадж/куки или вызвать бекенд для связки с аккаунтом
    router.replace('/dashboard');
  }
  return null;
}

// import { config } from '@/common/env'
// import { NextRequest, NextResponse } from 'next/server';

// const APP_URL = config.NEXT_PUBLIC_APP_URL!;
// const API = config.NEXT_PUBLIC_API_URL!;

// export async function GET(req: NextRequest) {
//   const url = new URL(req.url);
//   const code = url.searchParams.get('code');
//   const state = url.searchParams.get('state') ?? undefined;

//   if (!code) return NextResponse.redirect(`${APP_URL}/billing?error=missing_code`);

//   // Прокидываем code на ваш бэкенд для обмена на access_token и привязки к текущему пользователю
//   const r = await fetch(`${API}/yoomoney/oauth/token`, {
//     method: 'POST',
//     headers: { 'content-type': 'application/json' },
//     body: JSON.stringify({ code, state }),
//     cache: 'no-store',
//   });

//   if (!r.ok) {
//     return NextResponse.redirect(`${APP_URL}/billing?error=token_exchange_failed`);
//   }

//   return NextResponse.redirect(`${APP_URL}/billing?connected=yoomoney`);
// }

//=====================

// import { NextRequest } from "next/server";

// import { IncomingPayload } from "../types";

// export async function POST(req: NextRequest): Promise<Response> {
//   try {
//     const data: IncomingPayload = await req.json();

//     console.log('Получены данные от внешнего API:', data);

//     // Отправляем внутреннее уведомление
//     const result = await fetch('https://blow.igoshev.de/api/payment/notification', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ orderId: data.OrderId, status: data.Status }),
//     });

//     if (result.ok) {
//       return new Response('OK', {
//         status: 200,
//         headers: {
//           'Content-Type': 'text/plain',
//         },
//       });
//     }

//     // В случае ошибки от внутреннего API
//     return new Response(JSON.stringify({ message: 'Ошибка сервера при зачислении средств' }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   } catch (error) {
//     console.error('[WEBHOOK ERROR]', error);

//     return new Response(JSON.stringify({ message: 'Ошибка сервера' }), {
//       status: 500,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//   }
// }
