import { Suspense, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
// import * as THREE from 'three';
// import { CameraHelper, PointLightHelper } from 'three';
import {
    OrbitControls,
    PerspectiveCamera,
    OrthographicCamera,
    TransformControls,
    Loader,
    // useHelper
} from '@react-three/drei';
import ToolBar from '@/components/ToolBar';  //  左边模型菜单栏
import StatsMode from '@/components/CanvasStats';  //  性能盒子
import ShoeMode from './component/GLTF';    //  加载模具
import WindowKey from './optionBar/WindowKey';
// eslint-disable-next-line
import { Wall, WallBend, Toilet, Urine, Male, Female, Floor } from './component/Base';
import create from 'zustand';
import LevaTool from './optionBar/index'; // 操作栏
// import { dataEncrypt, dataDecrypt } from '@/utils/AES'
// import { transControlsChange } from '@/assets/js/transControls'
let aspect = null;

/**(url)
 * 写入hooks
 */
const useStore = create((set) => ({
    GL: null,
    setGL: (GL) => set({ GL }),
    camera: { fov: 100, near: 1, far: 1000, position: [0, 15, 20], aspect: window.innerWidth / window.innerHeight },
    canvasArray: [
        {
            image: '',
            modeId: "c_s_1",
            modeType: null,
            position: [0, 0, 0],
            title: "地板",
            type: "floor",
        }
    ],
    setCanvasArray: (object) => {
        const { modeId } = object || {}
        modeId && set(state => {
            const { canvasArray } = state || {}
            const oIndex = canvasArray.findIndex(v => v.modeId === modeId)
            // 如果数组里面有当前修改的modeId就进行替换
            if (oIndex !== -1) {
                const { position, scale, rotation, title } = object || {}
                if (!position) {
                    canvasArray.splice(oIndex, 1)
                    console.log(canvasArray, 'del canvasArray')
                    return ({
                        canvasArray: canvasArray,
                        editModeId: null
                    })
                }
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
            
            // 没有就进行PUSH
            return ({
                canvasArray: [...canvasArray, object]
            })
        })
    },
    editModeId: null,   //  编辑模型ID 用于(场景)scene.getObjectByName(editModeId)
    setEditModeId: (editModeId) => set({ editModeId }),
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

// window.addEventListener('resize', () => {
//     aspect = window.innerWidth / window.innerHeight
// })
// 渲染组合集合模具
const HandleTypeView = (item) => {
    const { type, index, handleClick } = item || {}
    let modeView = null
    switch (type) {
        case 'wallBend':  //  (转角墙壁)
            modeView = <WallBend {...item} key={index} handleClick={handleClick} />
            break;
        case 'urine': //  (转角小便池)
            modeView = <Urine {...item} key={index} handleClick={handleClick} />
            break;
        case 'toilet'://  (厕所)
            modeView = <Toilet {...item} key={index} handleClick={handleClick} />
            break;
        case 'floor':
            modeView = <Floor {...item} key={index} handleClick={handleClick} />
            break;
        default: //  (直角墙)
            modeView = <Wall {...item} key={index} handleClick={handleClick} />
    }
    return modeView || <></>;
}
// 获取整个three { scene 场景, camera 摄像机}
const RenderTest = ({ cameraRef, orbitRef, cameraOrthoRef }) => {
    const { setGL, GL } = useStore()
    const renderThree = useThree();
    const { camera } = renderThree || {}
    !GL && renderThree && setGL(renderThree)
    // const helper = new CameraHelper(camera)
    camera.zoom = 6
    camera.updateProjectionMatrix()
    // renderThree.scene.add(helper);
    return <mesh />
};
// 处理模型双击
function hadnleDoubleClick (modeId, GL) {
    const { scene, camera } = GL
    const { position } = scene.getObjectByName(modeId) || {}
    console.log(position)
    // camera.position.set(position.x, position.y, position.z)
    // camera.lookAt(0,0,0)
    // camera.lookAt(scene.getObjectByName(modeId)?.position)
    camera.zoom = 6
    camera.updateProjectionMatrix()
}
// 操作和灯光
function Controls() {
    const transControls = useRef()
    const pointRef = useRef()
    const { GL, editModeId, setCanvasArray, mode } = useStore()
    const { scene } = GL || {}
    // 灯光得helper
    // useHelper(pointRef, PointLightHelper, 1, 'red')
    const current = editModeId && scene.getObjectByName(editModeId);
    GL.nowControls = transControls?.current
    /* 控制器  */
    return (
        <>
            {editModeId && <TransformControls
                ref={transControls}
                onObjectChange={e => setCanvasArray(current)}
                object={current}
                mode={mode}
            />}
            {/* 轨道控制器 ( X:10 Y:20 Z:100) */}
            {/* <OrbitControls ref={orbitRef} onChange={() => { }} makeDefault options={[10, 20, 100]} /> */}
            {/* makeDefault makes the controls known to r3f, now transform-controls can auto-disable them when active */}
            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
            {/* 环境光会均匀的照亮场景中的所有物体 高度30 */}
            <ambientLight intensity={1} color="#fff" position={[0, 30, 0]} />
            <arrowHelper />
            {/* 点光源 高度10 */}
            <pointLight ref={pointRef} color="#fff" position={[0, 10, 0]} />
        </>
    )
}

function App() {
    const canvasRef = useRef()
    const cameraRef = useRef()
    const cameraOrthoRef = useRef()
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
        setCanvasArray
    } = useStore()
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
            <WindowKey GL={GL} setCanvasArray={setCanvasArray} />
            {/* canvas camera(相机广角 50 视角 X:30 Y:10 Z:0) onPointerMissed(画布点击关闭辅助操作组件) dpr={[1, 2]}*/}
            <Canvas className="canvas" ref={canvasRef} camera={camera} onPointerMissed={(e) => {
                e.stopPropagation()
                setEditModeId(null)
            }}>
                {/* 加载成功之后写入整个render */}
                <RenderTest />
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
                {/* 几何体 这里到时候用json里面的数据进行递归 */}
                <Suspense fallback={null} >
                    {canvasArray && canvasArray.length && canvasArray.map((item, index) => {
                        const { modeType, modeId } = item || {}
                        return modeType === 'gltf' ? (
                            <ShoeMode key={index} editModeId={editModeId} {...item} hadnleDoubleClick={(e) => { e.stopPropagation(); hadnleDoubleClick(modeId, GL) } }  handleClick={(e) => { e.stopPropagation(); setEditModeId(modeId) }} />
                        ) : <HandleTypeView key={index} editModeId={editModeId} {...item} handleClick={(e) => { e.stopPropagation(); setEditModeId(modeId) }} />
                    })}
                </Suspense>
                {/* 编辑和轨迹 */}
                <Controls />
                {/* 网格 和 中间轴辅助线 (👇) */}
                {/* 中间轴辅助线 size线长5  position={[0, -1.1, 0]} */}
                <mesh position={[0, -0.1, 0]} visible={axesShow}>
                    <axesHelper args={[5]} />
                </mesh>
                {/* 平面用于点射线的获取位置 raycaster */}
                <mesh rotation-x={- Math.PI / 2 } name="planeHelper">
                    <planeGeometry args={[100, 100]}/>
                    <meshBasicMaterial color="#6990a0" visible={false} />
                </mesh>
                 {/* 网格线 ([50 * 50]格子, 中线颜色, 格子线颜色) mesh低于水平线0.5 position={[0, -1, 0] */}
                <gridHelper position={[0, 0, 0]} visible={gridShow} args={[100, 50, gridColor, gridColor]} />
            </Canvas>
            {/* 编辑器加载时loading */}
            { !canvasRef && <Loader dataInterpolation={(p) => `Loading ${p.toFixed(2)}%`} /> }
            {/* 左边模型菜单栏 */}
            <ToolBar {...storeData} />
        </>
    )
}

export default App;