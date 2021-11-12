import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { CameraHelper, Raycaster, Vector2 } from 'three';
import {
    OrbitControls,
    PerspectiveCamera,
    OrthographicCamera,
    TransformControls,
    Loader,
    useHelper
} from '@react-three/drei';
import ToolBar from '@/component/ToolBar';  //  左边模型菜单栏
import StatsMode from '@/component/CanvasStats';  //  性能盒子
import ShoeMode from './component/GLTF';    //  模具
import { Wall, WallBend, Toilet, Urine } from './component/Base';
import { connect } from 'react-redux';
import create from 'zustand';
import LevaTool from './optionBar/index'; // 操作栏
import { transControlsChange } from '@/assets/js/transControls'
// const raycaster = new Raycaster();
// const mouse = new Vector2();
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
    target: null,
    setTarget: (target) => {
        // target && set({ target: null })
        setTimeout(() => set({ target }), 200)
    },
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

/**
 * 处理操作功能事件 写入到 (canvas) 数组
 * @param {*} event 
 */
const handleTransChange = (event, target, setCanvasArray) => {
    console.log(target?.current, '====target')
    const { current } = target || {}
    setCanvasArray(current)
}
// 渲染组合集合模具
const handleTypeView = (item) => {
    const { type, index } = item || {}
    let modeView = null
    switch (type) {
        case 'wallBend':
            //  (转角墙壁)
            modeView = <WallBend {...item} key={index} />
            break;
        case 'urine':
            //  (转角小便池)
            modeView = <Urine {...item} key={index} />
            break;
        case 'toilet':
            //  (厕所)
            modeView = <Toilet {...item} key={index} />
            break;
        default:
            //  (直角墙)
            modeView = <Wall {...item} key={index} />
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
    // console.log('✅ render renderThree', '👉', renderThree.camera);
    // if (cameraRef) {
    //     console.log(cameraRef?.current, '===cameraRef?.current')
    //     const PerspectiveHelper = cameraRef?.current && new CameraHelper(cameraRef?.current)
    //     // cameraRef?.current.updateProjectionMatrix()
    //     renderThree.scene.add(PerspectiveHelper);
    // }
    // if (cameraOrthoRef) {
    //     console.log(cameraOrthoRef?.current, '===cameraOrthoRef?.current')
    //     const OrthoHelper = cameraOrthoRef?.current && new CameraHelper(cameraOrthoRef?.current)
    //     // cameraOrthoRef?.current.updateProjectionMatrix()
    //     renderThree.scene.add(OrthoHelper);
    // }
    // console.log( '👉', PerspectiveHelper);
    // 
    // useEffect(() => {
    //   console.log('effect called');
    //   return () => {
    //     console.log('❌ cleanup called');
    //   };
    // });
    // if (cameraRef && orbitRef) {
    //     console.log(cameraRef.current, '===cameraRef.current')
    //     cameraRef.current.position.x = 0;
    //     cameraRef.current.position.y = 2;
    //     cameraRef.current.position.z = 10;
    //     orbitRef.current.update()
    // }
    
    // orbitRef
    // const canvas = document.querySelector('canvas')
    // canvas && canvas.addEventListener("mousemove", onMouseMove, false);
    return <mesh />
};
// const onMouseMove = (e) => {
//     const canvas = document.querySelector('canvas')
//     // mouse.set((e.offsetX / window.innerWidth) * 2 - 1, -(e.offsetY / window.innerHeight) * 2 + 1);
//     // 当前屏幕坐标
//     mouse.set((e.offsetX / canvas.clientWidth) * 2 - 1, -(e.offsetY / canvas.clientHeight) * 2 + 1);
//     console.log('onMouseMove', mouse)
     
// }

function App() {
    const canvasRef = useRef()
    const cameraRef = useRef()
    const cameraOrthoRef = useRef()
    const orbitRef = useRef()
    const transControls = useRef()
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
        mode,
        target,
        setTarget,
        canvasArray,
        setCanvasArray
    } = useStore()
    // window.addEventListener('resize', () => {
    //     setCamera('aspect')
    // })
    //  工具栏的配置 和 选中的模具参数写入
    const storeData = {
        ...useStore()
    }
    console.log(canvasArray, '===canvasArray')
    return (
        <>
            {/* 性能模块 */}
            {statsShow && <StatsMode />}
            {/* 工具栏  */}
            {target && <LevaTool {...storeData} target={target} />}
            {/* canvas camera(相机广角 50 视角 X:30 Y:10 Z:0) onPointerMissed(画布点击关闭辅助操作组件) dpr={[1, 2]}*/}
            <Canvas ref={canvasRef} camera={camera} onPointerMissed={(e) => {
                e.stopPropagation()
                setTarget(null)
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
                        const { modeType } = item || {}
                        return modeType === 'gltf' ? (
                            <ShoeMode key={index} {...item} cameraRef={cameraRef} canvasRef={canvasRef} setTarget={setTarget} />
                        ) : handleTypeView({
                            ...item, setTarget: setTarget,
                            index
                        })
                    })}
                </Suspense>
                {/* 控制器 */}
                {target && <TransformControls ref={transControls} onObjectChange={e => handleTransChange(e, target, setCanvasArray)} onMouseDown={() => {
                    console.log('控制器')
                }} object={target.current} mode={mode} />}
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