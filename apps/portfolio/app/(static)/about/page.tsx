import { Projects } from "@components/about/projects";
import { School } from "@components/about/school";
import { Work } from "@components/about/work";
import { H1, H2, P } from "@ui/typography";

export default function Home() {
  return (
    <main className={"flex flex-1 flex-col space-y-4 pt-8"}>
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
      <H2>Career</H2>
      <Work />
      <H2>Academic background</H2>
      <School />
    </main>
  );
}
