"use client";

import { ROUTES } from "@/app/routes"
import { cities } from "@/data/cities";
import { setSearch } from "@/redux/features/searchSlice"
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { useRouter } from "next/navigation"
import { FC } from "react";
import { useDispatch, useSelector } from "react-redux"

interface AllCitiesModalProps {
	isOpen: boolean;
	onOpenChange: () => void;
}

export const AllCitiesModal: FC<AllCitiesModalProps> = ({
	isOpen,
	onOpenChange,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const search = useSelector((state: any) => state.search.search);
  
	return (
		<Modal
			backdrop="blur"
			className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
			classNames={{
				closeButton: "m-3.5",
			}}
			isOpen={isOpen}
			size="5xl"
			onOpenChange={onOpenChange}
		>
			<ModalContent>
				{(onClose) => (
					<>
						<ModalHeader className="flex flex-col gap-1 text-[20px]">
							Все города
						</ModalHeader>
						<ModalBody>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 pb-3">
							{cities.map((city: any) => (
								<button
									key={city.value}
									className="cursor-pointer hover:text-primary hover:underline flex"
									onClick={() => {
										dispatch(
											setSearch({
												...search,
												city: city.value,
											})
										);
										router.push(ROUTES.ACCOUNT.SEARCH);
									}}
								>
									{city.label}
								</button>
							))}
              </div>
						</ModalBody>
						{/* <ModalFooter>
							<div className="flex gap-3 items-end">
								<Button className="w-full" radius="full" onPress={onClose}>
									Закрыть
								</Button>
							</div>
						</ModalFooter> */}
					</>
				)}
			</ModalContent>
		</Modal>
	);
};
