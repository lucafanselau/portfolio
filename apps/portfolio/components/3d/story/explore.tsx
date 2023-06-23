import { transitionToCamera } from "@3d/camera";
import { useStore } from "@3d/store";
import { School } from "@components/about/school";
import { Work } from "@components/about/work";
import {
	Icon,
	IconArrowsMaximize,
	IconMouse,
	IconPointer,
} from "@tabler/icons-react";
import { Button } from "@ui/button";
import { H1, P } from "@ui/typography";
import { FC } from "react";

const Instruction: FC<{ Icon: Icon; text: string }> = ({ Icon, text }) => (
	<div className="flex flex-col items-center flex-1 space-y-2">
		<Icon />
		<P align={"center"}>{text}</P>
	</div>
);

const prevent = (e: React.MouseEvent) => {
	e.stopPropagation();
	e.preventDefault();
};

export const preventProps = {
	onPointerDown: prevent,
};

const TopLevelButton = () => {
	const onClick = async () => {
		const { setState } = useStore.getState();
		await transitionToCamera("top-level", "origin");
		setState("top-level");
	};

	const history = useStore((s) => s.world.interactionHistory);
	const total = Object.keys(history).length;
	const numOfChecked = Object.values(history)
		.map(Number)
		.reduce((a, b) => a + b);

	return (
		<>
			<P color="lighter" size="xs" className="text-right max-w-[36ch]">
				{numOfChecked === total ? (
					<>
						Great you have finished the quest. Now let's expand the city a bit!
					</>
				) : (
					<>
						You are still <b>missing {total - numOfChecked} locations</b>. You
						should visit those before we get to the fun part!
					</>
				)}
			</P>
			<Button
				{...preventProps}
				onClick={onClick}
				className={"px-8 pointer-events-auto"}
				disabled={total !== numOfChecked}
			>
				Next
			</Button>
		</>
	);
};

export const ExploreBubbleContent = {
	header: (
		<>
			<H1>
				Let's <span className={"text-animation"}>Explore</span> a bit
			</H1>
			<P color={"lighter"}>
				This world is filled with locations, that are important to me.
			</P>
		</>
	),
	content: (
		<>
			<div className={"mb-4 flex space-x-2"}>
				<Instruction Icon={IconPointer} text={"Click to move character"} />
				<Instruction Icon={IconMouse} text={"Click and drag to pan around"} />
				<Instruction
					Icon={IconArrowsMaximize}
					text={"Scroll / Pan to zoom in or out"}
				/>
			</div>
			<P color={"lighter"} size={"sm"}>
				You can visit the locations in the town, by walking up to their
				entrance. Pssst, once you explored all the locations, the journey is not
				over...
			</P>
		</>
	),
	action: <TopLevelButton />,
};
export const ExploreSchool = {
	header: (
		<>
			<H1>
				Welcome to the <span className={"text-animation"}>School</span>
			</H1>
			<P color={"lighter"}>
				This is where I spent most of my time during my childhood.
			</P>
		</>
	),
	content: (
		<>
			<P>Here is a quick overview of my academic accomplishments:</P>
			<School />
		</>
	),
	action: (
		<Button {...preventProps} className={"px-8 pointer-events-auto"}>
			Learn More
		</Button>
	),
};
export const ExploreHome = {
	header: (
		<>
			<H1>
				Nice of you to visit me at{" "}
				<span className={"text-animation"}>Home</span>
			</H1>
			<P color={"lighter"}>
				This is where I spent most of my time during my childhood.
			</P>
		</>
	),
	content: (
		<P>
			You reached the school of this little town. The school is where it all
			started. Here is a brief overview of my acadamical career: - German
			Abitur: Liebfrauenschule Köln - Bachelor of Science: Businessinformatics
			at University of Cologne - Master of Science: Businessinformatics at
			University of Cologne
		</P>
	),
	action: (
		<Button {...preventProps} className={"px-8 pointer-events-auto"}>
			Learn More
		</Button>
	),
};
export const ExploreOffice = {
	header: (
		<>
			<H1>
				The very modern <span className={"text-animation"}>Office</span> of this
				town
			</H1>
			<P color={"lighter"}>
				This place represents all of the professional steps I took in my life.
			</P>
		</>
	),
	content: (
		<>
			<Work />
		</>
	),
	action: (
		<Button {...preventProps} className={"px-8 pointer-events-auto"}>
			Learn More
		</Button>
	),
};
