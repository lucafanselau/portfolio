// @ts-nocheck
/*
// Generated from /Users/luca/dev/web/portfolio/assets/generated/streets/street-straight.glb
*/

import * as THREE from 'three'
import React, { useRef, useMemo, useContext, createContext } from 'react'
import { useGLTF, Merged } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    city_private_houses001: THREE.Mesh
  }
  materials: {
    city: THREE.MeshStandardMaterial
  }
}

const context = createContext()
export function Instances({ children, ...props }) {
  const { nodes } = useGLTF('/street-straight-transformed.glb') as GLTFResult
  const instances = useMemo(
    () => ({
      Cityprivatehouses: nodes.city_private_houses001,
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
      <instances.Cityprivatehouses rotation={[0, Math.PI / 2, 0]} scale={2} />
    </group>
  )
}

useGLTF.preload('/street-straight-transformed.glb')
