import { useStore } from "@3d/store";
import {
  ExploreBubbleContent,
  ExploreHome,
  ExploreOffice,
  ExploreSchool,
} from "@3d/story/explore";
import { match } from "ts-pattern";

export const ContentLoader = () => {
  const interaction = useStore((s) => s.world.interaction);

  const content = match(interaction)
    .with("school", () => ExploreSchool)
    .with("home", () => ExploreHome)
    .with("office", () => ExploreOffice)
    .with(undefined, () => ExploreBubbleContent)
    .exhaustive();

  return (
    <div className="flex flex-col justify-start space-y-2">
      <div>{content.header}</div>
      {content.content}
    </div>
  );
};
