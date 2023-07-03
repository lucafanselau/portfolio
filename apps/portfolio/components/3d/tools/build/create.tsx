import { Button } from "@ui/button";
import { P } from "@ui/typography";
import { FC } from "react";
import Image from "next/image";
import { IconHammer } from "@tabler/icons-react";

const CreateCard: FC<{
  title: string;
  mode: "street" | "building" | "props";
}> = ({ title, mode }) => {
  const onClick = () => {
    // TODO: useToolsStore.getState().startBuild(mode);
  };
  return (
    <button
      onClick={onClick}
      className={
        "flex flex-col relative justify-between border-zinc-600 border rounded-xl overflow-hidden group active:scale-95"
      }
    >
      <Image
        src={`/generated/street-end-preview.png`}
        alt={"Street Thumbnail"}
        width={156}
        height={156 - 40}
        className={"object-cover h-[116px]"}
      />
      <P
        className={
          "absolute right-2 top-2 px-4 dark:bg-blue-500 bg-blue-300 rounded-full"
        }
      >
        {title}
      </P>
      <div
        className={
          "h-[40px] border-t border-zinc-600 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 flex justify-center items-center w-full"
        }
      >
        <IconHammer className={"inline mr-2"} />
        Build
      </div>
    </button>
  );
};

const cards = [
  {
    title: "Street",
    mode: "street",
  },
  {
    title: "Building",
    mode: "building",
  },
  {
    title: "Props",
    mode: "props",
  },
] as const;

export const CreatePanel = () => {
  return (
    <div className={"flex flex-col gap-4"}>
      {cards.map((card) => (
        <div
          className="flex-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
          key={card.mode}
        >
          <CreateCard title={card.title} mode={card.mode} />
        </div>
      ))}
    </div>
  );
};
