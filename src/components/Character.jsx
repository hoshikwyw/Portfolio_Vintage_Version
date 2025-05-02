import { Canvas } from '@react-three/fiber'
import React from 'react'
import { Experience } from './Experience'

const Character = () => {
    return (
        <Canvas className=' rounded-xl' shadows camera={{ position: [0, 2, 5], fov: 30 }}>
            <color attach="background" args={["#1E1E1E"]} />
            <Experience />
        </Canvas>
    )
}

export default Character