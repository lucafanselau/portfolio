import { constants, Interaction } from "@3d/constants";
import { useStore } from "@3d/store";
import { MeshStandardMaterial, Vector3 } from "three";
import { Plane } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";

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
        if (i === title) {
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

export const Interactions = () => {
  const state = useStore((s) => s.state);
  if (state !== "explore") return null;

  useFrame(() => {
    const {
      slots: { guy },
      setInteraction,
    } = useStore.getState();
    if (!guy) return;

    const title = constants.world.interactions.find(({ zone }) =>
      zone.containsPoint(guy.position)
    )?.title;
    setInteraction(title);
  });

  return (
    <group position={[0, constants.eps, 0]}>
      {constants.world.interactions.map((interaction, i) => (
        <Interaction key={i} {...interaction} />
      ))}
    </group>
  );
};
