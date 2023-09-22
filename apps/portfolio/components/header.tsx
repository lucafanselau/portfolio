import {
  IconAppWindowFilled,
  IconArticle,
  IconEggCracked,
  IconTilde,
  IconUser,
} from "@tabler/icons-react";
import { Separator } from "@ui/seperator";
import { H4 } from "@ui/typography";
import Link from "next/link";

import { LoadingSpinner } from "@ui/loader";
import dynamic from "next/dynamic";

const DarkToggle = dynamic(() => import("./dark-toggle"), {
  ssr: false,
  loading: () => <LoadingSpinner small />,
});

export const Header = () => {
  return (
    <div
      className={
        "card card-padding z-10 flex items-center justify-between rounded-lg shadow-md"
      }
    >
      <Link href={"/"}>
        <div className={"flex items-center space-x-2"}>
          <IconAppWindowFilled size={24} />
          <H4>guythat.codes</H4>
        </div>
      </Link>
      <div className={"flex h-6 items-center space-x-2"}>
        {/* <Link href={"/about"}>
            <IconUser size={24} />
            </Link>
            <Link href={"/about"}>
            <IconSocial size={24} />
            </Link> */}
        <Link href={"/about"}>
          <IconUser size={24} />
        </Link>
        <Link href={"/blog"}>
          <IconArticle size={24} />
        </Link>
        <Link href={"/no-home"}>
          <IconEggCracked size={24} />
        </Link>
        <Separator orientation="vertical" />
        <DarkToggle />
      </div>
    </div>
  );
};
