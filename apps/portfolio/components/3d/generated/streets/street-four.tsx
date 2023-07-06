// @ts-nocheck
/*
// Generated from ./assets/generated/streets/street-four.glb
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    city_private_houses002: THREE.Mesh;
  };
  materials: {
    city: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/generated/street-four-transformed.glb"
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.city_private_houses002.geometry}
        material={materials.city}
        rotation={[0, Math.PI / 2, 0]}
        scale={2}
      />
    </group>
  );
}

useGLTF.preload("/generated/street-four-transformed.glb");
