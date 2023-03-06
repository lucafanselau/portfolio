import {
  IconUser,
  IconEggCracked,
  IconSocial,
  IconAppWindowFilled,
} from "@tabler/icons-react";
import Link from "next/link";

export const Header = () => {
  return (
    <div className={"flex justify-between py-4 items-center"}>
      <div className={"flex space-x-2 items-center"}>
        <Link href={"/"}>
          <IconAppWindowFilled size={24} />
        </Link>
        <p>guythat.codes</p>
      </div>
      <div className={"flex space-x-2 items-center"}>
        <Link href={"/about"}>
          <IconUser size={24} />
        </Link>
        <Link href={"/social"}>
          <IconSocial size={24} />
        </Link>
        <Link href={"/easter"}>
          <IconEggCracked size={24} />
        </Link>
      </div>
    </div>
  );
};
