import { constants, Interaction } from "@3d/constants";
import { useStore } from "@3d/store";
import { Plane } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useState } from "react";
import { MeshStandardMaterial, Vector3 } from "three";

const Interaction = ({ zone, title }: Interaction) => {
  const size = useMemo(() => zone.getSize(new Vector3()), [zone]);
  const center = useMemo(() => zone.getCenter(new Vector3()), [zone]);

  const [material] = useState(
    () => new MeshStandardMaterial({ color: "#5F8646" })
  );

  useEffect(() => {
    return useStore.subscribe(
      (s) => s.world.interaction,
      (i) => {
        if (i.current === title) {
          material.color.set("#fff");
        } else {
          material.color.set("#5F8646");
        }
      }
    );
  }, []);

  return (
    <Plane
      position={center}
      args={[size.x, size.z, 2, 2]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
      material={material}
    />
  );
};

export const ExploreInteractions = () => {
  const state = useStore((s) => s.state);

  useFrame(() => {
    if (state !== "explore") return;
    const {
      character: { position },
      interact,
    } = useStore.getState();
    const title = constants.world.interactions.find(({ zone }) =>
      zone.containsPoint(position)
    )?.title;
    interact(title);
  });

  if (state !== "explore") return null;

  return (
    <group position={[0, 4 * constants.eps, 0]}>
      {constants.world.interactions.map((interaction, i) => (
        <Interaction key={i} {...interaction} />
      ))}
    </group>
  );
};
