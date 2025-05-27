"use client";

import {
  Button,
  Textarea,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FC } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
  text: string;
};

interface NoteModalProps {
  isOpen: boolean;
  onSave: (text: string) => void;
  onOpenChange: () => void;
  note?: string;
}

export const NoteModal: FC<NoteModalProps> = ({
  isOpen,
  onSave,
  onOpenChange,
  note = "",
}) => {
  const { register, handleSubmit, setValue } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    onSave(data.text);
    onOpenChange();
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
              Заметка
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-5">
                <Textarea
                  classNames={{
                    input: "bg-transparent dark:text-white",
                    inputWrapper: "dark:bg-foreground-200",
                  }}
                  defaultValue={note}
                  placeholder="Текст заметки"
                  radius="lg"
                  type="text"
                  {...register("text")}
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
                  Сохранить
                </Button>
              </div>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};
