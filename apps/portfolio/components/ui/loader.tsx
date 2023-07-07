import { IconLoader3 } from "@tabler/icons-react";

export const LoadingAnimation = () => {
  return (
    <div className={"flex h-full w-full items-center justify-center"}>
      <IconLoader3 className={"animate-spin"} size={48} />
    </div>
  );
};
