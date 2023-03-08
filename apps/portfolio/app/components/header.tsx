import {
  IconUser,
  IconEggCracked,
  IconSocial,
  IconAppWindowFilled,
} from "@tabler/icons-react";
import { Separator } from "@ui/seperator";
import Link from "next/link";
import { DarkToggle } from "./dark-toggle";

export const Header = () => {
  return (
    <div className={"flex justify-between py-4 items-center z-10"}>
      <div className={"flex space-x-2 items-center"}>
        <Link href={"/"}>
          <IconAppWindowFilled size={24} />
        </Link>
        <p>guythat.codes</p>
      </div>
      <div className={"flex space-x-2 items-center h-6"}>
        <Link href={"/about"}>
          <IconUser size={24} />
        </Link>
        <Link href={"/social"}>
          <IconSocial size={24} />
        </Link>
        <Link href={"/easter"}>
          <IconEggCracked size={24} />
        </Link>
        <Separator orientation="vertical" />
        <DarkToggle />
      </div>
    </div>
  );
};
