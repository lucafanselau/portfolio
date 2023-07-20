import type { AssetEntry } from "@3d/generated-loader";
import { isNone, toArray } from "@components/utils";
import { P } from "@ui/typography";
import { cn } from "@ui/utils";
import Image from "next/image";
import { forwardRef } from "react";

export const ToolsItemCard = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & {
    entry: AssetEntry;
  }
>(({ entry, ...props }, ref) => {
  if (isNone(entry)) return null;

  const name = entry.name;
  const extend = "extend" in entry ? entry.extend : undefined;

  const img = toArray(entry.output)[0].img;

  return (
    <button
      ref={ref}
      {...props}
      className={cn(
        "group relative flex flex-col items-center justify-between overflow-hidden rounded-xl border active:scale-95",
        props.className
      )}
    >
      <Image
        src={"/" + img}
        alt={`${name} Preview`}
        width={156}
        height={156 - 40}
        className={"h-[116px] object-cover"}
      />
      <P className={"absolute right-2 top-2 rounded-full bg-primary px-4"}>
        {extend?.[0]} x {extend?.[1]}
      </P>
      <div
        className={"flex h-[40px] w-full items-center justify-center border-t"}
      >
        {name}
      </div>
    </button>
  );
});
