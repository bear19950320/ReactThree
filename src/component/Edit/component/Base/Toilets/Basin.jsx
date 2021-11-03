import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import * as THREE from 'three';
//  UV多面贴图
const faceVertexUvs = [
    [
        [new THREE.Vector2(0.02, 0.99), new THREE.Vector2(0.02, 0.66), new THREE.Vector2(0.5, 0.99)],
        [new THREE.Vector2(0.02, 0.66), new THREE.Vector2(0.5, 0.66), new THREE.Vector2(0.5, 0.99)],
        // [new THREE.Vector2(0.5, 1), new THREE.Vector2(0.5, 0.66), new THREE.Vector2(1, 1)],
        // [new THREE.Vector2(0.5, 0.66), new THREE.Vector2(1, 0.66), new THREE.Vector2(1, 1)],
        // [new THREE.Vector2(0, 0.66), new THREE.Vector2(0, 0.33), new THREE.Vector2(0.5, 0.66)],
        // [new THREE.Vector2(0, 0.33), new THREE.Vector2(0.5, 0.33), new THREE.Vector2(0.5, 0.66)],
        // [new THREE.Vector2(0.5, 0.66), new THREE.Vector2(0.5, 0.33), new THREE.Vector2(1, 0.66)],
        // [new THREE.Vector2(0.5, 0.33), new THREE.Vector2(1, 0.33), new THREE.Vector2(1, 0.66)],
        // [new THREE.Vector2(0, 0.33), new THREE.Vector2(0, 0), new THREE.Vector2(0.5, 0.33)],
        // [new THREE.Vector2(0, 0), new THREE.Vector2(0.5, 0), new THREE.Vector2(0.5, 0.33)],
        // [new THREE.Vector2(0.5, 0.33), new THREE.Vector2(0.5, 0), new THREE.Vector2(1, 0.33)],
        // [new THREE.Vector2(0.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, 0.33)]
    ]
]
const Basin = ({ setTarget = null }) => {
    const groupRef = useRef()
    const [anuvTexture] = useLoader(TextureLoader, ['/an-uv.png'])
    return (
        <group ref={groupRef} onClick={(e) => {
            e.stopPropagation()
            setTarget(groupRef)
        }}>
            {/* shininess={200} skinning={true} specular="#fff"  */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[2, 2, 2]} faceVertexUvs={faceVertexUvs} />
                <meshBasicMaterial map={anuvTexture} />
            </mesh>
        </group>
    )
}

export default Basin;