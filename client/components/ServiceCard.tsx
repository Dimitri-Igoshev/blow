import { Button } from "@heroui/button";
import { Input, Select, SelectItem } from "@heroui/react";
import { useState, type FC } from "react";

import { periods } from "@/data/periods";

interface ServiceCardProps {
  title: string;
  subtile: string;
  text?: string;
  list?: string[];
  oneTime?: boolean;
  onClick: (value: any) => void;
  buttonText: string;
  defaultVlue?: { price: string; period: string };
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
}) => {
  const [value, setValue] = useState({
    period: defaultVlue?.period || "month",
    price: defaultVlue?.price || "",
  });

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

      <div className="flex flex-wrap justify-end items-center gap-3">
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
          onPress={() => onClick({ period: "месяц", price: "990" })}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
