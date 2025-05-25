import { Button } from "@heroui/button";
import { cn, Input, Select, SelectItem } from "@heroui/react";
import { useState, type FC } from "react";
import { ru } from "date-fns/locale";
import { periods } from "@/data/periods";
import { format } from "date-fns";

interface ServiceCardProps {
  title: string;
  subtile: string;
  text?: string;
  list?: string[];
  oneTime?: boolean;
  onClick: (value: any) => void;
  buttonText: string;
  defaultVlue?: { price: string; period?: string };
  transactions?: any[];
}

export const ServiceCard: FC<ServiceCardProps> = ({
  title,
  subtile,
  text = "",
  list = [],
  oneTime = false,
  onClick,
  buttonText,
  defaultVlue,
  transactions = [],
}) => {
  const [value, setValue] = useState({
    period: defaultVlue?.period || "month",
    price: defaultVlue?.price || "",
  });

  const [isHistory, setIsHistory] = useState(false);

  return (
    <div className="bg-white dark:bg-foreground-100 rounded-[36px] p-[30px] flex flex-col gap-6">
      <div className="flex flex-wrap justify-between items-center text-[24px] font-semibold">
        <p>{title}</p>
        <p className="text-[20px] font-medium sm:text-[24px] sm:font-semibold">
          {subtile}
        </p>
      </div>

      {text ? <p>{text}</p> : null}

      {list.length ? (
        <ul className="ml-6 flex flex-col gap-2 list-disc">
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}

      {isHistory ? (
        <div className="flex flex-col gap-3 p-4 rounded-[24px] bg-foreground-100">
          {transactions.map((item: any) => (
            <div className="bg-white dark:bg-black p-3 px-4 rounded-[16px] grid gap-3 grid-cols-3 items-center">
              <div className="font-medium">{item?.type === "credit" ? "Пополнение" : "Снятие"}</div>
              <div className="flex justify-center text-xs">{format(new Date(item.updatedAt), "dd.MM.yyyy", {
                locale: ru,
              })}</div>
              <div className={cn("flex justify-end", {
                ["text-red-500"]: item?.type === "debit",
                ["text-green-500"]: item?.type === "credit"
              })}>{item.sum}₽</div>
            </div>
          ))}
        </div>
      ) : null}

      <div
        className={cn("flex flex-wrap items-center gap-3", {
          ["justify-between"]: transactions?.length,
          ["justify-end"]: !transactions?.length,
        })}
      >
        {transactions?.length ? (
          <Button
            className="z-0 relative w-full sm:w-auto"
            // color="secondary"
            radius="full"
            variant="solid"
            onPress={() => setIsHistory(!isHistory)}
          >
            {isHistory ? "Cкрыть историю" : "История операций"}
          </Button>
        ) : null}

        <div className="flex items-center gap-3">
          {!oneTime ? (
            <Select
              className="text-primary z-0 relative rounded-full w-full sm:w-[150px]"
              classNames={{ value: "font-semibold" }}
              radius="full"
              selectedKeys={[value.period]}
              onChange={(el) => setValue({ ...value, period: el.target.value })}
            >
              {periods.map((period: any) => (
                <SelectItem key={period.value}>{period.label}</SelectItem>
              ))}
            </Select>
          ) : null}

          <Input
            className="z-0 relative w-full sm:w-[150px]"
            classNames={{ input: "font-semibold" }}
            endContent={<span className="text-primary">₽</span>}
            placeholder=""
            radius="full"
            value={value.price}
            onChange={(e) => setValue({ ...value, price: e.target.value })}
          />

          <Button
            className="z-0 relative w-full sm:w-auto"
            color="primary"
            radius="full"
            variant="solid"
            onPress={() =>
              onClick({ period: value.period, price: value.price })
            }
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
