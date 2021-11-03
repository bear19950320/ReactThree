
import React, { useState, useRef } from 'react';
import { useCursor } from '@react-three/drei';
//  直角墙 几何体
function Wall(props) {
    const [hovered, setHovered] = useState(false)
    const refWall = useRef()
    const { handleClick, modeId } = props || {}
    useCursor(hovered)
    return (
        <mesh
            ref={refWall}
            {...props}
            name={modeId}
            onClick={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <boxGeometry args={[6, 2, 0.3]}  />
            <meshStandardMaterial transparent opacity={0.6} color={hovered ? 'aquamarine' : 'white'} />
        </mesh>
    )
}

export default Wall;