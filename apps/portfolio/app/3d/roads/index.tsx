import { Model as StreetStraight } from "@3d/generated/streets/street-straight";
import { Model as StreetEnd } from "@3d/generated/streets/street-end";
import { Model as StreetTurn } from "@3d/generated/streets/street-turn";
import { Model as StreetThree } from "@3d/generated/streets/street-three";
import { Model as StreetFour } from "@3d/generated/streets/street-four";

export const Roads = () => {
  return (
    <group position={[0, 1, 0]}>
      <StreetStraight position={[-8, 0, 0]} />
      <StreetEnd position={[8, 0, 0]} />
      <StreetTurn position={[0, 0, -8]} />
      <StreetThree />
      <StreetFour position={[0, 0, 8]} />
    </group>
  );
};
