import { useRef } from 'react'
import { Mesh, Color, type ShaderMaterial } from 'three'
import { extend, useFrame, type ReactThreeFiber } from '@react-three/fiber'
import { OrbitControls, useGLTF, useTexture, Center, Sparkles, shaderMaterial } from '@react-three/drei'

import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new Color('#772eb2'),
    uColorEnd: new Color('#e0fbff')
  },
  portalVertexShader,
  portalFragmentShader
)

interface PortalMaterial extends ShaderMaterial {
  uTime: number
  uColorStart: Color
  uColorEnd: Color
}

extend({ PortalMaterial })

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'portalMaterial': ReactThreeFiber.Object3DNode<PortalMaterial, typeof PortalMaterial>;
    }
  }
}

export const Experience = () => {
  const portalMaterial = useRef<PortalMaterial>(null)
  const { nodes: { baked2, poleLightA, poleLightB, portalLight } } = useGLTF('./portal.glb')
  const bakedTexture = useTexture('./baked.jpg')
  bakedTexture.flipY = false

  useFrame((_state, delta) => {
    if (!portalMaterial.current) return
    portalMaterial.current.uTime += delta
  })

  return (
    <>
      <color args={ [ '#281d2f' ] } attach="background" />
      <OrbitControls makeDefault />
        <Center>
          {baked2 instanceof Mesh && (
            <mesh geometry={baked2.geometry} >
              <meshBasicMaterial map={bakedTexture} />
            </mesh>)}
          {poleLightA instanceof Mesh && (
            <mesh geometry={poleLightA.geometry} position={poleLightA.position}>
              <meshBasicMaterial color='#ffffe5' />
            </mesh>)}
          {poleLightB instanceof Mesh && (
            <mesh geometry={poleLightB.geometry} position={poleLightB.position}>
              <meshBasicMaterial color='#ffffe5' />
            </mesh>)}
          {portalLight instanceof Mesh && (
            <mesh geometry={portalLight.geometry} position={portalLight.position} rotation={portalLight.rotation}>
              <portalMaterial ref={portalMaterial} />
            </mesh>)}
          <Sparkles size={6} scale={[4, 2, 4]} position-y={1} speed={0.2} count={40} />
        </Center>
    </>
  )
}
