"use client";

import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

import { ProfilePreview } from "@/components/ProfilePreview";
import { useGetUsersQuery } from "@/redux/services/userApi";
import { cities } from "@/data/cities";

const AccountSearch = () => {
  const state = useSelector((state: any) => state);
  const search = state?.search?.search ? state.search.search : null;
  const [limit, setLimit] = useState(20);

  const { ref, inView } = useInView();

  const { data: users, isFetching } = useGetUsersQuery(
    search ? { ...search, limit } : { limit },
  );

  useEffect(() => {
    if (inView && !isFetching) {
      setLimit((prev) => prev + 20);
    }
  }, [inView]);

  return (
    <div className="flex w-full flex-col px-3 sm:px-9 pt-[400px] xl:pt-[220px] gap-[30px] min-h-screen">
      <div className="hidden sm:flex w-full items-center justify-between">
        <h1 className="font-semibold text-[36px]">
          Результаты поиска{" "}
          <span className="text-primary text-[28px]">
            {search?.city
              ? cities?.find((city: any) => city.value === search.city)?.label
              : ""}
          </span>
        </h1>
      </div>
      {users?.length ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-5 sm:gap-[34px] mt-[16px] sm:mt-0">
            {users.map((item: any) => (
              <ProfilePreview key={item._id} item={item} />
            ))}
          </div>

          <div ref={ref} className="h-10 text-center text-gray-500" />
        </>
      ) : (
        <div className="text-[24px]">Анкет не найдено :(</div>
      )}
    </div>
  );
};

export default AccountSearch;
