import * as THREE from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { useTexture } from '@react-three/drei';
import { useRef } from 'react';
import { useLoader } from '@react-three/fiber';

const vertices = [
    new THREE.Vector3(-30, 70, 4), new THREE.Vector3(30, 70, 4), new THREE.Vector3(30, -70, 4), new THREE.Vector3(-30, -70, 4),
    new THREE.Vector3(-30, 70, -4), new THREE.Vector3(30, 70, -4), new THREE.Vector3(30, -70, -4), new THREE.Vector3(-30, -70, -4),
    new THREE.Vector3(-27, 67, 4), new THREE.Vector3(27, 67, 4), new THREE.Vector3(27, -67, 4), new THREE.Vector3(-27, -67, 4),
    new THREE.Vector3(-27, 67, -4), new THREE.Vector3(27, 67, -4), new THREE.Vector3(27, -67, -4), new THREE.Vector3(-27, -67, -4),
];
const faces = [
    new THREE.Face3(0, 8, 9), new THREE.Face3(0, 9, 1), new THREE.Face3(1, 9, 10), new THREE.Face3(1, 10, 2),
    new THREE.Face3(2, 10, 11), new THREE.Face3(2, 11, 3), new THREE.Face3(3, 11, 8), new THREE.Face3(3, 8, 0),
    new THREE.Face3(4, 5, 13), new THREE.Face3(4, 13, 12), new THREE.Face3(5, 6, 14), new THREE.Face3(5, 14, 13),
    new THREE.Face3(6, 7, 15), new THREE.Face3(6, 15, 14), new THREE.Face3(7, 4, 12), new THREE.Face3(7, 12, 15),
    new THREE.Face3(0, 1, 5), new THREE.Face3(0, 5, 4), new THREE.Face3(2, 3, 7), new THREE.Face3(2, 7, 6),
    new THREE.Face3(1, 2, 6), new THREE.Face3(1, 6, 5), new THREE.Face3(0, 4, 7), new THREE.Face3(0, 7, 3),
    new THREE.Face3(9, 8, 12), new THREE.Face3(9, 12, 13), new THREE.Face3(14, 15, 11), new THREE.Face3(14, 11, 10),
    new THREE.Face3(13, 14, 10), new THREE.Face3(13, 10, 9), new THREE.Face3(12, 8, 11), new THREE.Face3(12, 11, 15),
];
// const meshView = ({doorTexture}) => {
//     return (
//         <mesh>
//             <mesh position={[-27, 70, 0]}>
//                 <boxGeometry faces={faces} vertices={vertices} />       
//                 <meshPhongMaterial color="#ef320d" shininess={40} specular="#fff" />
//             </mesh>
//             <mesh position={[-27, 70, 0]}>
//                 <ambientLight intensity={1} color="green" />
//                 <boxGeometry args={[54, 134, 6]} />       
//                 <meshPhongMaterial color="red" shininess={200} skinning={true} specular="#fff" map={doorTexture} />
//             </mesh>
//         </mesh>
//     )
// }
const CylinderMode = (props) => {
    const [doorTexture] = useLoader(TextureLoader, ['/door.jpg'])  
    const { setTarget, position } = props || {}
    const groupRef = useRef()
    return (
       <group ref={groupRef} position={position} onClick={(e) => {
           const { object } = e || {}
       }}>
           <mesh position={[-27, 70, 0]}>
                <boxGeometry faces={faces} vertices={vertices} />       
                <meshPhongMaterial color="#ef320d" shininess={40} specular="#fff" />
            </mesh>
            <mesh position={[-27, 70, 0]}>
                <ambientLight intensity={1} color="green" />
                <boxGeometry args={[54, 134, 6]} />       
                <meshPhongMaterial color="red" shininess={200} skinning={true} specular="#fff" map={doorTexture} />
            </mesh>
       </group>
    )
}

export default CylinderMode;

// import * as THREE from 'three';
// import { useTexture } from '@react-three/drei';
// import { useRef } from 'react';
// import { useLoader } from '@react-three/fiber';

// const getMapJosn = () => {
//     // fetch('https://geo.datav.aliyun.com/areas_v3/bound/geojson?code=100000_full').then(function(response) {
//     //     return response.json();
//     // }).then(function(myJson) {
//     //     console.log('myJson:', myJson);
//     // });
// }

// const CylinderMode = (props) => {
//     getMapJosn()
//     const groupRef = useRef()
//     // const [doorTexture] = useLoader(THREE.TextureLoader, ['/door.jpg'])  
//     // console.log(doorTexture, '===doorTexture')
//     return (
//        <group ref={groupRef} position={[27,0,0]}>
//            <mesh position={[-27, 70, 0]}>
//                 <boxGeometry faces={faces} vertices={vertices} />       
//                 <color attach="background" args={['#f1eeee']} />
//                 <meshPhongMaterial shininess={40} />
//             </mesh>
//             <mesh position={[-27, 70, 0]}>
//                 {/* map={doorTexture}  */}
//                 <boxGeometry args={[54, 134, 6]} />       
//                 <meshPhongMaterial color="#330000"  shininess={200} specular="#090909" />
//             </mesh>
//        </group>
//     )
// }

// export default CylinderMode;