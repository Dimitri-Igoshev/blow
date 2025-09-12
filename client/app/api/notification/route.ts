import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { config } from '@/common/env'

export const dynamic = 'force-dynamic'; // чтобы не кэшировал

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'missing_code' }, { status: 400 });
  }

  // проверяем state из cookie, которую ставили при старте OAuth
  // @ts-ignore
  const expected = cookies()?.get('ym_state')?.value;
  if (expected && state && expected !== state) {
    return NextResponse.redirect(new URL('/auth/error?reason=state_mismatch', url.origin));
  }

  const clientId = config.NEXT_PUBLIC_YOOMONEY_CLIENT_ID;
  const clientSecret = config.NEXT_YOOMONEY_CLIENT_SECRET;
  const redirectUri =
    config.YOOMONEY_REDIRECT_URI ?? `${url.origin}/api/yoomoney/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'server_not_configured' }, { status: 500 });
  }

  try {
    // обмен кода на токен
    const form = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId, // оставим и в body, и в Basic — так надёжнее
    });

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const res = await fetch('https://yoomoney.ru/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basic}`,
      },
      body: form.toString(),
      cache: 'no-store',
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.redirect(
        new URL(`/auth/error?reason=token_error&msg=${encodeURIComponent(text)}`, url.origin)
      );
    }

    const token = await res.json(); // { access_token, expires_in, ... }

    // кладём токен в httpOnly-cookie и редиректим на дашборд
    const resp = NextResponse.redirect(new URL('/account/services', url.origin));
    resp.cookies.set({
      name: 'ym_token',
      value: token.access_token,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: typeof token.expires_in === 'number' ? token.expires_in : 60 * 60 * 24,
    });
    // очищаем state
    resp.cookies.set('ym_state', '', { path: '/', maxAge: 0 });

    return resp;
  } catch (e) {
    return NextResponse.redirect(new URL('/auth/error?reason=exception', url.origin));
  }
}


// 'use client';
// import { useEffect } from 'react';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { useExchangeCodeMutation } from '@/redux/services/yoomoneyApi'

// export default function YoomoneyCallbackPage() {
//   const sp = useSearchParams();
//   const router = useRouter();
//   const code = sp.get('code');
//   const state = sp.get('state');
//   const [exchangeCode, { isLoading, data, error }] = useExchangeCodeMutation();

//   useEffect(() => {
//     const expected = sessionStorage.getItem('ym_state');
//     if (state && expected && state !== expected) {
//       console.error('State mismatch');
//       return;
//     }
//     if (code) {
//       exchangeCode({ code }); // см. RTK Query ниже
//     }
//   }, [code, state, exchangeCode]);

//   if (isLoading) return <p>Завершаем вход…</p>;
//   if (error) return <p>Ошибка обмена кода на токен</p>;
//   if (data) {
//     // здесь можешь сохранить токен в сторадж/куки или вызвать бекенд для связки с аккаунтом
//     router.replace('/dashboard');
//   }
//   return null;
// }

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
