import { GeneratedKeys } from "@3d/generated-loader";
import collection from "@3d/generated/collection.json";
import { isNone } from "@components/utils";
import { P } from "@ui/typography";
import { cn } from "@ui/utils";
import Image from "next/image";
import { forwardRef } from "react";

export const ToolsItemCard = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & {
    entry: (typeof collection)[GeneratedKeys][number];
  }
>(({ entry, ...props }, ref) => {
  if (isNone(entry)) return null;

  const name = "name" in entry ? (entry.name as string) : entry.id;
  const extend =
    "extend" in entry && Array.isArray(entry.extend) ? entry.extend : undefined;

  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "flex flex-col items-center relative justify-between border rounded-xl overflow-hidden group active:scale-95",
        props.className
      )}
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
});
