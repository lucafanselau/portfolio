// @ts-nocheck
/*
// Generated from ./assets/generated/buildings/park.glb
*/

import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";
import type { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    park007: THREE.Mesh;
  };
  materials: {
    city: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/generated/park-transformed.glb"
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.park007.geometry}
        material={materials.city}
        scale={2}
      />
    </group>
  );
}

useGLTF.preload("/generated/park-transformed.glb");
