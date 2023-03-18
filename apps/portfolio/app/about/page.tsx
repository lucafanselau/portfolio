import { Portfolio } from "./portfolio";
import { School } from "./school";
import { Work } from "./work";

export default function Home() {
  return (
    <main className={"flex-1 flex flex-col"}>
      <School />
      <Work />
      <Portfolio />
    </main>
  );
}
