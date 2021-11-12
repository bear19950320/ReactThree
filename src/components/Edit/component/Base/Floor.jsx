import { useRef, useState } from "react";
import { useTexture, useHelper, useCursor } from '@react-three/drei';
import * as THREE from 'three';
/**
 * helper (react-three/drei=> useHelper) 
 * @param {*} props 
 * @returns 
 */
const HelperView = (props) => {
	const { modeRef } = props || {}
	useHelper(modeRef, THREE.BoxHelper, 'cyan')
	return <></>
}

function createTexture () {
    const imageCanvas = document.createElement( "canvas" );
    const context = imageCanvas.getContext( "2d" );

    imageCanvas.width = imageCanvas.height = 128;

    context.fillStyle = "#444";
    context.fillRect( 0, 0, 128, 128 );

    context.fillStyle = "#fff";
    context.fillRect( 0, 0, 64, 64 );
    context.fillRect( 64, 64, 64, 64 );

    const textureCanvas = new THREE.CanvasTexture( imageCanvas );
    textureCanvas.repeat.set( 1000, 1000 );
    textureCanvas.wrapS = THREE.RepeatWrapping;
    textureCanvas.wrapT = THREE.RepeatWrapping;
    console.log(textureCanvas, '===textureCanvas')
    return textureCanvas;
}

// 地板
function Floor(props) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false)
    const { handleClick, modeId, editModeId } = props || {}
    const [meshTexture1, meshTexture2] = useTexture(['/image/floor.jpg', '/image/door.jpg'])
    useCursor(hovered)
    const textureCanvas = createTexture()
    return (
        <mesh
            ref={meshRef}
            {...props}
            name={modeId}
            onClick={handleClick} 
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <boxGeometry args={[50, 1, 50]} />
            {editModeId === modeId && <HelperView modeRef={meshRef} />}
            {/* <meshPhongMaterial  map={meshTexture1} /> */}
            <meshBasicMaterial
                displacementScale={0.2}
                map={textureCanvas}
            />
            {/* hovered ? meshTexture2 :  */}
        </mesh>
    )
}

export default Floor;