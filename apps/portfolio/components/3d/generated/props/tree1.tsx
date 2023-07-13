// @ts-nocheck
/*
// Generated from ./assets/generated/props/tree.glb
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Cube407: THREE.Mesh
  }
  materials: {
    city: THREE.MeshStandardMaterial
  }
}

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/generated/tree-transformed.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.Cube407.geometry} material={materials.city} rotation={[-Math.PI, 0.32, -Math.PI]} />
    </group>
  )
}

useGLTF.preload('/generated/tree-transformed.glb')
