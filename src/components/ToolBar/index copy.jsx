import { useState, useEffect } from "react";
import * as THREE from 'three';
import { Col, Row, Collapse } from 'antd'
import { qiangmian, cornerWall, toilet, basin, urine } from './mode.js';
import Mouse from "../Mouse/index.jsx";
import  './index.less';
let timer = 0;
const { Panel } = Collapse;
const modeArray = [
    {
        title: '基础图元',
        mode: [
            {
                title: '墙壁',
                image: qiangmian,
                type: 'wall',
            },
            {
                title: '折角墙壁',
                image: cornerWall,
                type: 'wallBend',
            },
            {
                title: '卫生间',
                image: basin,
                type: 'toilet'
            }
        ]
    },
    {
        title: '模型图元',
        mode: [
            {
                title: '马桶',
                image: toilet,
                src: '/toilet/scene.gltf',
                iconShow: true
            },
            {
                title: '小便池',
                image: urine,
                src: '/urine/scene.gltf',
                iconShow: true
            },
            {
                title: '洗手台',
                image: basin,
                src: '/basin/scene.gltf',
                iconShow: true
            }
        ]
    }
]
// DragControls.install({THREE: THREE});
const ToolBar = (props) => {
    const { cameraRef, canvasRef, setCanvasArray, canvasArray, GL } = props || {}
    // console.log(GL, '===GL')
    //  eslint-disable-next-line
    const { camera: cameraGL, scene, gl } = GL || {}
    //  eslint-disable-next-line
    const camera = cameraRef && cameraRef?.current
    //  eslint-disable-next-line
    const canvas = canvasRef && canvasRef.current
    //  eslint-disable-next-line
    const [mouseParam, setMouseParam] = useState({
        needX: 0,
        needY: 0
    })
    const [mouseData, setMouseData] = useState(0)
    const [mouseTime, setMouseTime] = useState(0)
    const [disParam, setDisParam] = useState(null)
    // useEffect(() => {
    //     const { e, data } = disParam || {}
    //     const { clientX, clientY } = e || {}
    //     console.log(disParam, '===disParam', timer, 'mouseData:', mouseData)
    //     !mouseData || timer > 3 && clearInterval(timer)
    //     if (disParam && mouseTime >= 0) {
    //         timer = setInterval(() => {
    //             // 这时候的num由于闭包的原因，一直是0，所以这里不能用setNum(num-1)
    //             setMouseTime(n => {
    //                 console.log(n, '===n')
    //                 if (n >= 1) {
    //                     clearInterval(timer)
    //                     const { image } = data || {}
    //                     setMouseData({
    //                         data,
    //                         x: clientX,
    //                         y: clientY
    //                     })
    //                 }
    //                 return mouseTime + 1
    //             });
    //         }, 1000)
    //     }
    //     return () => {
    //         // 组件销毁时，清除定时器
    //         console.log('useEffect')
    //         clearInterval(timer)
    //     };
    // }, [disParam, timer])
    // 鼠标移动
    //  eslint-disable-next-line
    const handleMouseUp = (e, item) => {
        // console.log(GL, '===GL')
        const { camera: cameraGL } = GL || {}
        //  eslint-disable-next-line
        const { src } = item || {}
        //  eslint-disable-next-line
        const { clientX: x, clientY: y } = e || {}
        // // 屏幕坐标转标准设备坐标
        const x1 = ( x / window.innerWidth ) * 2 - 1;
        const y1 = -( y / window.innerHeight ) * 2 + 1;
        //新建一个三维单位向量 假设z方向就是0.5
        //根据照相机，把这个向量转换到视点坐标系
        var vector = cameraGL && new THREE.Vector3(x1, y1, 0.5).unproject(cameraGL)
        const { position } = cameraGL || {}
        clearInterval(timer)
        timer = 0;
        console.log(position, '===position', timer)
        // const modePosition = {
        //     x: position.x + vector.x,
        //     y: 0,
        //     z: position.z + vector.z
        // }
        // setCanvasArray({
        //     ...item,
        //     position: stdVector,
        //     modeType: src && 'gltf',
        //     modeId: `c_s_${canvasArray.length + 1}`
        // })
        setMouseData(null)
    }
    // 单击添加模具 坐标默认[0,0,0]
    const handleClickMode = (item) => {
        const { src } = item || {}
        setCanvasArray({
            ...item,
            position: [0, 0, 0],
            modeType: src && 'gltf',
            modeId: `c_s_${canvasArray.length + 1}`
        })
    }
    return (<>
        <Collapse className="tool_bar">
            {
                modeArray.map((item) => {
                    const { title, mode } = item || {}
                    return <Panel header={title} key={title} className="tool_bar_panel">
                        <Row className="tool_bar_item">
                            {mode && mode.map((modeItem, index) => {
                                const { title: modeTitle, image: modeImage } = modeItem || {}
                                return <Col
                                    span={8}
                                    key={index}
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setDisParam(null)
                                        clearInterval(timer)
                                        timer = 0;
                                        handleClickMode(modeItem)
                                    }} 
                                    className="tool_bar_item_col"
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        clearInterval(timer)
                                        timer = 0;
                                        setDisParam({
                                            e,
                                            data: modeItem
                                        })
                                    }}
                                    onMouseUp={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        clearInterval(timer)
                                        timer = 0;
                                        setMouseTime(0)
                                        setMouseData(null)
                                    }}
                                >
                                    <img alt={modeTitle} src={modeImage} />
                                    <p className="title">{modeTitle}</p>
                                </Col>
                            })}
                        </Row>
                    </Panel>
                })
            }
        </Collapse>
        {
            mouseData?.data && <Mouse handleUp={(e) => mouseData?.data && handleMouseUp(e, mouseData?.data)} data={mouseData?.data} x={mouseData?.x} y={mouseData?.y}>
                {({x, y}) => (
                    <img
                        className="mouse_image"
                        style={{
                            top: y - 20,
                            left: x - 20
                        }}
                        src={mouseData && mouseData?.data?.image}
                        alt={mouseData && mouseData?.data?.title}
                    />
                )}
            </Mouse>
        }
    </>)
}

export  default ToolBar;