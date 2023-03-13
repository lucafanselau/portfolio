
import { FC, ReactNode } from "react";
import { Instances as I0 } from "./streets/street-end";
import { Instances as I1 } from "./streets/street-four";
import { Instances as I2 } from "./streets/street-straight";
import { Instances as I3 } from "./streets/street-three";
import { Instances as I4 } from "./streets/street-turn";
export const Instances: FC<{ children: ReactNode }> = ({ children }) => {

  return (
    <I0>
    <I1>
    <I2>
    <I3>
    <I4>
{children}
    </I4>
    </I3>
    </I2>
    </I1>
    </I0>
  );
};
