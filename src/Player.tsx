import { useRef, useEffect, useState } from 'react'
import { RigidBody, RapierRigidBody, useRapier } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import * as THREE from 'three'

import { useGame } from './stores/useGame'

export const Player = () => {
  const body = useRef<RapierRigidBody>(null)
  const [ subscribeKeys, getKeys ] = useKeyboardControls()
  const { rapier, world } = useRapier()

  const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
  const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

  const start = useGame(state => state.start)
  const end = useGame(state => state.end)
  const restart = useGame(state => state.restart)
  const blocksCount = useGame(state => state.blocksCount)

  const jump = () => {
    if (!body.current) return

    let origin = body.current.translation()
    origin.y -= 0.31
    const direction = { x: 0, y: -1, z: 0 }
    const ray = new rapier.Ray(origin, direction)
    const hit = world.castRay(ray, 10, true)

    if (hit && hit.timeOfImpact < 0.15) {
      body.current.applyImpulse({ x: 0, y: 0.5, z: 0 }, true)
    }
  }

  const reset = () => {
    body.current?.setTranslation({ x: 0, y: 1, z: 0 }, true)
    body.current?.setLinvel({ x: 0, y: 0, z: 0 }, true)
    body.current?.setAngvel({ x: 0, y: 0, z: 0 }, true)
  }

  useEffect(() =>
    useGame.subscribe(state => state.phase, value => {
      if (value === 'ready') reset()
    })
  , [])

  useEffect(() =>
    subscribeKeys(state => state.jump, value => {
      if (value) jump()
    })
  , [])

  useEffect(() =>
    subscribeKeys(() => {
      start()
    })
  , [])

  // Controls
  useFrame((_state, delta) => {
    const { forward, backward, leftward, rightward } = getKeys()

    const impulse = { x: 0, y: 0, z: 0 }
    const torque = { x: 0, y: 0, z: 0 }

    const impulseStrength = 0.6 * delta
    const torqueStrength = 0.2 * delta

    if (forward) {
      impulse.z -= impulseStrength
      torque.x -= torqueStrength
    }

    if (rightward) {
      impulse.x += impulseStrength
      torque.z -= torqueStrength
    }

    if (backward) {
      impulse.z += impulseStrength
      torque.x += torqueStrength
    }

    if (leftward) {
      impulse.x -= impulseStrength
      torque.z += torqueStrength
    }

    body.current?.applyImpulse(impulse, true)
    body.current?.applyTorqueImpulse(torque, true)
  })

  // Camera
  useFrame((state, delta) => {
    if (!body.current) return

    const bodyPosition = body.current.translation()
    const cameraPosition = new THREE.Vector3()

    cameraPosition.copy(bodyPosition)
    cameraPosition.z += 2.25
    cameraPosition.y += 0.65

    const cameraTarget = new THREE.Vector3()
    cameraTarget.copy(bodyPosition)
    cameraTarget.y += 0.25

    smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
    smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

    state.camera.position.copy(smoothedCameraPosition)
    state.camera.lookAt(smoothedCameraTarget)
  })

  // Phases
  useFrame(() => {
    if (!body.current) return

    const bodyPosition = body.current.translation()

    if (bodyPosition.z < -(blocksCount * 4 + 2)) { end() }
    if (bodyPosition.y < -4) { restart() }
  })

  return (
    <RigidBody
      ref={body}
      canSleep={false}
      colliders='ball'
      position={[ 0, 1, 0 ]}
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[ 0.3, 1 ]} />
        <meshStandardMaterial flatShading color='mediumpurple' />
      </mesh>
    </RigidBody>
  )
}

