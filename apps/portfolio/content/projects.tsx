import { config } from "./config";
import { link } from "./utils";

export const projects = [
  {
    title: "Own A World",
    subtitle:
      "Experimenting with value creation through composition of NFTs in a Sims like experience",
    links: link("https://owna-monorepo.vercel.app/"),
    description: "",
    timeframe: [new Date(2020), new Date(2021)],
  },
  {
    title: "Portfolio",
    subtitle: "Ok, let's overengineer a portfolio website. Sounds fun!",
    links: [link(config.website), link(config.github + "/portfolio", "github")],
    description:
      "The page you are currently visiting. It is all opensource and you can find the code on github. Psst. Secret tip, have you checked out the 404 page?",
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
