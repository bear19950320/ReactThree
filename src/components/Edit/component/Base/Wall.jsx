
import React, { useState, useRef } from 'react';
import { useCursor, useHelper } from '@react-three/drei';
import { BoxHelper } from 'three';
/**
 * helper (react-three/drei=> useHelper) 
 * @param {*} props 
 * @returns 
 */
const HelperView = (props) => {
	const { modeRef } = props || {}
	useHelper(modeRef, BoxHelper, 'cyan')
	return <></>
}
//  直角墙 几何体
function Wall(props) {
    const [hovered, setHovered] = useState(false)
    const refWall = useRef()
    const { handleClick, modeId, editModeId } = props || {}
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
            {/* [判断修改ID是否等于当前模型的ID]显示用helper */}
            {editModeId === modeId && <HelperView modeRef={refWall} />}
            <boxGeometry args={[6, 2, 0.3]} />
            <meshStandardMaterial transparent opacity={0.6} color={hovered ? 'aquamarine' : 'white'} />
        </mesh>
    )
}

export default Wall;