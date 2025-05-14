"use client";

import { cn, Tab, Tabs } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Image } from "@heroui/image";

import { ROUTES } from "../routes";

import Protected from "@/components/Protected";
import { SearchWidget } from "@/components/search-widget";
import { useGetMeQuery } from "@/redux/services/userApi"

export default function PanelLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [tab, setTab] = useState("profile");
  const { data: me } = useGetMeQuery(null)

  const isSearch = pathname === ROUTES.ACCOUNT.SEARCH;

  useEffect(() => {
    switch (pathname) {
      case ROUTES.ACCOUNT.SEARCH:
        setTab("search");

        return;
      case ROUTES.ACCOUNT.GUESTS:
        setTab("guests");

        return;
      case ROUTES.ACCOUNT.MAILINGS:
        setTab("mailings");

        return;
      case ROUTES.ACCOUNT.PROFILE:
        setTab("profile");

        return;
      case ROUTES.ACCOUNT.SERVICES:
        setTab("services");

        return;
      case ROUTES.ACCOUNT.NOTES:
        setTab("notes");

        return;
      case ROUTES.ACCOUNT.DIALOGUES:
        setTab("dialogues");

        return;
      default:
        setTab("search");
    }
  }, [pathname]);

  return (
    // <Protected>
      <>
      <div className="relative">
        <img
          alt=""
          className={cn(
            "hidden sm:flex rounded-b-[50px] flex-col fixed z-10 w-full object-cover",
            {
              "h-[430px] xl:h-[350px]": isSearch,
              "sm:h-[210px]": !isSearch,
            },
          )}
          src={isSearch ? "/bg.png" : "/bg-min.png"}
        />

        <img
          alt=""
          className={cn(
            "flex sm:hidden rounded-b-[50px] flex-col absolute z-20 w-full object-cover z-10",
            {
              "min-h-[434px]": isSearch,
              hidden: !isSearch,
            },
          )}
          src={isSearch ? "/bg-m.png" : "/bg-min.png"}
        />

        
        <div
          className={cn(
            "absolute sm:fixed z-10 sm:px-9 top-[96px] sm:mt-[30px] w-full",
          )}
        >
          {me ? (
            <div className="sm:mb-[40px]">
            <Tabs
              fullWidth
              aria-label="Tabs"
              className="hidden sm:flex"
              classNames={{
                tabContent: "text-white",
              }}
              radius="full"
              selectedKey={tab}
              variant="bordered"
            >
              <Tab
                key="search"
                href={ROUTES.ACCOUNT.SEARCH}
                title="Поиск анкет"
              />
              <Tab
                key="profile"
                href={ROUTES.ACCOUNT.PROFILE}
                title="Профиль"
              />
              <Tab
                key="dialogues"
                href={ROUTES.ACCOUNT.DIALOGUES}
                title="Диалоги"
              />
              <Tab
                key="guests"
                href={ROUTES.ACCOUNT.GUESTS}
                title="Кто смотрел"
              />
              <Tab
                key="services"
                href={ROUTES.ACCOUNT.SERVICES}
                title="Услуги"
              />
              <Tab key="notes" href={ROUTES.ACCOUNT.NOTES} title="Заметки" />
              <Tab
                key="mailings"
                href={ROUTES.ACCOUNT.MAILINGS}
                title="Рассылки"
              />
            </Tabs>
          </div>
          ) : null}

          {isSearch ? (
            <div className="flex w-full justify-center md:justify-start items-center gap-9">
              <SearchWidget horizontal />

              <p className="hidden md:flex xl:hidden text-white text-[26px] lg:text-[36px] font-semibold">
                Поиск лучших содержанок и самых успешных мужчин
              </p>
            </div>
          ) : null}

          {isSearch ? (
            <h2 className="block sm:hidden mt-[20px] text-[26px] text-white font-semibold z-20 relative text-center">
              Результаты поиска
            </h2>
          ) : null}
        </div>

        <div className="pt-[100px] sm:pt-[160px] pb-[50px]">{children}</div>

        <footer className="bg-gray dark:bg-black w-full">
          <div className="bg-dark rounded-t-[50px] px-3 sm:px-12 py-[28px] grid grid-cols-1 sm:grid-cols-3 text-white items-center text-xs sm:text-base">
            <div className="sm:hidden flex justify-center">
              <Image
                alt="BLOW"
                height={40}
                radius="none"
                src="/logo.png"
                width={101}
              />
            </div>
            <p className="text-center sm:twxt-left mt-5 sm:mt-0">
              {new Date().getFullYear()} © BLOW. Сайт для лиц старше 18-ти лет.
            </p>
            <div className="hidden sm:flex justify-center">
              <Image
                alt="BLOW"
                height={40}
                radius="none"
                src="/logo.png"
                width={101}
              />
            </div>
            <div className="mt-4 sm:mt-0 flex items-center justify-center sm:justify-end gap-6">
              <div className="underline cursor-pointer hover:text-primary text-nowrap">
                Свяжись с нами
              </div>
              <div className="underline cursor-pointer hover:text-primary text-nowrap">
                Правила
              </div>
              <div className="underline cursor-pointer hover:text-primary text-nowrap">
                Договор оферта
              </div>
            </div>
          </div>
        </footer>
      </div>
      </>
    // </Protected>
  );
}
