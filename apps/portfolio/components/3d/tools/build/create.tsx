import collection from "@3d/generated/collection.json";
import { Button } from "@ui/button";
import { H2, P } from "@ui/typography";
import { FC, useMemo } from "react";
import Image from "next/image";
import { IconHammer } from "@tabler/icons-react";
import { GeneratedKeys } from "@3d/generated-loader";
import { isNone } from "@components/utils";

const CreateCard: FC<{
  id: string;
  type: GeneratedKeys;
}> = ({ id, type }) => {
  const onClick = () => {
    // TODO: useToolsStore.getState().startBuild(mode);
  };

  const entry = useMemo(() => collection[type].find((e) => e.id === id), [id]);

  if (isNone(entry)) return null;

  const name = "name" in entry ? entry.name : entry.id;
  const extend =
    "extend" in entry && Array.isArray(entry.extend) ? entry.extend : undefined;

  return (
    <button
      onClick={onClick}
      className={
        "flex flex-col relative justify-between border-zinc-600 border rounded-xl overflow-hidden group active:scale-95"
      }
    >
      <Image
        src={"/" + entry.img}
        alt={`${name} Preview`}
        width={156}
        height={156 - 40}
        className={"object-cover h-[116px]"}
      />
      <P
        className={
          "absolute right-2 top-2 px-4 dark:bg-blue-500 bg-blue-300 rounded-full"
        }
      >
        {extend?.[0]} x {extend?.[1]}
      </P>
      <div
        className={
          "h-[40px] border-t border-zinc-600 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-700 flex justify-center items-center w-full"
        }
      >
        <IconHammer className={"inline mr-2"} />
        {name}
      </div>
    </button>
  );
};

const keys = Object.keys(collection) as GeneratedKeys[];

export const CreatePanel = () => {
  return (
    <div className={"flex flex-col gap-4 w-full"}>
      {keys.map((key) => (
        <>
          <H2>{key}</H2>
          <div className="flex items-stretch w-full flex-wrap">
            {collection[key].map((card) => (
              <div
                className="flex-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                key={card.id}
              >
                <CreateCard id={card.id} type={key} />
              </div>
            ))}
          </div>
        </>
      ))}
    </div>
  );
};
