"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { FC } from "react";

interface TopUpProps {
  isOpen: boolean;
  onOpenChange: () => void;
  amount: number;
  onAction?: () => void;
}

export const TopUpModal: FC<TopUpProps> = ({
  isOpen,
  onOpenChange,
  amount,
  onAction
}) => {
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
        
          <>
            <ModalHeader className="flex flex-col gap-1 text-[20px]">
              Карта пополнения BLOW
            </ModalHeader>
            <ModalBody>
              <div>Вы можете пополнить свой счет на сумму {amount} ₽</div>
            </ModalBody>
            <ModalFooter>
              <div className="flex flex-raw w-full gap-3">
                {onAction ? (
                  <Button
                    className="w-full"
                    color="primary"
                    radius="full"
                    onPress={onAction}
                  >
                    Пополнить
                  </Button>
                ) : null}
              </div>
            </ModalFooter>
          </>
      </ModalContent>
    </Modal>
  );
};
