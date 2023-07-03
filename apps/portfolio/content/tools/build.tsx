import { CreatePanel } from "@3d/tools/build/create";
import { DestroyPanel } from "@3d/tools/build/destroy";
import { IconBulldozer, IconCrane, IconInfoSmall } from "@tabler/icons-react";
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

const destroy = {
	header: [
		<>
			Remove <span className={"text-animation"}>Structures</span>.
		</>,
		"Click on a structure and it will be removed from the map.",
	],
	body: <DestroyPanel />,
	icon: <IconBulldozer />,
} satisfies ToolsContent;

export const build = {
	info,
	create,
	destroy,
};
