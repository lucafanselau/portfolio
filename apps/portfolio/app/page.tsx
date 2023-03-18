import { SceneLoader } from "./scene-loader";

export default function Home() {
  return (
    <main className={"flex-1 flex flex-col"}>
      <div className={"absolute left-0 top-0 w-full h-[100vh]"}>
        <SceneLoader />
      </div>
    </main>
  );
}
