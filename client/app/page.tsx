"use client";

import { cn } from "@heroui/theme";
import { Image } from "@heroui/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";

import { ROUTES } from "./routes";

import { PreviewWidget } from "@/components/preview-widget";
import { SearchWidget } from "@/components/search-widget";
// import { cities } from "@/data/cities";
import { useGetUsersQuery } from "@/redux/services/userApi";
import { setSearch } from "@/redux/features/searchSlice";
import { AllCitiesModal } from "@/components/AllCitiesModal";
import NextLink from "next/link";
import { BlowLoader } from "@/components/BlowLoader";
import { useGetCitiesQuery } from "@/redux/services/cityApi"

export default function Home() {
  const { data: womans } = useGetUsersQuery({ sex: "female", withPhoto: true });
  const { data: mens } = useGetUsersQuery({ sex: "male", withPhoto: true });
  const { data: cities } = useGetCitiesQuery(null)

  const cities1 = cities?.slice(0, 6);
  const cities2 = cities?.slice(6, 12);
  const cities3 = cities?.slice(12, 18);
  const cities4 = cities?.slice(18, 24);
  const cities5 = cities?.slice(24, 30);
  const cities6 = cities?.slice(30, 34);

  const state = useSelector((state: any) => state);
  const search = state?.search?.search ? state.search.search : null;
  const { data: users } = useGetUsersQuery(search, {});
  const dispatch = useDispatch();

  const [searched, setSearched] = useState(false);

  const router = useRouter();

  const {
    isOpen: isAllCitiesOpen,
    onOpen: onAllCities,
    onOpenChange: onAllCitiesChange,
  } = useDisclosure();

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!womans || !mens) return;

    const timer = setTimeout(() => {
      setLoaded(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [womans, mens]);

  return (
    <>
      {!loaded ? <BlowLoader noBlur /> : null}
      <div className="relative">
        <img
          alt=""
          className="hidden sm:flex rounded-b-[50px] flex-col relative z-10 min-h-[700px] object-cover"
          src="/bg.png"
        />
        <Image
          alt=""
          className="flex sm:hidden rounded-b-[50px] flex-col relative z-10 min-h-[434px]"
          radius="none"
          src="/bg-m.png"
        />

        <div className="w-full absolute top-[100px] sm:top-[130px]">
          <div className="flex justify-center md:justify-start items-center gap-[5%] md:px-[40px] relative z-10">
            <SearchWidget refresh={() => setSearched(true)} />

            <div className="hidden md:flex flex-col md:w-[1100px] gap-8">
              <h1 className="text-[26px] lg:text-[36px] font-semibold text-white lg:leading-[56px]">
                Премиальное знакомство: успех встречает красоту.
              </h1>
              <ul className="hidden md:block text-white uppercase list-disc leading-7 ml-4">
                <li>Реальные анкеты и качественные фото</li>
                <li>Бесплатный Premium на 24 часа</li>
                <li>Уникальные голосовые сообщения</li>
                <li>Защита личных данных 24/7</li>
              </ul>
            </div>
          </div>

          {!searched && womans?.length ? (
            <div className="pt-[4%] sm:pt-[40px] bg-gray dark:bg-black">
              <h2 className="text-[26px] sm:text-[36px] text-white font-semibold sm:pl-[40px] z-20 relative text-center sm:text-start">
                Девушки
              </h2>

              <div className="w-full grid grid-cols-2 lg:grid-cols-4 mt-[30px] gap-3 sm:gap-[50px] z-20 relative px-3 sm:px-[40px]">
                {womans?.map((item: any, idx: number) => (
                  <div key={item._id} className="flex justify-center">
                    <PreviewWidget
                      className={cn({
                        "lg:mt-[50px] lg:-mb-[50px]":
                          idx === 1 ||
                          idx === 2 ||
                          idx === 5 ||
                          idx === 6 ||
                          idx === 9 ||
                          idx === 10 ||
                          idx === 13 ||
                          idx === 14,
                      })}
                      item={item}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="pt-[40px] sm:pt-[100px] bg-gray dark:bg-black">
            {!searched && mens?.length ? (
              <>
                <h2 className="text-[26px] sm:text-[36px] text-black dark:text-white font-semibold sm:pl-[40px] z-20 relative text-center sm:text-start">
                  Наши мужчины
                </h2>

                <div className="w-full grid grid-cols-2 lg:grid-cols-4 mt-[30px] gap-3 sm:gap-[50px] z-20 relative px-3 sm:px-[40px]">
                  {mens?.map((item: any, idx: number) => (
                    <div key={item._id} className="flex justify-center">
                      <PreviewWidget
                        className={cn({
                          "lg:mt-[50px] lg:-mb-[50px]":
                            idx === 1 ||
                            idx === 2 ||
                            idx === 5 ||
                            idx === 6 ||
                            idx === 9 ||
                            idx === 10 ||
                            idx === 13 ||
                            idx === 14,
                        })}
                        item={item}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {searched ? (
              <>
                <h2 className="text-[26px] sm:text-[36px] text-white font-semibold sm:pl-[40px] z-20 relative text-center sm:text-start">
                  Результаты поиска
                </h2>

                <div className="w-full grid grid-flow-col grid-cols-2 lg:grid-cols-4 mt-[30px] gap-3 sm:gap-[50px] z-20 relative px-3 sm:px-[40px]">
                  {users?.map((item: any, idx: number) => (
                    <div key={item._id} className="flex justify-center">
                      <PreviewWidget
                        className={cn({
                          "lg:mt-[50px] lg:-mb-[50px]":
                            idx === 1 ||
                            idx === 2 ||
                            idx === 5 ||
                            idx === 6 ||
                            idx === 9 ||
                            idx === 10 ||
                            idx === 13 ||
                            idx === 14,
                        })}
                        item={item}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            {loaded ? (
              <div className="bg-white dark:bg-foreground-200 p-6 m-3 sm:m-9 mb-0 mt-[70px] sm:mt-[120px] rounded-[36px] relative z-10">
                <Image
                  alt="BLOW"
                  className="object-cover float-left mr-8 mb-5 sm:mb-3"
                  height={510}
                  src={`/couple.png`}
                  width={570}
                />
                <p className="">
                  <span className="text-[24px] text-primary font-semibold">
                    BLOW
                  </span>
                </p>
                {/* <p className="mt-4">
                BLOW — это изысканное пространство для успешных людей, где
                встречаются мужчины и женщины, стремящиеся к гармоничным
                отношениям. Наша миссия — создание комфортной среды для
                построения взаимовыгодных связей на основе взаимного уважения.
              </p>
              <p className="mt-4">
                Платформа объединяет простоту использования с эффективностью
                поиска. Здесь ценятся комфорт, элегантность и искренность
                намерений. BLOW — это не просто сайт знакомств, а сообщество,
                где женщины находят достойных покровителей, а мужчины —
                утончённых спутниц.
              </p>
              <p className="mt-4">
                Наши пользователи — деловые люди, ценящие время и качество. Они
                выбирают отдых в компании интересных собеседников: путешествия,
                шопинг, светские мероприятия. BLOW становится проводником в мир
                изысканных удовольствий.
              </p>
              <p className="mt-4">
                База платформы ежедневно пополняется новыми анкетами. Мы
                гарантируем подлинность профилей и безопасность участников.
                Здесь вы найдёте единомышленников, готовых разделить ваши
                интересы и стремления.
              </p> */}
                {/* <p className="mt-4">
                Для женщин BLOW открывает двери в мир новых возможностей, где
                можно встретить щедрого покровителя. Для мужчин платформа — шанс
                найти заботливую спутницу. Это путь к ярким эмоциям и
                гармоничным отношениям.
              </p> */}
                {/* <p className="mt-4">
                Присоединяйтесь к BLOW и откройте мир, где взаимное уважение,
                комфорт и элегантность стоят превыше всего. Мы создали всё
                необходимое для начала прекрасного путешествия в мир успешных
                отношений. BLOW — ваш проводник в мир изысканных знакомств и
                незабываемых впечатлений.
              </p> */}
                <p className="mt-4">
                  BLOW — это изысканное пространство для успешных людей, где
                  встречаются мужчины и женщины, стремящиеся к гармоничным
                  отношениям. Наша миссия — создание комфортной среды для
                  построения взаимовыгодных связей на основе взаимного уважения.
                </p>
                <p className="mt-4">
                  Платформа объединяет простоту использования с эффективностью
                  поиска. Здесь ценятся комфорт, элегантность и искренность
                  намерений. BLOW — это не просто сайт знакомств, а сообщество,
                  где женщины находят достойных мужчин, а мужчины — утончённых
                  спутниц.
                </p>
                <p className="mt-4">
                  Наши пользователи — деловые люди, ценящие время и качество.
                  Они выбирают отдых в компании интересных собеседников.
                </p>

                <p className="mt-4">
                  База платформы ежедневно пополняется новыми анкетами. Мы
                  гарантируем подлинность профилей и безопасность участников.
                  Здесь вы найдёте единомышленников, готовых разделить ваши
                  интересы и стремления.
                </p>

                <p className="mt-4">
                  Для женщин BLOW открывает двери в мир новых возможностей, где
                  можно встретить интересного мужчину. Для мужчин платформа —
                  шанс найти заботливую спутницу. Это путь к ярким эмоциям и
                  гармоничным отношениям.
                </p>

                <p className="mt-4">
                  Присоединяйтесь к BLOW и откройте мир, где взаимное уважение,
                  комфорт и элегантность стоят превыше всего. Мы создали всё
                  необходимое для начала прекрасного путешествия в мир успешных
                  отношений. BLOW — ваш проводник в мир изысканных знакомств и
                  незабываемых впечатлений.
                </p>
              </div>
            ) : null}

            <div className="pt-[60px] sm:pt-[70px] bg-gray text-black/50 dark:text-white/50 leading-6 dark:bg-black px-6 sm:px-12">
              <h2 className="text-[20px] sm:text-[24px] font-semibold">
                Найди девушку или мужчину рядом с тобой – знакомься, общайся и
                наслаждайся приятным обществом в своем городе!
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 mt-[40px] sm:mt-[30px] px-6 sm:px-12 pb-[50px] gap-6 text-sm sm:text-base">
              <div className="flex flex-col gap-2 sm:gap-1">
                {cities1?.map((item: any) => (
                  <button
                    key={item.value}
                    className="cursor-pointer hover:text-primary hover:underline flex"
                    onClick={() => {
                      dispatch(
                        setSearch({
                          ...search,
                          city: item.value,
                        })
                      );
                      const interval = setInterval(() => {
                        if (search.city) {
                          router.push(ROUTES.ACCOUNT.SEARCH);
                          clearInterval(interval);
                        }
                      }, 100);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:gap-1">
                {cities2?.map((item: any) => (
                  <button
                    key={item.value}
                    className="cursor-pointer hover:text-primary hover:underline flex"
                    onClick={() => {
                      dispatch(
                        setSearch({
                          ...search,
                          city: item.value,
                        })
                      );
                      router.push(ROUTES.ACCOUNT.SEARCH);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:gap-1">
                {cities3?.map((item: any) => (
                  <button
                    key={item.value}
                    className="cursor-pointer hover:text-primary hover:underline flex"
                    onClick={() => {
                      dispatch(
                        setSearch({
                          ...search,
                          city: item.value,
                        })
                      );
                      router.push(ROUTES.ACCOUNT.SEARCH);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:gap-1">
                {cities4?.map((item: any) => (
                  <button
                    key={item.value}
                    className="cursor-pointer hover:text-primary hover:underline flex"
                    onClick={() => {
                      dispatch(
                        setSearch({
                          ...search,
                          city: item.value,
                        })
                      );
                      router.push(ROUTES.ACCOUNT.SEARCH);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:gap-1">
                {cities5?.map((item: any) => (
                  <button
                    key={item.value}
                    className="cursor-pointer hover:text-primary hover:underline flex"
                    onClick={() => {
                      dispatch(
                        setSearch({
                          ...search,
                          city: item.value,
                        })
                      );
                      router.push(ROUTES.ACCOUNT.SEARCH);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:gap-1">
                {cities6?.map((item: any) => (
                  <button
                    key={item.value}
                    className="cursor-pointer hover:text-primary hover:underline flex"
                    onClick={() => {
                      dispatch(
                        setSearch({
                          ...search,
                          city: item.value,
                        })
                      );
                      router.push(ROUTES.ACCOUNT.SEARCH);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  className="cursor-pointer text-primary flex w-full hover:text-dark font-semibold mt-6"
                  onClick={onAllCities}
                >
                  Все города
                </button>
              </div>
            </div>

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
                <p className="text-center sm:text-left mt-5 sm:mt-0 text-xs">
                  {new Date().getFullYear()} © BLOW. Сайт для лиц старше 18-ти
                  лет.
                </p>
                <div className="hidden sm:flex justify-center">
                  {loaded ? (
                    <Image
                      alt="BLOW"
                      height={40}
                      radius="none"
                      src="/logo.png"
                      width={101}
                    />
                  ) : null}
                </div>
                <div className="text-xs mt-7 sm:mt-0 flex flex-wrap items-center justify-center sm:justify-end gap-6">
                  <NextLink
                    href={ROUTES.CONTACTS}
                    className="underline cursor-pointer hover:text-primary text-nowrap"
                  >
                    Свяжись с нами
                  </NextLink>
                  <NextLink
                    href={ROUTES.POLICY}
                    className="underline cursor-pointer hover:text-primary text-nowrap"
                  >
                    Политики
                  </NextLink>
                  <NextLink
                    href={ROUTES.OFFER}
                    className="underline cursor-pointer hover:text-primary text-nowrap"
                  >
                    Договор оферта
                  </NextLink>
                  <NextLink
                    href={ROUTES.RULES}
                    className="underline cursor-pointer hover:text-primary text-nowrap"
                  >
                    Правила
                  </NextLink>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <AllCitiesModal
        isOpen={isAllCitiesOpen}
        onOpenChange={onAllCitiesChange}
      />
    </>
  );
}
