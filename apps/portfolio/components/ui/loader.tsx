import { IconLoader3 } from "@tabler/icons-react";

export const LoadingAnimation = () => {
  return (
    <div className={"flex h-full w-full items-center justify-center"}>
      <LoadingSpinner />
    </div>
  );
};

export const LoadingSpinner = ({ small = false }: { small?: boolean }) => {
  return <IconLoader3 className={"animate-spin"} size={small ? 24 : 48} />;
};
