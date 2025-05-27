"use client";

import { ServiceCard } from "@/components/ServiceCard";
import { useGetServicesQuery } from "@/redux/services/serviceApi";
import {
  useAddBalanceMutation,
  useBuyServiceMutation,
  useBuyServicesKitMutation,
  useGetMeQuery,
} from "@/redux/services/userApi";
import { ru } from "date-fns/locale";
import { format } from "date-fns";

export default function accountServices() {
  const { data: me } = useGetMeQuery(null);
  const { data: services } = useGetServicesQuery(null);

  const [addBalance] = useAddBalanceMutation();

  const addMoney = (price: number) => {
    if (!me?._id) return;
    addBalance({ id: me._id, sum: +price })
      .unwrap()
      .catch(() => console.log("error"));
  };

  const getSubtitle = (item: any): string => {
    const isExist = me?.services.find((i: any) => i._id === item._id);

    if (!isExist) return "";

    if (isExist?.quantity) {
      return `осталось ${isExist.quantity}`;
    } else {
      return `до ${format(new Date(isExist?.expiredAt || Date.now()), "dd.MM.yyyy", {
        locale: ru,
      })}`;
    }
  };

  const [getService] = useBuyServiceMutation();
  const [getServicesKit] = useBuyServicesKitMutation();

  const buyService = (item: any, value: any) => {   
    // if (!item?.services?.length) {
      getService({
        userId: me._id,
        serviceId: item._id,
        name: item?.name,
        period: value?.period,
        quantity: value?.quantity,
        price: value?.price,
      })
        .unwrap()
        .catch((e) => console.log("ошибка покупки сервиса"));
    // } else {
    //   getServicesKit({
    //     userId: me._id,
    //     serviceId: item._id,
    //     name: item?.name,
    //     period: value?.period,
    //     price: value?.price,
    //     services: item?.services,
    //   })
    //     .unwrap()
    //     .catch((e) => console.log("ошибка покупки сервисного набора"));
    // }
  };

  return (
    <div className="flex w-full flex-col px-9 pt-[84px] gap-[30px] min-h-screen">
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
        subtile={`${me?.balance || 0} ₽`}
        title="Кошелек"
        onClick={({ price }) => addMoney(price)}
        transactions={me?.transactions || []}
      />

      {services?.map((item: any) => (
        <ServiceCard
          buttonText={item?.btn || "Купить"}
          defaultVlue={item.options[0]}
          subtile={getSubtitle(item)}
          text={item.description}
          title={item.name}
          options={item.options}
          onClick={(value: any) => buyService(item, value)}
        />
      ))}

      {/* <ServiceCard
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
      /> */}
    </div>
  );
}
