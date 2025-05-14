"use client";

import { PreviewWidget } from "@/components/preview-widget";
import { useGetUsersQuery } from "@/redux/services/userApi";

export default function AccountGuests() {
  const { data: guests } = useGetUsersQuery({});

  return (
    <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-[30px] mb-[50px] min-h-screen h-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="w-full font-semibold text-[36px] text-center sm:text-left">
          Кто смотрел
        </h1>
      </div>

      {guests?.length ? (
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          <p className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6 text-primary text-[24px] font-semibold ml-3">
            Сегодня
          </p>

          <PreviewWidget item={guests[2]} />

          <p className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6 text-primary text-[24px] font-semibold ml-3 mt-3">
            Вчера
          </p>

          <PreviewWidget item={guests[3]} />
          <PreviewWidget item={guests[12]} />
          <PreviewWidget item={guests[8]} />

          <p className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 xl:col-span-6 text-primary text-[24px] font-semibold ml-3 mt-3">
            За последние 7 дней
          </p>

          <PreviewWidget item={guests[16]} />
          <PreviewWidget item={guests[11]} />
          <PreviewWidget item={guests[5]} />
          <PreviewWidget item={guests[4]} />
          <PreviewWidget item={guests[12]} />
          <PreviewWidget item={guests[17]} />
          <PreviewWidget item={guests[19]} />
          <PreviewWidget item={guests[14]} />
          <PreviewWidget item={guests[9]} />
        </div>
      ) : (
        <p>Вашу анкету ни кто не просматривал...</p>
      )}
    </div>
  );
}
