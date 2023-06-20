import { config } from "./config";
import { link } from "./utils";

export const projects = [
  {
    title: "Own A World",
    subtitle:
      "Experimenting with value creation through composition of NFTs in a Sims like experience",
    links: link("https://owna.world"),
    description: "",
    timeframe: [new Date(2020), new Date(2021)],
  },
  {
    title: "Portfolio",
    subtitle: "",
    links: [link(config.website), link(config.github + "/portfolio", "github")],
    description: "",
    timeframe: new Date(2023),
  },
  {
    title: "Jongleur",
    subtitle: "Animation primitives for react-three-fiber",
    links: link(config.github + "/jongleur"),
    description: "",
    timeframe: new Date(2022),
  },
];

type Unwrap<T> = T extends Array<infer U> ? U : unknown;
export type Project = Unwrap<typeof projects>;
