import { CreatePanel } from "@3d/tools/build/create";
import { IconCrane, IconInfoSmall } from "@tabler/icons-react";
import { ToolsContent } from "./types";

export const info = {
	header: [
		<>
			Wow you are still here. Let's{" "}
			<span className={"text-animation"}>build</span> something together.
		</>,
		"I love city builder games, so here is one I made.",
	],
	body: <>NOTHING HERE YET</>,
	icon: <IconInfoSmall />,
} satisfies ToolsContent;

const create = {
	header: [
		<>
			Build new <span className={"text-animation"}>Structures</span>.
		</>,
		"Just click on a card and the build mode will open. Then the camera will be locked and you can freely place the structure on the map.",
	],
	body: <CreatePanel />,
	icon: <IconCrane />,
} satisfies ToolsContent;

export const build = {
	info,
	create,
};
