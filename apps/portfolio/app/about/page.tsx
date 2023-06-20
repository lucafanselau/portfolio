import { Projects } from "@components/about/projects";
import { School } from "@components/about/school";
import { Work } from "@components/about/work";

export default function Home() {
  return (
    <main className={"flex-1 flex flex-col"}>
      <School />
      <Work />
      <Projects />
    </main>
  );
}
