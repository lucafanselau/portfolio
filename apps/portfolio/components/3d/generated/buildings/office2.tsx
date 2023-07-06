// @ts-nocheck
/*
// Generated from ./assets/generated/buildings/office2.glb
*/

import * as THREE from "three";
import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    city_private_houses905: THREE.Mesh;
  };
  materials: {
    city: THREE.MeshStandardMaterial;
  };
};

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/generated/office2-transformed.glb"
  ) as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.city_private_houses905.geometry}
        material={materials.city}
        scale={[5, 2, 4]}
      />
    </group>
  );
}

useGLTF.preload("/generated/office2-transformed.glb");
