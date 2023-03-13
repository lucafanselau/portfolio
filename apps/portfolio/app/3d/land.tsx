import { range } from "@/utils";
import { Instance, Instances, RoundedBox, useTexture } from "@react-three/drei";
import { GroupProps, ThreeEvent } from "@react-three/fiber";
import { FC, useState } from "react";
import { green, orange } from "tailwindcss/colors";
import { DoubleSide, Vector3 } from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { Roads } from "./roads";
import { useStore } from "./store";

const Plane: FC<GroupProps> = (props) => {
  const onClick = ({ point, ...e }: ThreeEvent<MouseEvent>) => {
    const state = useStore.getState().state;
    if (state !== "explore") return;
    // console.log(point, e);
    e.stopPropagation();
    useStore.setState({ target: new Vector3().set(point.x, 0, point.z) });
  };
  return (
    <Instance
      {...props}
      color={Math.random() > 0.5 ? green[600] : green[400]}
      onClick={onClick}
    />
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

const platformSize = 50;

const land = range(0, platformSize).flatMap((x) =>
  range(0, platformSize).map(
    (z) =>
      [
        x - Math.floor(platformSize / 2),
        -0.5,
        z - Math.floor(platformSize / 2),
      ] as const
  )
);

export const Land = () => {
  const [geometry] = useState(() => new RoundedBoxGeometry(1, 1, 1));
  return (
    <>
      <Instances limit={land.length} receiveShadow>
        <meshStandardMaterial side={DoubleSide} />
        <primitive object={geometry} />
        {land.map((pos) => (
          <Plane position={pos} key={"land-" + pos.join()} />
        ))}
      </Instances>
      <group position={[0, 1e-3, 0]}>
        <Roads />
        <Target />
      </group>
    </>
  );
};
