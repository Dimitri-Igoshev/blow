import { cn } from "@heroui/theme";
import { FunctionComponent } from "react";

interface LoaderProps {
  modal?: boolean;
  save?: boolean;
}

const Loader: FunctionComponent<LoaderProps> = ({
  modal = false,
  save = false,
}) => {
  return (
    <div
      className={cn("flex justify-center items-center relative z-50", {
        ["w-screen h-screen"]: !modal,
        ["w-full h-full py-10"]: modal,
      })}
    >
      <div className="flex gap-6 items-center flex-col">
        {/* <Image
					alt="BLOW"
					height={50}
					radius="none"
					src="/logo2.png"
					width={127}
				/> */}
        {/* <div> */}
        {/* <Spinner /> */}
        <p className="text-[20px] loading">
          {save ? "Сохранение..." : "Загрузка..."}
        </p>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Loader;
