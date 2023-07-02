// @ts-nocheck
/*
// Generated from /Users/luca/dev/web/portfolio/assets/generated/buildings/office2.glb
*/

import * as THREE from 'three'
import React, { useRef, useMemo, useContext, createContext } from 'react'
import { useGLTF, Merged } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    city_private_houses905: THREE.Mesh
  }
  materials: {
    city: THREE.MeshStandardMaterial
  }
}

const context = createContext()
export function Instances({ children, ...props }) {
  const { nodes } = useGLTF('/office2-transformed.glb') as GLTFResult
  const instances = useMemo(
    () => ({
      Cityprivatehouses: nodes.city_private_houses905,
    }),
    [nodes]
  )
  return (
    <Merged meshes={instances} {...props}>
      {(instances) => <context.Provider value={instances} children={children} />}
    </Merged>
  )
}

export function Model(props: JSX.IntrinsicElements['group']) {
  const instances = useContext(context)
  return (
    <group {...props} dispose={null}>
      <instances.Cityprivatehouses scale={[5, 2, 4]} />
    </group>
  )
}

useGLTF.preload('/office2-transformed.glb')
