import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'

const root = ReactDOM.createRoot(document.querySelector('#root')!)

root.render(
  <>
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [ 2.5, 4, 6 ]
      }}
    >
      <></>
    </Canvas>

    Hello World!
  </>
)
