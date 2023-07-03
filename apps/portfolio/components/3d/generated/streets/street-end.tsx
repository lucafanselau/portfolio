// @ts-nocheck
/*
// Generated from ./assets/generated/streets/street-end.glb
*/

import * as THREE from 'three'
import React, { useRef, useMemo, useContext, createContext } from 'react'
import { useGLTF, Merged } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    road_tile_1x1_12: THREE.Mesh
  }
  materials: {
    city: THREE.MeshStandardMaterial
  }
}

const context = createContext()
export function Instances({ children, ...props }) {
  const { nodes } = useGLTF('/generated/street-end-transformed.glb') as GLTFResult
  const instances = useMemo(
    () => ({
      Roadtilex: nodes.road_tile_1x1_12,
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
      <instances.Roadtilex rotation={[0, Math.PI / 2, 0]} scale={2} />
    </group>
  )
}

useGLTF.preload('/generated/street-end-transformed.glb')
