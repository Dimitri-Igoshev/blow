"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Providers as ReduxProvider } from "@/redux/provider";
import { SocketListener } from "@/components/SocketListener";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
	interface RouterConfig {
		routerOptions: NonNullable<
			Parameters<ReturnType<typeof useRouter>["push"]>[1]
		>;
	}
}

export function Providers({ children, themeProps }: ProvidersProps) {
	const router = useRouter();

	return (
		<ReduxProvider>
			<HeroUIProvider navigate={router.push}>
				<NextThemesProvider {...themeProps}>
					<SocketListener />
					{children}
				</NextThemesProvider>
			</HeroUIProvider>
		</ReduxProvider>
	);
}
