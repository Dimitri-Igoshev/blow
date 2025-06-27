"use client";

import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";

import { useGetMeQuery } from "@/redux/services/userApi";
import { ROUTES } from "../routes";
import { ConfirmationModal } from "@/components/ConfirmationModal";

function WrapperEmailConf({ children }: any) {
	const { data: me } = useGetMeQuery(null);
	const router = useRouter();

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	useEffect(() => {
		if (!me) return;

		if (me?.status === "new") {
			onOpen();
		} else {
			redirect(ROUTES.ACCOUNT.PROFILE);
		}
	}, [me]);

	return (
		<div>
			{children}
			<ConfirmationModal
				isOpen={isOpen}
				onOpenChange={() => {
					onOpenChange();
					router.push(ROUTES.HOME);
				}}
			/>
		</div>
	);
}

export default WrapperEmailConf;
