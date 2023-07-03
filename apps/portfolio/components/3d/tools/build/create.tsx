import collection from "@3d/generated/collection.json";
import { Button } from "@ui/button";
import { H2, P } from "@ui/typography";
import { FC, Fragment, useMemo } from "react";
import Image from "next/image";
import { IconHammer } from "@tabler/icons-react";
import { GeneratedKeys } from "@3d/generated-loader";
import { isNone } from "@components/utils";
import { useStore } from "@3d/store";

const CreateCard: FC<{
  id: string;
  type: GeneratedKeys;
  entry: (typeof collection)[GeneratedKeys][number];
}> = ({ id, type, entry }) => {
  const onClick = () => {
    useStore.getState().startBuild(type, id);
  };

  if (isNone(entry)) return null;

  const name = "name" in entry ? (entry.name as string) : entry.id;
  const extend =
    "extend" in entry && Array.isArray(entry.extend) ? entry.extend : undefined;

  return (
    <button
      onClick={onClick}
      className={
        "flex flex-col items-center relative justify-between border rounded-xl overflow-hidden group active:scale-95"
      }
    >
      <Image
        src={"/" + entry.img}
        alt={`${name} Preview`}
        width={156}
        height={156 - 40}
        className={"object-cover h-[116px]"}
      />
      <P className={"absolute right-2 top-2 px-4 bg-primary rounded-full"}>
        {extend?.[0]} x {extend?.[1]}
      </P>
      <div
        className={"h-[40px] border-t flex justify-center items-center w-full"}
      >
        {name}
      </div>
    </button>
  );
};

const keys = Object.keys(collection) as GeneratedKeys[];

const keyLabels = {
  buildings: "Buildings",
  props: "Props",
  streets: "Streets",
} satisfies Record<GeneratedKeys, string>;

export const CreatePanel = () => {
  return (
    <div className={"flex flex-col gap-4 w-full"}>
      {keys.map((key) => (
        <Fragment key={key}>
          <H2>{keyLabels[key]}</H2>
          <div className="grid w-full gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {(key === "streets"
              ? [{ ...collection[key][3], name: "Standard Street" }]
              : collection[key]
            ).map((entry) => (
              <CreateCard
                key={entry.id}
                id={entry.id}
                type={key}
                entry={entry}
              />
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
