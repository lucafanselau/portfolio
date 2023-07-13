// @ts-nocheck
/*
// Generated from ./assets/generated/streets/street-end.glb
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    road_tile_1x1_12: THREE.Mesh
  }
  materials: {
    city: THREE.MeshStandardMaterial
  }
}

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/generated/street-end-transformed.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.road_tile_1x1_12.geometry} material={materials.city} rotation={[0, Math.PI / 2, 0]} scale={2} />
    </group>
  )
}

useGLTF.preload('/generated/street-end-transformed.glb')
