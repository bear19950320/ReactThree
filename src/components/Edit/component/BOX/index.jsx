
import React, { useState } from 'react';
import { useCursor } from '@react-three/drei';
//  几何体
function BoxMode(props) {
    const { setTarget, item, target } = props || {}
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)
    const { modeType } = props || {}
    return (
        <mesh {...item}
            onClick={(e) => {
                e.stopPropagation()
                const { object } = e || {}
                console.log(object, '===BOXmode object')
                setTarget(object)
            }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <boxGeometry args={[6, 2, 0.3]} />
            <meshStandardMaterial roughness={1} transparent opacity={0.6} color={hovered ? 'aquamarine' : 'white'} />
        </mesh>
    )
}

export default BoxMode;