import { range } from "@/utils";
import { RoundedBox, useTexture } from "@react-three/drei";
import { GroupProps, ThreeEvent } from "@react-three/fiber";
import { FC } from "react";
import { green, orange } from "tailwindcss/colors";
import { DoubleSide, Vector3 } from "three";
import { useStore } from "./store";

const Plane: FC<GroupProps> = (props) => {
  const onClick = ({ point, ...e }: ThreeEvent<MouseEvent>) => {
    console.log(point, e);
    e.stopPropagation();
    useStore.setState({ target: new Vector3().set(point.x, 0, point.z) });
  };
  return (
    <group {...props} onClick={onClick}>
      <RoundedBox args={[1, 1, 1]} position={[0, -0.5, 0]} receiveShadow>
        <meshStandardMaterial
          color={Math.random() > 0.5 ? orange[800] : green[300]}
          side={DoubleSide}
        />
      </RoundedBox>
    </group>
  );
};

const Target = () => {
  const texture = useTexture("/crosshair.png");

  const target = useStore(
    (state) => state.target,
    (a, b) => a.equals(b)
  );

  return (
    <mesh position={target} rotation={[Math.PI / -2, 0, 0]}>
      <planeBufferGeometry args={[1, 1, 1]} />
      <meshStandardMaterial map={texture} transparent />
    </mesh>
  );
};

const platformSize = 10;

const land = range(0, platformSize).flatMap((x) =>
  range(0, platformSize).map(
    (z) =>
      [
        x - Math.floor(platformSize / 2),
        0,
        z - Math.floor(platformSize / 2),
      ] as const
  )
);

export const Land = () => {
  return (
    <>
      {land.map((pos) => (
        <Plane position={pos} />
      ))}
      <group position={[0, 1e-3, 0]}>
        <Target />
      </group>
    </>
  );
};
