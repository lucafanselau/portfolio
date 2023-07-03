
import { FC, ReactNode } from "react";
import { Instances as Istreetend } from "./streets/street-end";
import { Instances as Istreetfour } from "./streets/street-four";
import { Instances as Istreetstraight } from "./streets/street-straight";
import { Instances as Istreetthree } from "./streets/street-three";
import { Instances as Istreetturn } from "./streets/street-turn";
import { Instances as Ihotel } from "./buildings/hotel";
import { Instances as Ihouse1 } from "./buildings/house1";
import { Instances as Ihouse2 } from "./buildings/house2";
import { Instances as Ihouse3 } from "./buildings/house3";
import { Instances as Ihouse4 } from "./buildings/house4";
import { Instances as Ihouse5 } from "./buildings/house5";
import { Instances as Ihouse6 } from "./buildings/house6";
import { Instances as Ihouse7 } from "./buildings/house7";
import { Instances as Ioffice1 } from "./buildings/office1";
import { Instances as Ioffice2 } from "./buildings/office2";
import { Instances as Ioffice3 } from "./buildings/office3";
import { Instances as Ipark1 } from "./buildings/park1";
import { Instances as Ipark2 } from "./buildings/park2";
import { Instances as Ipark3 } from "./buildings/park3";
import { Instances as Ipark4 } from "./buildings/park4";
import { Instances as Ischool } from "./buildings/school";
import { Instances as Itree1 } from "./props/tree1";
import { Instances as Itree2 } from "./props/tree2";
import { Instances as Itree3 } from "./props/tree3";
import { Instances as Itree4 } from "./props/tree4";

export const Instances: FC<{ children: ReactNode }> = ({ children }) => {
	return (
      <Istreetend receiveShadow castShadow>
<Istreetfour receiveShadow castShadow>
<Istreetstraight receiveShadow castShadow>
<Istreetthree receiveShadow castShadow>
<Istreetturn receiveShadow castShadow>
<Ihotel receiveShadow castShadow>
<Ihouse1 receiveShadow castShadow>
<Ihouse2 receiveShadow castShadow>
<Ihouse3 receiveShadow castShadow>
<Ihouse4 receiveShadow castShadow>
<Ihouse5 receiveShadow castShadow>
<Ihouse6 receiveShadow castShadow>
<Ihouse7 receiveShadow castShadow>
<Ioffice1 receiveShadow castShadow>
<Ioffice2 receiveShadow castShadow>
<Ioffice3 receiveShadow castShadow>
<Ipark1 receiveShadow castShadow>
<Ipark2 receiveShadow castShadow>
<Ipark3 receiveShadow castShadow>
<Ipark4 receiveShadow castShadow>
<Ischool receiveShadow castShadow>
<Itree1 receiveShadow castShadow>
<Itree2 receiveShadow castShadow>
<Itree3 receiveShadow castShadow>
<Itree4 receiveShadow castShadow>
			{children}
			</Itree4>
</Itree3>
</Itree2>
</Itree1>
</Ischool>
</Ipark4>
</Ipark3>
</Ipark2>
</Ipark1>
</Ioffice3>
</Ioffice2>
</Ioffice1>
</Ihouse7>
</Ihouse6>
</Ihouse5>
</Ihouse4>
</Ihouse3>
</Ihouse2>
</Ihouse1>
</Ihotel>
</Istreetturn>
</Istreetthree>
</Istreetstraight>
</Istreetfour>
</Istreetend>
	);
};
