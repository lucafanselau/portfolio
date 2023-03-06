/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.4 ./character.glb -t --transform -s -k
*/

import * as THREE from 'three'
import React, { useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    glassesRound: THREE.Mesh
    characterMedium: THREE.SkinnedMesh
    LeftFootCtrl: THREE.Bone
    RightFootCtrl: THREE.Bone
    HipsCtrl: THREE.Bone
  }
  materials: {
    ['Blue 3']: THREE.MeshStandardMaterial
    skin: THREE.MeshStandardMaterial
  }
}

type ActionName = 'Idle' | 'Run' | 'Walk' | 'Wave'
type GLTFActions = Record<ActionName, THREE.AnimationAction>

export function Model(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials, animations } = useGLTF('/character-transformed.glb') as GLTFResult
  const { actions } = useAnimations<GLTFActions>(animations, group)
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Root">
          <primitive object={nodes.LeftFootCtrl} />
          <primitive object={nodes.RightFootCtrl} />
          <primitive object={nodes.HipsCtrl} />
          <skinnedMesh name="characterMedium" geometry={nodes.characterMedium.geometry} material={materials.skin} skeleton={nodes.characterMedium.skeleton} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/character-transformed.glb')
