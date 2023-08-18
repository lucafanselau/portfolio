import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconMail,
} from "@tabler/icons-react";
import { ComponentType } from "react";

const social = (url: string, icon: ComponentType) => ({ url, icon });

export const config = {
  github: "https://github.com/lucafanselau",
  website: "https://guythat.codes",
  mail: "luca.fanselau@outlook.com",
  projectGithub: "https://github.com/lucafanselau/portfolio",

  socials: [
    social("https://github.com/lucafanselau", IconBrandGithub),
    social("https://twitter.com/luca_fanselau", IconBrandTwitter),
    social(
      "https://www.linkedin.com/in/luca-fanselau-0b0b3a1b2/",
      IconBrandLinkedin
    ),
    social("mailto:luca.fanselau@outlook.com", IconMail),
  ],
};
