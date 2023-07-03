// @ts-nocheck
/*
// Generated from ./assets/generated/buildings/office3.glb
*/

import * as THREE from 'three'
import React, { useRef, useMemo, useContext, createContext } from 'react'
import { useGLTF, Merged } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    city_private_houses901: THREE.Mesh
  }
  materials: {
    city: THREE.MeshStandardMaterial
  }
}

const context = createContext()
export function Instances({ children, ...props }) {
  const { nodes } = useGLTF('/generated/office3-transformed.glb') as GLTFResult
  const instances = useMemo(
    () => ({
      Cityprivatehouses: nodes.city_private_houses901,
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
      <instances.Cityprivatehouses rotation={[0, 1.57, 0]} scale={4} />
    </group>
  )
}

useGLTF.preload('/generated/office3-transformed.glb')
