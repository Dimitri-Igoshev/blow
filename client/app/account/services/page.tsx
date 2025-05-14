"use client";

import { ServiceCard } from "@/components/ServiceCard";

export default function accountServices() {
  return (
    <div className="flex w-full flex-col px-9 pt-[84px] gap-[30px]">
      <div className="flex w-full items-center justify-between">
        <h1 className="font-semibold text-[36px]">Услуги</h1>
      </div>

      <ServiceCard
        oneTime
        buttonText="Пополнить"
        defaultVlue={{ period: "", price: "5000" }}
        list={[
          "При оплате картой в выписке и личном кабинете не будет указано, что платеж связан с сайтом знакомств.",
          "Ваши данные карты остаются конфиденциальными. Мы их не видим, и банк не передает эту информацию третьим лицам.",
          "Мы не подключаем автоподписки и не выполняем повторные списания.",
        ]}
        subtile="3000 ₽"
        title="Кошелек"
        onClick={(value: any) => console.log(value)}
      />

      <ServiceCard
        buttonText="Продлить"
        defaultVlue={{ period: "month", price: "7900" }}
        subtile="осталось 3 дня"
        text="Чтобы продолжить знакомиться с новыми девушками после окончания пробного периода, необходимо активировать премиум-аккаунт. Пробный период длится 24 часа с момента начала общения, давая вам возможность оценить, насколько вам интересно знакомство и встречи на нашем сайте."
        title="Премиум аккаунт"
        onClick={(value: any) => console.log(value)}
      />

      <ServiceCard
        oneTime
        buttonText="Поднять"
        defaultVlue={{ period: "", price: "200" }}
        subtile="Вы на 145 месте"
        text='Поднятие анкеты выведет ее в поиске на первое место после анкет из раздела "ТОП". Если у вас уже оплачено размещение в "ТОП", поднятие сделает вашу анкету первой в этой категории.'
        title="Поднятие анкеты"
        onClick={(value: any) => console.log(value)}
      />

      <ServiceCard
        buttonText="В топ"
        defaultVlue={{ period: "month", price: "1000" }}
        subtile=""
        text='Для закрепления анкеты в "ТОП" требуется активный премиум-аккаунт. Это необходимо, потому что без премиум-аккаунта вы не сможете отвечать на сообщения девушек, и вложенные средства не принесут желаемого результата.'
        title="В топ"
        onClick={(value: any) => console.log(value)}
      />
    </div>
  );
}
