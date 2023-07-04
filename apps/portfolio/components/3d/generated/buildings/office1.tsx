// @ts-nocheck
/*
// Generated from ./assets/generated/buildings/office.glb
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    office: THREE.Mesh
  }
  materials: {
    city: THREE.MeshStandardMaterial
  }
}

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/generated/office-transformed.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.office.geometry} material={materials.city} scale={0.81} />
    </group>
  )
}

useGLTF.preload('/generated/office-transformed.glb')
