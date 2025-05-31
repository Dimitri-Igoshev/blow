"use client";

import { differenceInHours, differenceInDays } from "date-fns";
import { useEffect, useState } from "react";

import { PreviewWidget } from "@/components/preview-widget";
import { useGetMeQuery, useGetUsersQuery } from "@/redux/services/userApi";

export default function AccountGuests() {
  const { data: me } = useGetMeQuery(null);
  const { data: users } = useGetUsersQuery({ limit: 1000000 });

  const [lastDay, setLastDay] = useState<any[]>([]);
  const [lastWeek, setLastWeek] = useState<any[]>([]);
  const [lastMonth, setLastMonth] = useState<any[]>([]);
  const [lastYear, setLastYear] = useState<any[]>([]);

  const getGuests = () => {
    if (!me?.visits?.length || !users?.length) return [];

    const guests: any[] = [];

    me.visits.forEach((visit: any) => {
      const res = users.find((item: any) => item._id === visit._id);

      if (res) guests.push({ ...res, date: visit.date });
    });

    return guests;
  };

  useEffect(() => {
    if (!users || !me?.visits?.length) return;

    const now = new Date();
    const guests = getGuests();

    if (!guests?.length) return;

    setLastDay(
      guests.filter(
        (item: any) => differenceInHours(now, new Date(item.date)) <= 24,
      ) || [],
    );
    setLastWeek(
      guests.filter(
        (item: any) =>
          differenceInHours(now, new Date(item.date)) > 24 &&
          differenceInDays(now, new Date(item.date)) <= 7,
      ) || [],
    );
    setLastMonth(
      guests.filter(
        (item: any) =>
          differenceInHours(now, new Date(item.date)) > 24 &&
          differenceInDays(now, new Date(item.date)) > 7 &&
          differenceInDays(now, new Date(item.date)) <= 30,
      ) || [],
    );
    setLastYear(
      guests.filter(
        (item: any) =>
          differenceInHours(now, new Date(item.date)) > 24 &&
          differenceInDays(now, new Date(item.date)) > 30 &&
          differenceInDays(now, new Date(item.date)) <= 365,
      ),
    );
  }, [users]);

  return (
    <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-[30px] mb-[50px] min-h-screen h-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="w-full font-semibold text-[36px] text-center sm:text-left">
          Кто смотрел
        </h1>
      </div>

      {lastDay?.length ||
      lastWeek?.length ||
      lastMonth?.length ||
      lastYear?.length ? (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {lastDay.length ? (
            <p className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6 text-primary text-[24px] font-semibold ml-3">
              За последние 24 часа
            </p>
          ) : null}

          {lastDay.map((item: any) => (
            <PreviewWidget key={item._id} item={item} />
          ))}

          {lastWeek?.length ? (
            <>
              <p className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6 text-primary text-[24px] font-semibold ml-3 mt-3">
                За поледние 7 дней
              </p>

              {lastWeek.map((item: any) => (
                <PreviewWidget key={item._id} item={item} />
              ))}
            </>
          ) : null}

          {lastMonth?.length ? (
            <>
              <p className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6 text-primary text-[24px] font-semibold ml-3 mt-3">
                За поледние 30 дней
              </p>

              {lastMonth.map((item: any) => (
                <PreviewWidget key={item._id} item={item} />
              ))}
            </>
          ) : null}

          {lastYear?.length ? (
            <>
              <p className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6 text-primary text-[24px] font-semibold ml-3 mt-3">
                За поледние 12 месяцев
              </p>

              {lastYear.map((item: any) => (
                <PreviewWidget key={item._id} item={item} />
              ))}
            </>
          ) : null}
        </div>
      ) : (
        <p>Вашу анкету ни кто не просматривал...</p>
      )}
    </div>
  );
}
