import { Button } from "@ui/button";
import { P } from "@ui/typography";
import { FC } from "react";
import { BuildingType } from "../types";
import Image from "next/image";
import StreetThumbnail from "@public/street-thumbnail.png";
import { IconHammer } from "@tabler/icons-react";
import { useToolsStore } from "./store";

const BuildingCard: FC<{
  title: string;
  mode: "street" | "building" | "props";
}> = ({ title, mode }) => {
  const onClick = () => {
    useToolsStore.getState().startBuild(mode);
  };
  return (
    <div
      className={
        "flex flex-col relative justify-between border-zinc-600 border rounded-xl overflow-hidden"
      }
    >
      <Image
        src={StreetThumbnail}
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
      <button
        onClick={onClick}
        className={
          "h-[40px] border-t border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700"
        }
      >
        <IconHammer className={"inline mr-2"} />
        Build
      </button>
    </div>
  );
};

export const Build = () => {
  return (
    <div className={"flex items-stretch space-x-2"}>
      <BuildingCard title={"Street"} mode={"street"} />
    </div>
  );
};
