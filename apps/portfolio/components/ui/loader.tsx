import { IconLoader3 } from "@tabler/icons-react";
import { ReactNode } from "react";

export const LoadingAnimation = ({ children }: { children?: ReactNode }) => {
  return (
    <div className={"flex h-full w-full items-center justify-center"}>
      <LoadingSpinner />
      {children}
    </div>
  );
};

export const LoadingSpinner = ({ small = false }: { small?: boolean }) => {
  return <IconLoader3 className={"animate-spin"} size={small ? 24 : 48} />;
};
