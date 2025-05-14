"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Image } from "@heroui/image";
import { MdOutlineHeight } from "react-icons/md";
import { GiWeight } from "react-icons/gi";
import { Button } from "@heroui/button";
import { PiWaveform } from "react-icons/pi";

import { getCityString } from "@/helper/getCityString";
import { config } from "@/common/env";
import { useGetUserQuery } from "@/redux/services/userApi";

interface ProfileViewProps {
  params: any;
}

const ProfileView: FC<ProfileViewProps> = ({ params }) => {
  const router = useRouter();

  const { data: user } = useGetUserQuery(params?.id);

  const [currentImage, setCurrentImage] = useState(user?.photos[0]?.url);

  return (
    <div className="flex w-full flex-col px-3 sm:px-9 pt-[86px] gap-[30px]">
      {user ? (
        <>
          <div className="flex w-full items-center justify-between">
            <button
              className="cursor-pointer hover:text-primary"
              onClick={() => router.back()}
            >
              Назад к результатам
            </button>
          </div>

          <div className="w-full grid grid-cols-12 gap-9">
            <div className="col-span-12 sm:col-span-6 flex flex-col">
              <div className="overflow-hidden relative rounded-[36px]">
                <Image
                  alt=""
                  className="z-0 relative"
                  height={"100%"}
                  radius="none"
                  src={
                    currentImage || user.photos[0].url
                      ? `${config.MEDIA_URL}/${currentImage || user.photos[0].url}`
                      : user?.sex === "male"
                        ? "/men2.png"
                        : "/woman2.png"
                  }
                  width={"100%"}
                />
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 w-full mt-4">
                {user?.photos.map((item: any, idx: number) => (
                  <button
                    key={item.url}
                    className="overflow-hidden relative rounded-[36px]"
                    onClick={() => setCurrentImage(item.url)}
                  >
                    <Image
                      alt=""
                      className="z-0 relative"
                      height={"100%"}
                      radius="none"
                      src={
                        item?.url
                          ? `${config.MEDIA_URL}/${item.url}`
                          : user?.sex === "male"
                            ? "/men2.png"
                            : "/woman2.png"
                      }
                      width={"100%"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-12 sm:col-span-6 bg-white dark:bg-foreground-100 rounded-[36px] p-[36px] flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col -mt-3">
                    <p className="font-semibold text-[36px]">
                      {user?.firstName
                        ? user.firstName
                        : user.sex === "male"
                          ? "Мужчина"
                          : "Девушка"}
                    </p>
                    <p className="text-[24px]">
                      {user?.age ? user.age + ", " : ""}
                      {getCityString(user?.city)}
                    </p>
                  </div>

                  <div className="flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <p className="-mt-[2px] text-[12px]">сейчас онлайн</p>
                  </div>
                </div>
                <div className="flex gap-6 -ml-1.5">
                  <div className="flex items-center gap-1">
                    <MdOutlineHeight
                      className="w-[20px] text-primary"
                      size={20}
                    />
                    <p>рост - {user?.height} см </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <GiWeight className="w-[18px] text-primary" size={18} />
                    <p>вес - {user?.weight} кг</p>
                  </div>
                </div>
                {user?.voice ? (
                  <Button
                    className="w-full z-0 relative"
                    color="primary"
                    radius="full"
                    startContent={<PiWaveform className="w-5 h-5" />}
                    variant="bordered"
                  >
                    {user?.voice ? "Прослушать голос" : "Записать голос"}
                  </Button>
                ) : null}

                <div className="flex flex-col gap-1 pt-6">
                  <p className="font-semibold text-[20px]">Цели знакомства</p>
                  <ul className="list-disc leading-9 mt-1 ml-5 text-[16px]">
                    {user.sponsor ? (
                      <li>
                        {user?.sex === "male"
                          ? "стану спонсором"
                          : "ищу спонсора"}
                      </li>
                    ) : null}
                    {user.traveling ? <li>совместные путешествия</li> : null}
                    {user.relationships ? <li>постоянные отношения</li> : null}
                    {user.evening ? <li>провести вечер</li> : null}
                  </ul>
                </div>

                <div className="flex flex-col gap-1 pt-6">
                  <p className="font-semibold text-[20px]">О себе</p>

                  <p className="mt-1">
                    {user?.about
                      ? user.about
                      : "Пользователь предпочел не указывать информацию о себе."}
                  </p>
                </div>
              </div>

              <div className="grid grid-flow-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <Button
                  className="z-0 relative"
                  color="secondary"
                  radius="full"
                  variant="solid"
                >
                  Создать заметку
                </Button>
                <Button
                  className="z-0 relative"
                  color="primary"
                  radius="full"
                  variant="solid"
                >
                  Написать сообщение
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProfileView;
