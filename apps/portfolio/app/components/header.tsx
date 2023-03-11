import {
  IconUser,
  IconEggCracked,
  IconSocial,
  IconAppWindowFilled,
} from "@tabler/icons-react";
import { Separator } from "@ui/seperator";
import Link from "next/link";
import { DarkToggle } from "./dark-toggle";
import { H4 } from "@ui/typography";

export const Header = () => {
  return (
    <div
      className={
        "flex justify-between py-4 items-center z-10 px-4 rounded- bg-white dark:bg-zinc-800"
      }
    >
      <Link href={"/"}>
        <div className={"flex space-x-2 items-center"}>
          <IconAppWindowFilled size={24} />
          <H4>guythat.codes</H4>
        </div>
      </Link>
      <div className={"flex space-x-2 items-center h-6"}>
        <Link href={"/about"}>
          <IconUser size={24} />
        </Link>
        <Link href={"/about"}>
          <IconSocial size={24} />
        </Link>
        <Link href={"/about"}>
          <IconEggCracked size={24} />
        </Link>
        <Separator orientation="vertical" />
        <DarkToggle />
      </div>
    </div>
  );
};
