import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  useCursor,
  MeshReflectorMaterial,
  Image,
  Text,
  Environment,
  RoundedBox,
  OrbitControls,
  Decal,
  useTexture,
} from '@react-three/drei'
// import { useRoute, useLocation } from 'next/router'
import { easing } from 'maath'
import DefaultLayout from '../../../components/Layouts/Default'

const TICKET_WIDTH = 396
const TICKET_HEIGHT = 613
const TICKET_RATIO = TICKET_WIDTH / TICKET_HEIGHT

const imagePath = `/images/launchweek/ga/ticket/lw11-ticket-demo.png`
const image = { position: [1, 0, 1.5], rotation: [0, 0, 0], url: imagePath }

const App = () => (
  <DefaultLayout>
    <div className="w-full h-screen">
      <Canvas dpr={[1, 2]} camera={{ fov: 75, position: [0, 0, -500] }} className="relative z-30">
        {/* <color attach="background" args={['#191920']} /> */}
        {/* <fog attach="fog" args={['#191920', 0, 15]} /> */}
        <color attach="background" args={['#191920']} />
        <fog attach="fog" args={['#191920', 0, 15]} />
        <group position={[0, 0, -5]}>
          <Frames frame={image} />
          {/* <mesh rotation={[-Math.PI / 2, 0, 0]}> */}
          <mesh rotation={[30, 0, 0]} position={[0, 0, -5]}>
            <planeGeometry args={[50, 50]} />
            <MeshReflectorMaterial
              mirror={10}
              blur={[300, 100]}
              resolution={2048}
              mixBlur={1}
              mixStrength={80}
              roughness={0.8}
              depthScale={0.6}
              minDepthThreshold={0.4}
              maxDepthThreshold={1.4}
              color="#050505"
              metalness={1}
            />
          </mesh>
        </group>
        <Environment preset="studio" />
        <OrbitControls />
      </Canvas>
    </div>
  </DefaultLayout>
)

function Frames({ frame, q = new THREE.Quaternion(), p = new THREE.Vector3() }: any) {
  const ref = useRef(null)
  // const clicked = useRef(null)
  // // const [, params] = useRoute('/item/:id')
  // // const [, setLocation] = useLocation()
  // useEffect(() => {
  //   clicked.current = ref.current?.getObjectByName(params?.id)
  //   if (clicked.current) {
  //     clicked.current.parent.updateWorldMatrix(true, true)
  //     clicked.current.parent.localToWorld(p.set(0, TICKET_RATIO / 2, 1.25))
  //     clicked.current.parent.getWorldQuaternion(q)
  //   } else {
  //     p.set(0, 0, 5.5)
  //     q.identity()
  //   }
  // })
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })
  return (
    <group
      ref={ref}
      // onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.name))}
      // onPointerMissed={() => setLocation('/')}
    >
      <Frame key={frame.url} {...frame} />
    </group>
  )
}

function Frame({ url, c = new THREE.Color(), ...props }: any) {
  const imageRef = useRef(null)
  const frame = useRef(null)
  const texture = useTexture(imagePath)
  // const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  // const name = getUuid(url)
  // const isActive = params?.id === name
  useCursor(hovered)
  // useFrame((state, dt) => {
  //   image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
  //   easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.85 : 1), 0.9 * (!isActive && hovered ? 0.905 : 1), 1], 0.1, dt)
  //   easing.dampC(frame.current.material.color, hovered ? 'orange' : 'white', 0.1, dt)
  // })
  return (
    <group {...props}>
      <mesh
        // name={name}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        // scale={[1, 1, 0.03]}
        // position={[0, TICKET_RATIO / 2, 0]}
      >
        {/* <boxGeometry args={[TICKET_WIDTH, TICKET_HEIGHT, 1]} />
        <meshStandardMaterial color="#151515" metalness={0.5} roughness={0.5} envMapIntensity={2} /> */}
        {/* <mesh ref={frame} raycast={() => null} scale={[1, 1, 1]} position={[0, 0, 0]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh> */}
        {/* <Image raycast={() => null} ref={image} position={[0, 0, 0.5]} args={[TICKET_WIDTH, TICKET_HEIGHT]} url={url} /> */}
        {/* <RoundedBox
          // parameters={{ width: 3.5, height: 1.618 * 3.5 }}
          radius={0.6}
          args={[3.5, 1.618 * 3.5, 0.2]}
        >
          <Image ref={imageRef} position={[0, 1.5, 1]} url={imagePath} />
        </RoundedBox> */}
        <RoundedBox />
        <meshNormalMaterial />
        <Decal debug position={[0, 0, 0]} rotation={[0, 0, 0]} scale={1}>
          <meshBasicMaterial map={texture} polygonOffsetFactor={-1} polygonOffset />
        </Decal>
        {/* <planeGeometry
            // attributes={}
            //             width={ 3.5}
            //             height={ 1.618 * 3.5 }
            args={[3.5, 1.618 * 3.5, 0.2]}
          /> */}
      </mesh>
      {/* <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, TICKET_RATIO, 0]} fontSize={0.025}>
        {name.split('-').join(' ')}
      </Text> */}
    </group>
  )
}

export default App
