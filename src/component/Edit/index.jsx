import { useState, createContext, useContext } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, TransformControls, useCursor } from '@react-three/drei';
import { Physics, Debug, usePlane } from '@react-three/cannon'
import LevaPanle from '../LaveBar';
import create from 'zustand'

const useStore = create((set) => ({ target: null, setTarget: (target) => set({ target }) }))
/**
 * 处理操作功能事件
 * @param {*} event 
 */
const handleTransChange = (event, target) => {
    console.log('handleTransChange:', event, 'target:', target)
}

const Color = createContext()
/**
 * 网格
 * @param {*} props 
 * @returns 
 */
const Plane = (props) => {
    const [ref] = usePlane(() => ({ type: 'Static', ...props }))
    return (
        <mesh ref={ref} options={[0,0,-5]}>
            <lineDashedMaterial color="#ffb385" gapSize={2} isLineDashedMaterial linewidth={5} />
            {/* <TransformControls object={ref.current} /> */}
        </mesh>
    )
}
//   单个盒子
function Box(props) {
    const setTarget = useStore((state) => state.setTarget)
    const [hovered, setHovered] = useState(false)
    useCursor(hovered)
    console.log(props, '====props')
    return (
        <mesh {...props} onClick={(e) => {
            e.stopPropagation()
            setTarget(null)
            setTarget(e.object)
        }} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
            <boxGeometry />
            <meshNormalMaterial />
            {/* <lineBasicMaterial color="red" /> */}
        </mesh>
    )
}
// 
export default function App() {
    const { target, setTarget } = useStore()
    // const { mode, setMode } = useState()
    const [ debugColor, setDebugColor ] =  useState('#4bb9e8')
    const [ canvasColor, setCanvasColor] = useState('#236780')
    console.log(target, '====target == uuid', target && target.uuid)
    const { uuid } = target || {}
    //  工具栏的配置 和 选中的模具参数写入
    return (
        <>
        {/* 工具栏 */}
        {
            target ? <LevaPanle {...target} title='测试' /> : null
        }
        {/* onClick={() => setTarget(null)}
        onPointerMissed={() => setTarget(null)} */}
        <Canvas dpr={[1, 2]}  >
            {/* canvas背景颜色 */}
            <color attach="background" args={[canvasColor]} />
            {/* three 透视相机 */}
            <PerspectiveCamera position={[0, 0, 0]} >
                {/* 环境光会均匀的照亮场景中的所有物体 */}
                {/* <ambientLight color="0x404040" /> */}
                {/* 点光源 */}
                {/* <pointLight position={[10, 10, 10]} /> */}
                {/* 几何体 */}
                <Box position={[2, 2, 0.5]}  />
                <Box position={[0, 0, 0.5]} />
                {target && <TransformControls onMouseUp={e => handleTransChange(e, target)} object={target} mode={'translate'} />}
                <OrbitControls makeDefault options={[10, 20, 100]} />
                {/* 网格 */}
                <Physics iterations={24} position={[0,0,-5]}>
                    <Debug scale={1.1} color={debugColor}>
                        <Plane />
                    </Debug>
                </Physics>
            </PerspectiveCamera>
        </Canvas>
        </>
    )
}
