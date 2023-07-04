// @ts-nocheck
/*
// Generated from ./assets/generated/props/tree2.glb
*/

import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    Cube408: THREE.Mesh;
  };
  materials: {
    city: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/generated/tree2-transformed.glb"
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube408.geometry}
        material={materials.city}
        rotation={[-Math.PI, 0.38, -Math.PI]}
      />
    </group>
  );
}

useGLTF.preload("/generated/tree2-transformed.glb");
