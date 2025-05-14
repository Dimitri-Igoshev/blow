"use client";

import { cn } from "@heroui/theme";
import { FC } from "react";
import { Image } from "@heroui/image";
import { useRouter } from "next/navigation";

import { config } from "@/common/env";
import { getCityString } from "@/helper/getCityString";
import { ROUTES } from "@/app/routes";

interface PreviewWidgetProps {
  item: any;
  className?: string;
}

export const PreviewWidget: FC<PreviewWidgetProps> = ({ item, className }) => {
  const router = useRouter();

  return (
    <button
      className={cn(
        "w-full h-full border-[5px] rounded-[32px] border-white dark:border-white/25 overflow-hidden cursor-pointer text-white sm:hover:scale-110 transition-all z-0 relative",
        className,
      )}
      onClick={() => router.push(`${ROUTES.ACCOUNT.SEARCH}/${item._id}`)}
    >
      <Image
        alt=""
        height={"100%"}
        src={
          item?.photos[0]?.url
            ? `${config.MEDIA_URL}/${item?.photos[0]?.url}`
            : item?.sex === "male"
              ? "/men2.png"
              : "/woman2.png"
        }
        width={"100%"}
      />

      <div className="text-sm sm:text-base p-[7px] bg-transparent w-full absolute left-0 bottom-0 z-10">
        <div className=" bg-dark/50 p-3 px-4 rounded-[24px] flex flex-col">
          <div className="flex items-center gap-1.5">
            {/* {item?.online ? ( */}
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            {/* ) : null} */}
            <p className="font-semibold">
              {item?.firstName
                ? item.firstName
                : item?.sex === "male"
                  ? "Мужчина"
                  : "Девушка"}
            </p>
          </div>

          <p className="opacity-50 text-start">
            {item?.age ? item.age + ", " : ""}
            {getCityString(item?.city)}
          </p>
        </div>
      </div>
    </button>
  );
};
