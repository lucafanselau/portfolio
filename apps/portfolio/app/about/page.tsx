import { Projects } from "@components/about/projects";
import { School } from "@components/about/school";
import { Work } from "@components/about/work";
import { H1, P } from "@ui/typography";

export default function Home() {
  return (
    <main className={"flex-1 flex flex-col pt-8 space-y-4"}>
      <H1>
        Hi <span className="text-animation">There</span>, glad you found your
        way here!
      </H1>
      <P>
        This is the non-interactive version of my portfolio. I highly encourage
        you to check out the interactive version at{" "}
        <a className="link" href="/">
          the landingpage
        </a>{" "}
        for a better experience.
      </P>
      <Projects />
      <Work />
      <School />
    </main>
  );
}
