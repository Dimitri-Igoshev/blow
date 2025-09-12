'use client';
import { Button, Image } from '@heroui/react';

export default function YoomoneyAuthButtonSimple() {
  return (
    <Button
      radius="full"
      size="lg"
      startContent={<Image src="/ym.png" width={20} height={20} radius="none" />}
      onPress={() => { window.location.href = '/api/yoomoney/start'; }}
    >
      YooMoney
    </Button>
  );
}

// 'use client';
// import { Button, Image } from '@heroui/react'
// import React from 'react';

// type Props = {
//   clientId: string;
//   redirectUri: string;     // тот же, что в настройках YooMoney
//   scope: string[] | string;
//   instanceName?: string;
// };

// export default function YoomoneyAuthButton(props: Props) {
//   const startAuth = () => {
//     const form = document.createElement('form');
//     form.method = 'POST';
//     form.action = 'https://yoomoney.ru/oauth/authorize';
//     form.acceptCharset = 'utf-8';

//     // генерим state
//     const bytes = new Uint8Array(16);
//     crypto.getRandomValues(bytes);
//     const state = Array.from(bytes).map(b => b.toString(16).padStart(2,'0')).join('');

//     // ставим cookie ym_state (10 минут)
//     const secure = location.protocol === 'https:' ? '; Secure' : '';
//     document.cookie = `ym_state=${encodeURIComponent(state)}; Max-Age=600; Path=/; SameSite=Lax${secure}`;

//     const add = (name: string, value: string) => {
//       const input = document.createElement('input');
//       input.type = 'hidden';
//       input.name = name;
//       input.value = value;
//       form.appendChild(input);
//     };

//     add('client_id', props.clientId);
//     add('response_type', 'code');
//     add('redirect_uri', props.redirectUri);
//     add('scope', Array.isArray(props.scope) ? props.scope.join(' ') : props.scope);
//     if (props.instanceName) add('instance_name', props.instanceName);
//     add('state', state);

//     document.body.appendChild(form);
//     form.submit();
//   };

//   return (
//     <Button
//       radius="full"
//       size="lg"
//       startContent={<Image src="/ym.png" width={20} height={20} radius="none" />}
//       onPress={startAuth}
//     >
//       YooMoney
//     </Button>
//   );
// }
