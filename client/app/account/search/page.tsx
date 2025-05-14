"use client";

import { ProfilePreview } from "@/components/ProfilePreview";
import { useGetUsersQuery } from "@/redux/services/userApi";
import { useSelector } from "react-redux";

const AccountSearch = () => {
	const state = useSelector((state: any) => state);
	const search = state?.search?.search ? state.search.search : null;

	const { data: users } = useGetUsersQuery(search || {});

	return (
		<div className="flex w-full flex-col px-3 sm:px-9 pt-[400px] xl:pt-[220px] gap-[30px] min-h-screen">
			{users?.length ? (
				<>
					<div className="hidden sm:flex w-full items-center justify-between">
						<h1 className="font-semibold text-[36px]">Результаты поиска</h1>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-5 sm:gap-[34px] mt-[16px] sm:mt-0">
						{users.map((item: any) => (
							<ProfilePreview key={item._id} item={item} />
						))}
					</div>
				</>
			) : null}
		</div>
	);
};

export default AccountSearch;
