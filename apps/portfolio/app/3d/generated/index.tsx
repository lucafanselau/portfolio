
import { FC, ReactNode } from "react";
import { Instances as I0 } from "./buildings/house";
import { Instances as I1 } from "./buildings/office";
import { Instances as I2 } from "./buildings/school";
import { Instances as I3 } from "./buildings/tree1";
import { Instances as I4 } from "./buildings/tree2";
import { Instances as I5 } from "./buildings/tree3";
import { Instances as I6 } from "./buildings/tree4";
import { Instances as I7 } from "./streets/street-end";
import { Instances as I8 } from "./streets/street-four";
import { Instances as I9 } from "./streets/street-straight";
import { Instances as I10 } from "./streets/street-three";
import { Instances as I11 } from "./streets/street-turn";
export const Instances: FC<{ children: ReactNode }> = ({ children }) => {

  return (
    <I0 receiveShadow castShadow>
    <I1 receiveShadow castShadow>
    <I2 receiveShadow castShadow>
    <I3 receiveShadow castShadow>
    <I4 receiveShadow castShadow>
    <I5 receiveShadow castShadow>
    <I6 receiveShadow castShadow>
    <I7 receiveShadow castShadow>
    <I8 receiveShadow castShadow>
    <I9 receiveShadow castShadow>
    <I10 receiveShadow castShadow>
    <I11 receiveShadow castShadow>
{children}
    </I11>
    </I10>
    </I9>
    </I8>
    </I7>
    </I6>
    </I5>
    </I4>
    </I3>
    </I2>
    </I1>
    </I0>
  );
};
