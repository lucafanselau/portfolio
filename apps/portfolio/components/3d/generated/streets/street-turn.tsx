// @ts-nocheck
/*
// Generated from ./assets/generated/streets/street-turn.glb
*/

import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    road_tile_1x1_11: THREE.Mesh;
  };
  materials: {
    city: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/generated/street-turn-transformed.glb"
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.road_tile_1x1_11.geometry}
        material={materials.city}
        rotation={[0, Math.PI / 2, 0]}
        scale={2}
      />
    </group>
  );
}

useGLTF.preload("/generated/street-turn-transformed.glb");
