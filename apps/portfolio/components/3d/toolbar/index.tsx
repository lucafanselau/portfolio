import { Card } from "@ui/card";
import { FC } from "react";
import { ContentLoader } from "./content";
import { InfoBox, InfoBoxLoader } from "./info";
import { StateProgress } from "./progress";

export const Toolbar: FC = () => {
	return (
		<div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center">
			<div className="relative flex-1 sm:max-w-xl z-50">
				<Card className="flex items-center justify-between p-2 ">
					<InfoBoxLoader>
						<ContentLoader />
					</InfoBoxLoader>
					<StateProgress />
				</Card>
			</div>
		</div>
	);
};
