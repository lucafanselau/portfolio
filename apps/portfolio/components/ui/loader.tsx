import { IconLoader3 } from "@tabler/icons-react";

export const LoadingAnimation = () => {
  return (
    <div className={"w-full h-full flex justify-center items-center"}>
      <IconLoader3 className={"animate-spin"} size={48} />
    </div>
  );
};
