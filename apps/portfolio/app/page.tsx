import { Scene } from "./scene";

export default function Home() {
  return (
    <main className={"flex-1 flex flex-col"}>
      <h1>Hello World</h1>
      <p>This is content</p>
      <div className={"flex-1 basis-0"}>
        <Scene />
      </div>
    </main>
  );
}
