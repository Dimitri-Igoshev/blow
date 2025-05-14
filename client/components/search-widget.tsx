"use client";

import { Button } from "@heroui/button";
import { cn } from "@heroui/theme";
import { FC, useEffect, useState } from "react";
import { Select, SelectItem, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { IoSearch } from "react-icons/io5";
import { Switch } from "@heroui/react";

import { MenIcon, WomenIcon } from "./icons";
import { LoginModal } from "./login-modal";
import { RegisterModal } from "./register-modal";
import { EmailModal } from "./email-password";
import { ErrorModal } from "./ErrorModal";

import { cities } from "@/data/cities";
import { ages } from "@/data/ages";
import { useGetMeQuery } from "@/redux/services/userApi";
import { ROUTES } from "@/app/routes";
import { useDispatch, useSelector } from "react-redux";
import { setSearch } from "@/redux/features/searchSlice"

interface SearchWidgetProps {
	horizontal?: boolean;
	className?: string;
	refresh?: () => void;
}

export const SearchWidget: FC<SearchWidgetProps> = ({
	horizontal = false,
	className = "",
	refresh = () => null,
}) => {
	const router = useRouter();
	const search = useSelector((state: any) => state.searchReducer);
  const dispatch = useDispatch()
  
	const { data: me } = useGetMeQuery(null);

	const [men, setMen] = useState(search?.sex === "male");
	const [woman, setWoman] = useState(search?.sex === "female");
	const [ageFromOptions, setAgeFromOptions] = useState([...ages]);
	const [ageFrom, setAgeFrom] = useState(search?.minage ? search.minage : "");
	const [ageToOptions, setAgeToOptions] = useState([...ages]);
	const [ageTo, setAgeTo] = useState(search?.maxage ? search.maxage : "");
	const [city, setCity] = useState(search?.city || "");
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		if (!search?.city) return;
		setCity(search.city as string);
	}, [search?.city]);

	useEffect(() => {
		if (!ageFrom) return;

		setAgeToOptions([
			...ages.filter(({ value }) => parseInt(value) >= parseInt(ageFrom)),
		]);
	}, [ageFrom]);

	useEffect(() => {
		if (!ageTo) return;

		setAgeFromOptions([
			...ages.filter(({ value }) => parseInt(value) <= parseInt(ageTo)),
		]);
	}, [ageTo]);

	const [newUser, setNewUser] = useState(null);

	const {
		isOpen: isLogin,
		onOpen: onLogin,
		onOpenChange: onLoginChange,
	} = useDisclosure();
	const {
		isOpen: isRegister,
		onOpen: onRegister,
		onOpenChange: onRegisterChange,
	} = useDisclosure();
	const {
		isOpen: isEmail,
		onOpen: onEmail,
		onOpenChange: onEmailChange,
	} = useDisclosure();

	const onNext = (value: any) => {
		setNewUser(value);

		onEmail();
	};

	const registration = () => {};

	const {
		isOpen: isError,
		onOpen: onError,
		onOpenChange: onErrorChange,
	} = useDisclosure();

	const [error, setError] = useState("");

	const handleError = (error: string) => {
		console.log("error", error);
		setError(error);
		onError();
	};

	const onSearch = () => {
		dispatch(
			setSearch({
				sex: men && woman ? "" : men ? "male" : woman ? "female" : "",
				minage: ageFrom ? ageFrom.toString() : "",
				maxage: ageTo ? ageTo.toString() : "",
				city: city ? city : "",
        limit: '16'
			})
		);
		if (!me) {
		// window.open(`${ROUTES.HOME}?sex=${men && woman ? "" : men ? "male" : woman ? "female" : ""}&minage=${ageFrom ? ageFrom.toString() : ""}&maxage=${ageTo ? ageTo.toString() : ""}&city=${city || ""}`, "_self");
		router.push(ROUTES.HOME);
		refresh();
		} else {
		router.push(ROUTES.ACCOUNT.SEARCH);
		}
	};

	return (
		<div
			className={cn(
				"p-[20px] sm:p-[30px] gap-4 sm:gap-5 bg-primary/50 mx-2.5 sm:mx-0 rounded-[32px]",
				{
					"flex flex-col xl:grid xl:grid-cols-[1fr_1fr_1fr_auto] 2xl:grid-cols-4 w-[400px] xl:w-full":
						horizontal,
					"flex flex-col sm:w-[400px]": !horizontal,
				},
				className
			)}
		>
			<div
				className={cn("flex items-center justify-between", {
					"justify-between xl:justify-start": horizontal,
					"justify-between": !horizontal,
				})}
			>
				<p className="font-semibold text-sm text-white mr-4">Найти</p>
				<div className="flex items-center gap-2.5 lx:gap-4">
					<Button
						className={cn("text-xs font-regular", {
							"bg-dark dark:bg-black text-white": men,
						})}
						radius="full"
						startContent={<MenIcon className="text-danger" />}
						onPress={() => setMen(!men)}
					>
						мужчину
					</Button>
					<Button
						className={cn("text-xs  font-regular", {
							"bg-dark dark:bg-black text-white": woman,
						})}
						radius="full"
						startContent={<WomenIcon className="text-danger" />}
						onPress={() => setWoman(!woman)}
					>
						девушку
					</Button>
				</div>
			</div>

			<div
				className={cn("flex items-center", {
					"justify-between xl:justify-start": horizontal,
					"justify-between": !horizontal,
				})}
			>
				<p className="font-semibold text-sm mr-4 text-white">Возраст</p>
				<div className="flex items-center gap-2.5 xl:gap-4">
					<Select
						className="w-[119px] text-primary"
						placeholder="от"
						radius="full"
						// @ts-ignore
						selectedKeys={[ageFrom]}
						onChange={(el: any) => setAgeFrom(el.target.value)}
					>
						{ageFromOptions.map((age) => (
							<SelectItem key={age.value}>{age.label}</SelectItem>
						))}
					</Select>
					<Select
						className="w-[119px] text-primary"
						placeholder="до"
						radius="full"
						// @ts-ignore
						selectedKeys={[ageTo]}
						onChange={(el: any) => setAgeTo(el.target.value)}
					>
						{ageToOptions.map((age) => (
							<SelectItem key={age.value}>{age.label}</SelectItem>
						))}
					</Select>
				</div>
			</div>

			<div
				className={cn("flex items-center", {
					"justify-between xl:justify-start": horizontal,
					"justify-between": !horizontal,
				})}
			>
				<p className="font-semibold text-sm mr-4 text-white">Откуда</p>
				<Select
					className="max-w-[248px] xl:max-w-[254px] text-primary"
					placeholder="выберите город"
					radius="full"
					// @ts-ignore
					selectedKeys={[city]}
					onChange={(el: any) => setCity(el.target.value)}
				>
					{cities.map((city) => (
						<SelectItem key={city.value}>{city.label}</SelectItem>
					))}
				</Select>
			</div>

			<div className="flex gap-6 items-center w-full justify-between">
				<Switch
					classNames={{
						label: "text-white",
					}}
					color="success"
					isSelected={isOnline}
					onValueChange={setIsOnline}
				>
					Онлайн
				</Switch>
				<Button
					className={cn(
						"font-semibold text-white dark:bg-black bg-dark w-full",
						{
							"mt-2": !horizontal,
							"xl:hidden 2xl:flex": horizontal,
						}
					)}
					radius="full"
					onPress={onSearch}
				>
					НАЙТИ
				</Button>
				<Button
					isIconOnly
					aria-label="Search"
					className={cn("", {
						hidden: !horizontal,
						"hidden xl:flex 2xl:hidden": horizontal,
					})}
					color="secondary"
					radius="full"
				>
					<IoSearch className="text-[20px]" />
				</Button>
			</div>

			<LoginModal
				isOpen={isLogin}
				showError={(error: string) => handleError(error)}
				onOpenChange={onLoginChange}
				onRegister={onRegister}
			/>
			<RegisterModal
				isOpen={isRegister}
				onLogin={onLogin}
				onNext={onNext}
				onOpenChange={onRegisterChange}
			/>
			<EmailModal
				isOpen={isEmail}
				newUser={newUser}
				onLogin={onLoginChange}
				onOpenChange={onEmailChange}
				onRegister={registration}
			/>
			<ErrorModal error={error} isOpen={isError} onOpenChange={onErrorChange} />
		</div>
	);
};
