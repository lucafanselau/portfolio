import dynamic from "next/dynamic";

const SceneComponent = dynamic(
  () => import("@3d/scene").then((mod) => mod.Scene),
  {
    ssr: true,
  }
);

export default function Home() {
  return (
    <main className={"flex-1 flex flex-col"}>
      <div className={"absolute left-0 top-0 w-full h-[100vh]"}>
        <SceneComponent />
      </div>
    </main>
  );
}
