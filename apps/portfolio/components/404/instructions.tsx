"use client";

import { Card } from "@ui/card";
import { Kbd } from "@ui/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { H3, InlineCode, P } from "@ui/typography";
import { useState } from "react";

const instructions = {
  W: "Move forward",
  A: "Move left",
  S: "Move backward",
  D: "Move right",
  Q: "Previous item",
  E: "Next item",
  Shift: "Move down",
  Space: "Move up",
  LMB: "Destroy target",
  RMB: "Build selected",
  Escape: "Exit the game",
};

const MAIL = process.env.NEXT_PUBLIC_MAIL;

export const Rust404Instructions = () => {
  const [value, setValue] = useState<string | null>(null);

  const handleTab = (value: string) => {
    // only set value if its not the old one, otherwise set to null
    setValue((old) => (old === value ? null : value));
  };
  return (
    <Tabs
      className="w-full"
      value={value ?? "unknown"}
      // onValueChange={handleChange}
    >
      <TabsList className={"grid w-full grid-cols-2"}>
        <TabsTrigger
          onClick={(_) => handleTab("instructions")}
          value="instructions"
        >
          How to play?
        </TabsTrigger>
        <TabsTrigger onClick={(_) => handleTab("what")} value="what">
          What is this?
        </TabsTrigger>
      </TabsList>
      <TabsContent value="instructions">
        <Card className="flex flex-col space-y-2 text-justify">
          <H3>Compatibility</H3>
          <P className={"text-sm"}>
            In its current state the game uses the Pointer Lock API, which is
            unfortunately not supported on mobile devices. If you have come this
            far, I encourage you to try it on a desktop device.
          </P>
          <H3>Keybindings</H3>
          <P className={"text-sm"}>
            The game is a small voxel builder, obviously inspired by Minecraft.
            You can freely move around and build any type of block available in
            the Inventory. The following keys and mouse actions are registered
            by the game:
          </P>
          <div className="grid grid-cols-2 gap-2 py-2">
            {Object.entries(instructions).map(([key, value]) => (
              <div key={key} className={"flex "}>
                <div className="block basis-20 leading-[0]">
                  <Kbd>{key}</Kbd>
                </div>
                <div className="text-sm">{value}</div>
              </div>
            ))}
          </div>
          <P className={"text-sm"}>
            In case you are really bored and actually start building something
            in the world, please take a screenshot and send it to me{" "}
            <a href={"mailto:" + (MAIL ?? "")} className="link">
              here
            </a>
            !
          </P>
        </Card>
      </TabsContent>
      <TabsContent value="what">
        <Card className="flex flex-col space-y-2 text-sm">
          <H3>The Stack</H3>
          <P>
            This game is written in <span className="highlight">Rust</span> and
            loaded into this Website as a{" "}
            <span className="highlight">WASM</span> . It uses
            <span className="highlight">WebGL 2</span> for rendering (via the
            glow crate) and a small custom made renderer.
          </P>
          <H3>Features</H3>
          <P>
            This game was more of a hobby project, but it still contains a few
            small parts that could be interesting to look at:
            <ul className=" ml-6 list-disc [&>li]:mt-1">
              <li>
                Framebuffer with custom integer color attachment for querying
                the current target
              </li>
              <li>
                Chunk based world, for performant block manipulation and
                scalability
              </li>
              <li>Custom event system and Render Job System</li>
            </ul>
          </P>
          <P>
            For now this is just a brief overview, If you are interested in
            stuff like this you can checkout the code on the{" "}
            <a
              className="link"
              target="_blank"
              href="https://github.com/lucafanselau/portfolio"
            >
              GitHub
            </a>{" "}
            page and espacially the rust crate under{" "}
            <InlineCode>packages/rust404</InlineCode>.
          </P>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
