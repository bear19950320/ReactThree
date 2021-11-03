

import React, { useState, useRef } from 'react';
import { useCursor } from '@react-three/drei';
import * as THREE from 'three';
import { CSG } from "three-csg-ts";
//  直角墙 几何体
function Wall(props) {
    const groupRef = useRef()
    const { handleClick, modeId } = props || {}
    const [hovered, setHovered] = useState(false)
    const mesh1 = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4));
    const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(4, 2, 4));
    mesh2.position.x = 0.3; mesh2.position.z = 0.3;
    mesh1.updateMatrix();
    mesh2.updateMatrix();
    const newMesh = CSG.subtract(mesh1, mesh2);
    newMesh.material = new THREE.MeshStandardMaterial({ color: new THREE.Color(hovered ? 'aquamarine' : 'white'), transparent: true, opacity: 0.6});
    newMesh.receiveShadow = true;
    useCursor(hovered)
    return (
        <group
            {...props}
            ref={groupRef} 
            name={modeId}
            onClick={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <primitive object={newMesh} />
        </group>
    )
}

export default Wall;
