// 性别
import { useRef } from "react";
import * as THREE from 'three';
// 创建Mesh
function CreateMesh (props) {
    const meshRef = useRef()
    // const edgesMtl =  new THREE.LineBasicMaterial({color: 0xff0000})
    // const Geometry = new THREE.PlaneGeometry(5, 5, 32)
    // // const material = new THREE.MeshBasicMaterial({color: 0xffff00})
    // const Edges = new THREE.EdgesGeometry(Geometry, 1)
    // const Line = new THREE.LineSegments(Edges, edgesMtl);
    return (
        <group {...props} ref={meshRef}>
            <mesh>
                <planeGeometry args={[5, 5]} />
                <meshBasicMaterial color={0xffff00} side={THREE.DoubleSide} />
            </mesh>
        </group>
        
    )
}
//  男
export const Male = () => {
    return <CreateMesh position={[5,0, 2]} />
}
// 女
export const Female = () => {
    return <CreateMesh />
}