// @ts-nocheck
/*
// Generated from ./assets/generated/buildings/office3.glb
*/

import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    city_private_houses901: THREE.Mesh;
  };
  materials: {
    city: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/generated/office3-transformed.glb"
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.city_private_houses901.geometry}
        material={materials.city}
        rotation={[0, 1.57, 0]}
        scale={4}
      />
    </group>
  );
}

useGLTF.preload("/generated/office3-transformed.glb");
