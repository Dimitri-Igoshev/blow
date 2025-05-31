"use client";

import { Button } from "@heroui/button";

export default function accountMailings() {
  const addMailing = () => {

  } 
  
  return (
    <div className="flex w-full flex-col px-9 h-screen pt-[84px] gap-[30px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="font-semibold text-[36px]">Рассылки</h1>

        <Button className="" color="primary" radius="full">
          Создать
        </Button>
      </div>

      <p>Еще нет рассылок...</p>
    </div>
  );
}
