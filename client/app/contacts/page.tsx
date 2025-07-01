"use client";

const contactsText = `
Наименование организации: Freaks 4U Gaming GmbH
Номер телефона: +79031016945
Почта: admin@blow.ru
Юридический адрес: An der Spreeschanze 10 , 13599 , Berlin , Germany
Служба поддержки пользователей - Telegram - https://t.me/blowadmin`;

export default function ContactsPage() {
  return (
    <div className="flex w-full flex-col px-3 md:px-9 pt-[84px] gap-6 pb-[50px]">
      <h1 className="text-[36px] font-semibold">Контакты</h1>
      <div className="whitespace-pre-wrap text-sm sm:text-base space-y-4">
        {contactsText}
      </div>
    </div>
  );
}
