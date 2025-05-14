"use client";

import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";
import { PiWaveform } from "react-icons/pi";
import { Input, Textarea } from "@heroui/input";
import { Checkbox, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

import { cities } from "@/data/cities";
import { ages } from "@/data/ages";
import { heights } from "@/data/heights";
import { weights } from "@/data/weights";
import { HeartIcon } from "@/components/icons";
import { useGetMeQuery, useUpdateUserMutation } from "@/redux/services/userApi";
import { ROUTES } from "@/app/routes";
import UploadImages from "@/components/UploadImages";
import { IPhoto } from "@/common/interface/photo.interface";

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(false);

  const { data: me, refetch } = useGetMeQuery(null);

  useEffect(() => {
    if (!me) return;

    setUser({
      ...me,
      age: me?.age?.toString() || "",
      height: me?.height?.toString() || "",
      weight: me?.weight?.toString() || "",
    });
  }, [me]);

  const [update] = useUpdateUserMutation();

  const save = async () => {
    if (!user) return;

    setLoading(true);

    const data = {
      firstName: user.firstName,
      city: user.city,
      age: parseInt(user.age),
      height: parseInt(user.height),
      weight: parseInt(user.weight),
      sponsor: !!user?.sponsor,
      traveling: !!user?.traveling,
      relationships: !!user?.relationships,
      evening: !!user?.evening,
      about: user.about,
    };

    await update({ id: me._id, body: data })
      .unwrap()
      .then(() => {
        router.push(ROUTES.ACCOUNT.PROFILE);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  };

  const [files, setFiles] = useState<any[]>(me?.photos ? [...me.photos] : []);

  const removeImage = (image: IPhoto) => {
    update({
      id: me._id,
      body: {
        ...me,
        photos: me?.photos.filter((i: any) => i.url !== image.url),
      },
    })
      .unwrap()
      .then((res) => setFiles([...res.photos]))
      .catch((error) => console.log(error));
  };

  const addImage = (image: IPhoto | any) => {
    const formData = new FormData();

    formData.append("files", image.file);

    update({
      id: me._id,
      body: formData,
    })
      .unwrap()
      .then((res) => setFiles([...res.photos]))
      .catch((error) => console.log(error));
  };

  const setMainImage = (photos: IPhoto[]) => {
    update({
      id: me._id,
      body: {
        ...me,
        photos,
      },
    })
      .unwrap()
      .then((res) => setFiles([...res.photos]))
      .catch((error) => console.log(error));
  };

  return (
    <div className="flex w-full flex-col px-3 sm:px-9 pt-[84px] gap-[30px]">
      <div className="flex w-full items-center justify-between flex-col sm:flex-row gap-9 sm:gap-3">
        <h1 className="hidden sm:block font-semibold text-[36px]">
          Редактирование профиля
        </h1>
        <h1 className="block sm:hidden font-semibold text-[24px]">
          Редактирование
        </h1>

        <Button
          className="z-0 relative"
          color="secondary"
          radius="full"
          startContent={<PiWaveform className="w-5 h-5" />}
          variant="solid"
        >
          {me?.voice ? "Прослушать голос" : "Записать голос"}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-5 w-full mt-3 sm:mt-0">
        <Input
          className="z-0 relative"
          classNames={{ input: "font-semibold" }}
          label="Имя"
          placeholder=""
          radius="lg"
          value={user?.firstName}
          onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        />

        <Select
          className="text-primary z-0 relative"
          classNames={{ value: "font-semibold" }}
          label="Город"
          selectedKeys={[user?.city]}
          onChange={(el) => setUser({ ...user, city: el.target.value })}
        >
          {cities.map((city: any) => (
            <SelectItem key={city.value}>{city.label}</SelectItem>
          ))}
        </Select>

        <Select
          className="text-primary z-0 relative"
          classNames={{ value: "font-semibold" }}
          label="Возраст (лет)"
          selectedKeys={[user?.age]}
          onChange={(el: any) => setUser({ ...user, age: el.target.value })}
        >
          {ages.map((age: any) => (
            <SelectItem key={age.value}>{age.label}</SelectItem>
          ))}
        </Select>

        <Select
          className="text-primary z-0 relative"
          classNames={{ value: "font-semibold" }}
          label="Рост (см)"
          selectedKeys={[user?.height]}
          onChange={(el: any) => setUser({ ...user, height: el.target.value })}
        >
          {heights.map((height: any) => (
            <SelectItem key={height.value}>{height.label}</SelectItem>
          ))}
        </Select>

        <Select
          className="text-primary z-0 relative"
          classNames={{ value: "font-semibold" }}
          label="Вес (кг)"
          selectedKeys={[user?.weight]}
          onChange={(el: any) => setUser({ ...user, weight: el.target.value })}
        >
          {weights.map((weight: any) => (
            <SelectItem key={weight.value}>{weight.label}</SelectItem>
          ))}
        </Select>
      </div>

      <h2 className="font-semibold text-[24px] mt-5">Фото профиля</h2>

      <UploadImages
        isEdit
        data={files}
        onAdd={addImage}
        onChange={(value) => (!me ? setFiles(value) : null)}
        onRemove={removeImage}
        onSetMain={setMainImage}
      />

      <h2 className="font-semibold text-[24px] mt-5">Цели знакомства</h2>

      <div className="flex flex-wrap gap-[50px] w-full">
        <Checkbox
          defaultSelected
          className="-mt-5 z-0 relative"
          classNames={{
            wrapper: "bg-white dark:bg-foreground-300",
          }}
          icon={<HeartIcon />}
          isSelected={!!user?.sponsor}
          onChange={(e) => setUser({ ...user, sponsor: !!e.target.checked })}
        >
          {user?.sex === "male" ? "я спонсор" : "ищу спонсора"}
        </Checkbox>
        <Checkbox
          defaultSelected
          className="-mt-5 z-0 relative"
          classNames={{
            wrapper: "bg-white dark:bg-foreground-300",
          }}
          icon={<HeartIcon />}
          isSelected={!!user?.traveling}
          onChange={(e) => setUser({ ...user, traveling: !!e.target.checked })}
        >
          совместные путешествия
        </Checkbox>
        <Checkbox
          defaultSelected
          className="-mt-5 z-0 relative"
          classNames={{
            wrapper: "bg-white dark:bg-foreground-300",
          }}
          icon={<HeartIcon />}
          isSelected={!!user?.relationships}
          onChange={(e) =>
            setUser({ ...user, relationships: !!e.target.checked })
          }
        >
          постоянные отношения
        </Checkbox>
        <Checkbox
          defaultSelected
          className="-mt-5 z-0 relative"
          classNames={{
            wrapper: "bg-white dark:bg-foreground-300",
          }}
          icon={<HeartIcon />}
          isSelected={!!user?.evening}
          onChange={(e) => setUser({ ...user, evening: !!e.target.checked })}
        >
          провести вечер
        </Checkbox>
      </div>

      <h2 className="font-semibold text-[24px] mt-5">О себе</h2>

      <Textarea
        className="w-full z-0 relative"
        classNames={{ input: "p-3" }}
        label=""
        placeholder="Пользователь предпочёл не указывать информацию о себе "
        radius="lg"
        value={user?.about}
        onChange={(e) => setUser({ ...user, about: e.target.value })}
      />

      <div className="flex justify-end w-full">
        <Button
          className="z-0 relative"
          color="primary"
          radius="full"
          variant="solid"
          onPress={save}
        >
          Сохранить
        </Button>
      </div>
    </div>
  );
}
