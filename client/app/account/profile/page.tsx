"use client";

import { Image } from "@heroui/image";
import { MdOutlineHeight, MdOutlineLogout } from "react-icons/md";
import { GiWeight } from "react-icons/gi";
import { Button } from "@heroui/button";
import { PiWaveform } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { LuCrown, LuWallet } from "react-icons/lu";
import { IoArrowUp } from "react-icons/io5";
import { LuTrash } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ROUTES } from "@/app/routes";
import { getCityString } from "@/helper/getCityString";
import { useGetMeQuery } from "@/redux/services/userApi";
import { config } from "@/common/env";

const AccountProfilePage = () => {
  const router = useRouter();

  const { data: me } = useGetMeQuery(null);

  const logout = () => {
    localStorage.setItem("access-token", "");
    router.replace(ROUTES.HOME);
    window.location.reload();
  };

  const [width, setWidth] = useState();
  const ref = useRef<any>(null);

  useEffect(() => {
    setWidth(ref.current.offsetWidth);

    window.addEventListener("resize", () => {
      setWidth(ref.current.offsetWidth);
    });

    return () => {
      window.removeEventListener("resize", () => {
        setWidth(ref.current.offsetWidth);
      });
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 px-3 sm:px-9 pt-[94px] sm:gap-[50px]">
      <div className="sm:col-span-1 flex flex-col gap-[50px] w-full">
        <div ref={ref} className="relative">
          <Image
            alt=""
            className="border-[7px] border-white dark:border-foreground-100 z-0 relative"
            height={width ? width : "100%"}
            radius="full"
            src={
              me?.photos[0]?.url
                ? `${config.MEDIA_URL}/${me?.photos[0]?.url}`
                : me?.sex === "male"
                  ? "/men.jpg"
                  : "/woman.jpg"
            }
            style={{ objectFit: "cover" }}
            width={"100%"}
          />
          {/* <div className="absolute rounded-full w-10 h-10 bg-primary cursor-pointer flex justify-center items-center right-[40px] bottom-[40px] border-[2px] border-white z-20">
					<IoCameraOutline className="text-white mb-px" />
					</div> */}
        </div>

        <div className="bg-white dark:bg-foreground-100 p-[30px] rounded-[32px] flex flex-col gap-5">
          <Link href={ROUTES.ACCOUNT.PROFILE_EDIT}>
            <div className="flex gap-2.5 cursor-pointer group transition-all">
              <FiEdit className="text-primary min-w-4" size={16} />
              <p className="-mt-[3px] group-hover:text-primary">
                Редактировать профиль
              </p>
            </div>
          </Link>

          {me?.sex === "male" ? (
            <div className="flex gap-2.5 cursor-pointer group transition-all">
              <LuCrown className="text-primary min-w-4" size={16} />
              <p className="-mt-[3px] group-hover:text-primary">
                {me?.premium ? "Продлить премиум" : "Купить премиум"}
              </p>
            </div>
          ) : null}

          <div className="flex gap-2.5 cursor-pointer group transition-all">
            <IoArrowUp className="text-primary min-w-4" size={16} />
            <p className="-mt-[3px] group-hover:text-primary">Поднять анкету</p>
          </div>

          <div className="flex gap-2.5 cursor-pointer group transition-all">
            <LuWallet className="text-primary min-w-4" size={16} />
            <p className="-mt-[3px] group-hover:text-primary">
              Пополнить кошелек
            </p>
          </div>

          <div className="flex gap-2.5 cursor-pointer group transition-all">
            <LuTrash className="text-primary min-w-4" size={16} />
            <p className="-mt-[3px] group-hover:text-primary">Удалить анкету</p>
          </div>

          <button
            className="flex gap-2.5 cursor-pointer group transition-all"
            onClick={logout}
          >
            <MdOutlineLogout className="text-primary" size={16} />
            <p className="-mt-[3px] group-hover:text-primary">Выйти</p>
          </button>
        </div>
      </div>

      <div className="mt-9 sm:mt-0 sm:col-span-3 flex flex-col">
        <div className="bg-white dark:bg-foreground-100 p-9 rounded-[32px] flex flex-col gap-5">
          <div className="flex  flex-wrap items-center justify-between w-full">
            <div className="flex sm:hidden  items-center gap-2 w-full sm:w-auto">
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <p>сейчас онлайн</p>
            </div>
            <div className="flex items-center gap-5">
              <p className="text-[36px] font-semibold mt-3 sm:-mt-1.5 mr-3 sm:mr-0">
                {me?.firstName
                  ? me.firstName
                  : me?.sex == "male"
                    ? "Мужчина"
                    : "Девушка"}
              </p>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <p>сейчас онлайн</p>
              </div>
            </div>

            <p className="text-[24px]">
              {me?.age ? me.age + ", " : ""}
              {getCityString(me?.city)}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-10 -ml-2">
              <div className="flex items-center gap-1">
                <MdOutlineHeight className="w-[22px] text-primary" size={22} />
                <p>рост - {me?.height ? me.height + " см" : ""}</p>
              </div>
              <div className="flex items-center gap-1">
                <GiWeight className="w-[22px] text-primary mr-1" size={18} />
                <p>вес - {me?.weight ? me.weight + " кг" : ""}</p>
              </div>
            </div>

            <div>
              <Button
                className="w-full z-0 relative mt-8"
                color="primary"
                radius="full"
                startContent={<PiWaveform className="w-5 h-5" />}
                variant="bordered"
              >
                {me?.voice ? "Прослушать голос" : "Записать голос"}
              </Button>
            </div>
          </div>

          <div className="text-[20px] font-semibold mt-3">Цели знакомства</div>

          <ul className="flex flex-wrap w-full gap-6 pl-4">
            {!me?.sponsor ? null : (
              <li className="list-disc mr-8">
                {me?.sex.male ? "Стану спонсором" : "Ищу спонсора"}
              </li>
            )}
            {!me?.traveling ? null : (
              <li className="list-disc mr-8">Совместные путешествия</li>
            )}
            {!me?.relationships ? null : (
              <li className="list-disc mr-8">Постоянные отношения</li>
            )}
            {!me?.evening ? null : (
              <li className="list-disc mr-8">Провести вечер</li>
            )}
          </ul>

          <div className="text-[20px] font-semibold mt-6">О себе</div>

          <p>
            {me?.about
              ? me.about
              : "Пользователь предпочел не указывать информацию о себе."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountProfilePage;
