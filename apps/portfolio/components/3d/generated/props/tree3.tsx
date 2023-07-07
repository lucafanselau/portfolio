// @ts-nocheck
/*
// Generated from ./assets/generated/props/tree3.glb
*/

import { useGLTF } from "@react-three/drei";
import type * as THREE from "three";
import type { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Cube406: THREE.Mesh;
  };
  materials: {
    city: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/generated/tree3-transformed.glb"
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube406.geometry}
        material={materials.city}
        rotation={[-Math.PI, 0.38, -Math.PI]}
      />
    </group>
  );
}

useGLTF.preload("/generated/tree3-transformed.glb");
