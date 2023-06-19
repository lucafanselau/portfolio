"use client";

import { Card } from "@ui/card";
import { Kbd } from "@ui/kbd";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/tabs";
import { H2, H3, P } from "@ui/typography";
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
				<Card className="flex flex-col space-y-4 text-justify">
					<div>
						<H3>Keybindings</H3>
						<P className={"text-sm"}>
							The game is a small voxel builder, obviously inspired by
							Minecraft. You can freely move around and build any type of block
							available in the Inventory. The following keys and mouse actions
							are registered by the game:
						</P>
					</div>

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
					<P className={"text-sm"}>
						In case you are really bored and actually start building something
						in the world, please take a screenshot and send it to me{" "}
						<a
							href={"mailto:" + MAIL}
							className="text-secondary-foreground underline"
						>
							here
						</a>
						!
					</P>
				</Card>
			</TabsContent>
			<TabsContent value="what">
				<Card>
					<H2>The Stack</H2>
					<P>This game</P>
				</Card>
			</TabsContent>
		</Tabs>
	);
};
