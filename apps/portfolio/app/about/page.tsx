import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { P } from "@ui/typography";
import { School } from "./school";

export default function Home() {
  return (
    <main className={"flex-1 flex flex-col"}>
      <School />
    </main>
  );
}
