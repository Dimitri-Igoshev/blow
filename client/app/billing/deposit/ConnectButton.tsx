"use client";

import { config } from "@/common/env";
import { Button, Image } from "@heroui/react";

export function ConnectYooMoneyButton() {
	const onClick = () => {
		const params = new URLSearchParams({
			client_id: config.NEXT_PUBLIC_YOOMONEY_CLIENT_ID!,
			response_type: "code",
			redirect_uri: `${config.NEXT_PUBLIC_APP_URL}/oauth/callback`,
			scope: "payment", // можно добавить operation-history при желании
			instance_name: "BLOW",
			// state положите в куку/xсессию и добавьте сюда (защита от CSRF)
		});
		window.location.href = `https://yoomoney.ru/oauth/authorize?${params.toString()}`;
	};
	return (
		<Button
			radius="full"
			size="lg"
			startContent={
				<Image src="/ym.png" width={20} height={20} radius="none" />
			}
			onPress={onClick}
		>
			{/* Подключитxxь YooMoney */}
      YooMoney
		</Button>
	);
}
