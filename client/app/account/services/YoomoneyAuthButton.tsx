'use client';
import { Button, Image } from '@heroui/react'
import React from 'react';

type Props = {
  clientId: string;
  redirectUri: string;     // Должен совпадать с тем, что в кабинете ЮMoney
  scope: string[] | string; // Например: ['account-info','payment']
  instanceName?: string;
};

export default function YoomoneyAuthButton(props: Props) {
  const startAuth = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://yoomoney.ru/oauth/authorize';
    form.acceptCharset = 'utf-8';

    // Рекомендуется state для защиты от CSRF
    const state = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    sessionStorage.setItem('ym_state', state);

    const add = (name: string, value: string) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value;
      form.appendChild(input);
    };

    add('client_id', props.clientId);
    add('response_type', 'code');
    add('redirect_uri', props.redirectUri);
    add('scope', Array.isArray(props.scope) ? props.scope.join(' ') : props.scope);
    if (props.instanceName) add('instance_name', props.instanceName);
    add('state', state);

    document.body.appendChild(form);
    form.submit(); // браузер отправит form-urlencoded POST
  };

  return (
    <Button
			radius="full"
			size="lg"
			startContent={
				<Image src="/ym.png" width={20} height={20} radius="none" />
			}
			onPress={startAuth}
		>
      YooMoney
		</Button>
  );
}
