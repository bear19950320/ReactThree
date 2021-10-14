import React, { Component } from 'react';
import { Canvas } from '@react-three/fiber'
import { OrbitControls, TransformControls, useCursor } from '@react-three/drei';
import { usePlane } from '@react-three/cannon'
import { toolBar } from './optionBar'
import create from 'zustand'

const useStore = create((set) => ({ target: null, setTarget: (target) => set({ target }) }))

const Box = () => {
    const setTarget = useStore((state) => state.setTarget)
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)
    console.log(props, '====props')
    return (
        <mesh {...props} onClick={(e) => {
            e.stopPropagation()
            setTarget(e.object)
        }} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
            <boxGeometry />
            <meshNormalMaterial />
            {/* <lineBasicMaterial color={0xffffff} /> */}
        </mesh>
    )
}

class EditIndex extends Component{
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render () {
        return (
            <>
                <toolBar {...this.props} />
                <Canvas dpr={[1, 2]} onPointerMissed={() => setTarget(null)} onClick={() => setTarget(null)}>
                    <color attach="background" args={[canvasColor]} />
                    <Box position={[2, 2, 0]} />
                    <Box />
                    {target && <TransformControls object={target} mode={mode} />}
                    <OrbitControls makeDefault />
                    {/* <Plane /> */}
                </Canvas>
            </>
        )
    }
}

export default EditIndex;