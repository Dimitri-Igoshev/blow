"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FC, useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

import { useLoginMutation } from "@/redux/services/authApi";

type Inputs = {
  email: string;
  password: string;
};

interface LoginModalProps {
  isOpen: boolean;
  onRegister: () => void;
  onOpenChange: () => void;
  showError: (error: string) => void;
}

export const LoginModal: FC<LoginModalProps> = ({
  isOpen,
  onRegister,
  onOpenChange,
  showError,
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<Inputs>();

  const [isLoading, setIsLoading] = useState(false);

  const [login] = useLoginMutation();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);

    const body: any = {
      email: data.email,
      password: data.password,
    };

    login(body)
      .unwrap()
      .then((res: any) => {
        localStorage.setItem("access-token", res.accessToken);
        window.location.reload();
        onOpenChange();
      })
      .catch(() => {
        showError("Неверный логин или пароль");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal
      backdrop="blur"
      className="bg-gray dark:bg-foreground-100 border-[3px] border-white dark:border-white/50 rounded-[36px] py-1 transition-all"
      classNames={{
        closeButton: "m-3.5",
      }}
      isOpen={isOpen}
      placement="center"
      size="sm"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="flex flex-col gap-1 text-[20px]">
              Вход
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-5">
                <Input
                  classNames={{
                    input: "bg-transparent dark:text-white",
                    inputWrapper: "dark:bg-foreground-200",
                  }}
                  placeholder="E-mail"
                  radius="full"
                  startContent={<MdEmail />}
                  type="email"
                  {...register("email", {
                    required: { value: true, message: "Обязательное поле" },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Невалидный emaill",
                    },
                  })}
                />
                <Input
                  classNames={{
                    input: "bg-transparent dark:text-white",
                    inputWrapper: "dark:bg-foreground-200",
                  }}
                  placeholder="Пароль"
                  radius="full"
                  startContent={<FaLock size={14} />}
                  type="password"
                  {...register("password", {
                    required: { value: true, message: "Обязательное поле" },
                    minLength: { value: 6, message: "Не менее 6 символов" },
                  })}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-col w-full">
                <Button
                  className="w-full"
                  color="primary"
                  radius="full"
                  type="submit"
                >
                  Войти
                </Button>

                <div className="flex items-center justify-between w-full gap-4 text-xs mt-2 -mb-3">
                  <Button
                    className="cursor-pointer hover:text-primary bg-transparent text-xs"
                    radius="full"
                    variant="flat"
                  >
                    Забыли пароль?
                  </Button>
                  <Button
                    className="cursor-pointer hover:text-primary bg-transparent text-xs"
                    radius="full"
                    variant="flat"
                    onPress={() => {
                      onRegister();
                      onClose();
                    }}
                  >
                    Зарегистрироваться?
                  </Button>
                </div>
              </div>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
