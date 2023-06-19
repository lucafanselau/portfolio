"use client";

import { Card } from "@ui/card";
import { Kbd } from "@ui/kbd";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/tabs";
import { P } from "@ui/typography";
import { ComponentProps, useState } from "react";

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
        <Card className="flex flex-col space-y-4">
          <P>
            The game is a small voxel builder, obviously inspired by minecraft.
            You can freely move around and build any type of block available in
            the Inventory. The following keys and mouse actions are registered
            by the game:
          </P>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(instructions).map(([key, value]) => (
              <div key={key} className={"flex "}>
                <div className="basis-20 block leading-[0]">
                  <Kbd>{key}</Kbd>
                </div>
                <div className="text-sm">{value}</div>
              </div>
            ))}
          </div>
        </Card>
      </TabsContent>
      <TabsContent value="what">Demo content</TabsContent>
    </Tabs>
  );
};
