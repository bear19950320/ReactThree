import { Suspense, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { CameraHelper } from 'three';
import {
    OrbitControls,
    PerspectiveCamera,
    OrthographicCamera,
    TransformControls,
    Loader
} from '@react-three/drei';
import ToolBar from '@/component/ToolBar';  //  左边模型菜单栏
import StatsMode from '@/component/CanvasStats';  //  性能盒子
import ShoeMode from './component/GLTF';    //  模具
import { Wall, WallBend, Toilet, Urine } from './component/Base';
import { connect } from 'react-redux';
import create from 'zustand';
import LevaTool from './optionBar/index'; // 操作栏
// import { transControlsChange } from '@/assets/js/transControls'
let aspect = null;
/**(url)
 * 写入hooks
 */
const useStore = create((set) => ({
    GL: null,
    setGL: (GL) =>  set({GL}),
    camera: { fov: 100, near: 1, far: 1000, position: [0, 15, 20], aspect: window.innerWidth / window.innerHeight },
    setCamera: (key, value) => {
        set(state => {
            const { camera } = state || {}
            console.log(key === 'aspect' ? window.innerWidth / window.innerHeight : value || '', '===setCamera')
            return ({
                camera: {
                    ...camera,
                    [key]: key === 'aspect' ? window.innerWidth / window.innerHeight : value || ''
                }
            })
        })
    },
    canvasArray: [
        // { modeId: 'c_s_1', position: [-2, 0, 0.5], modeType: 'gltf', src: '/toilet/scene.gltf', iconShow: true },
        // { modeId: 'c_s_2', position: [4, 0, 0.5], modeType: 'gltf', src: '/basin/scene.gltf', iconShow: true },
        // { modeId: 'c_s_3', position: [0, 0.5, 5], type: 'toilet'},
    ],
    setCanvasArray: (object) => {
        const { modeId } = object || {}
        // console.log(object, '===object')
        modeId && set(state => {
            const { canvasArray } = state || {}
            const oIndex = canvasArray.findIndex(v => v.modeId === modeId)
            if (oIndex !== -1) {
                const { position, scale, rotation, title } = object || {}
                const { x: position_x, y: position_y, z: position_z } = position || {}
                const { x: scale_x, y: scale_y, z: scale_z } = scale || {}
                const { _x: rotation_x, _y: rotation_y, _z: rotation_z } = rotation || {}
                const oItem = {
                    ...canvasArray[oIndex],
                    title,
                    position: [position_x, position_y, position_z],
                    scale: [scale_x, scale_y, scale_z],
                    rotation: [rotation_x, rotation_y, rotation_z]
                };
                canvasArray[oIndex] = oItem
                return ({
                    canvasArray: canvasArray
                })
            }
            return ({
                canvasArray: [...canvasArray, object]
            })
        })
    },
    editModeId: null,   //  编辑模型ID 用于(场景)scene.getObjectByName(editModeId)
    setEditModeId: (editModeId) => set({editModeId}),
    mode: 'translate', //   操作模型
    setMode: (mode) => set({ mode }),
    setSetting: (key, value) => {
        return (typeof value === 'boolean' || value) && set((state) => void (state.setting[key] = value))
    },
    setting: {
        axesShow: true,    //   (显示/隐藏) 网格线中间辅助线
        canvasColor: '#236780', // canvas背景色
        gridColor: '#4bb9e8',    // 网格颜色
        gridShow: true,    // (显示/隐藏)网格
        statsShow: true,    //  (显示/隐藏)性能
    }
}))
window.addEventListener('resize', () => {
    aspect = window.innerWidth / window.innerHeight
})
// 渲染组合集合模具
const handleTypeView = (item) => {
    const { type, index, handleClick } = item || {}
    let modeView = null
    switch (type) {
        case 'wallBend':
            //  (转角墙壁)
            modeView = <WallBend {...item} key={index} handleClick={handleClick} />
            break;
        case 'urine':
            //  (转角小便池)
            modeView = <Urine {...item} key={index} handleClick={handleClick} />
            break;
        case 'toilet':
            //  (厕所)
            modeView = <Toilet {...item} key={index} handleClick={handleClick} />
            break;
        default:
            //  (直角墙)
            modeView = <Wall {...item} key={index} handleClick={handleClick} />
    }
    return modeView;
}
// 获取整个three { scene 场景, camera 摄像机}
const RenderTest = ({ cameraRef, orbitRef, cameraOrthoRef }) => {
    const { setGL, GL } = useStore()
    // updateProjectionMatrix
    const renderThree = useThree();
    !GL && renderThree && setGL(renderThree)
    const helper = new CameraHelper(renderThree.camera)
    renderThree.scene.add(helper);
    return <mesh />
};

function Controls () {
    const transControls = useRef()
    const { GL, editModeId, setCanvasArray, mode }= useStore()
    if (!editModeId) return <></>;
    const { scene } = GL || {}
    const current = scene.getObjectByName(editModeId);
    /* 控制器  */
    return editModeId &&  (
        <TransformControls
            ref={transControls}
            onObjectChange={e => setCanvasArray(current)}
            onMouseDown={() =>console.log('控制器')} 
            object={current}
            mode={mode}
        />
    )
}

function App() {
    const canvasRef = useRef()
    const cameraRef = useRef()
    const cameraOrthoRef = useRef()
    const orbitRef = useRef()
    const {
        GL,
        camera,
        setting: {
            canvasColor,
            axesShow,
            gridColor,
            statsShow,
            gridShow
        },
        editModeId,
        setEditModeId,
        canvasArray,
    } = useStore()
    // window.addEventListener('resize', () => {
    //     setCamera('aspect')
    // })
    //  工具栏的配置 和 选中的模具参数写入
    const storeData = {
        ...useStore()
    }
    console.log(canvasArray, '===canvasArray', editModeId)
    return (
        <>
            {/* 性能模块 */}
            {statsShow && <StatsMode />}
            {/* 工具栏  */}
            {editModeId && <LevaTool {...storeData} />}
            {/* canvas camera(相机广角 50 视角 X:30 Y:10 Z:0) onPointerMissed(画布点击关闭辅助操作组件) dpr={[1, 2]}*/}
            <Canvas ref={canvasRef} camera={camera} onPointerMissed={(e) => {
                e.stopPropagation()
                setEditModeId(null)
            }} onMouseMove={(e) => {console.log('canvas mouseMove')}}>
                <RenderTest cameraRef={cameraRef} orbitRef={orbitRef} cameraOrthoRef={cameraOrthoRef} />
                {/* canvas背景颜色 */}
                <color attach="background" args={[canvasColor]} />
                {/* three 透视相机 */}
                <PerspectiveCamera ref={cameraRef} onChange={() => {
                    console.log('PerspectiveCamera , onChange', canvasArray)
                }} onMouseMove={(e) => {
                    console.log('PerspectiveCamera , onMouseMove')
                }}>
                </PerspectiveCamera>
                {/* 正交相机 */}
                <OrthographicCamera ref={cameraOrthoRef} left={-600 * aspect} right={600 * aspect} top={600} bottom={-600} near={0.01} far={30000} />
                {/* 环境光会均匀的照亮场景中的所有物体 */}
                <ambientLight intensity={0.2} color="#fff" />
                {/* 点光源 */}
                <pointLight position={[0, 10, 0]} />
                {/* 几何体 这里到时候用json里面的数据进行递归 */}
                <Suspense fallback={<Loader />} >
                    {canvasArray && canvasArray.length && canvasArray.map((item, index) => {
                        const { modeType, modeId } = item || {}
                        return modeType === 'gltf' ? (
                            <ShoeMode key={index} {...item} cameraRef={cameraRef} canvasRef={canvasRef} handleClick={(e) => {e.stopPropagation();setEditModeId(modeId)} } />
                        ) : handleTypeView({
                            ...item,
                            handleClick: (e) => {e.stopPropagation();setEditModeId(modeId)},
                            index
                        })
                    })}
                </Suspense>
                <Controls />
                {/* 轨道控制器 ( X:10 Y:20 Z:100) */}
                <OrbitControls ref={orbitRef} onChange={() => {
                    // console.log('OrbitControls === change', canvasArray)
                }} makeDefault options={[10, 20, 100]} />
                
                {/* 网格 和 中间轴辅助线 (👇) */}
                {/* 中间轴辅助线 size线长5  position={[0, -1.1, 0]} */}
                <mesh position={[0, -0.1, 0]} visible={axesShow}>
                    <axesHelper args={[5]} />
                </mesh>
                {/* 网格线 ([50 * 50]格子, 中线颜色, 格子线颜色) mesh低于水平线0.5 position={[0, -1, 0] */}
                <mesh position={[0, 0, 0]} visible={gridShow} onCollide={e => {
                    console.log(e, '=====onCollide')
                }}>
                    <gridHelper args={[100, 50, gridColor, gridColor]} />
                </mesh> 
            </Canvas>
            {/* 左边模型菜单栏 */}
            <ToolBar  {...storeData} canvasRef={canvasRef} GL={GL} cameraRef={cameraRef} />
            {/* 编辑器加载时loading */}
            {/* <Loader /> */}
        </>
    )
}

const mapState = state => {
    const { leva } = state || {}
    const { editParams } = leva || {}
    return ({
        editParams
    })
}

const mapDispatch = ({
    leva: {
        setEditParams
    } }) => ({
        setEditParams
    })

export default connect(
    mapState,
    mapDispatch
)(App)