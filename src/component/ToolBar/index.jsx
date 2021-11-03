import { useState } from "react";
import * as THREE from 'three';
import { Col, Row, Collapse } from 'antd'
import { qiangmian, cornerWall, toilet, basin, urine } from './mode.js';
import Mouse from "../Mouse/index.jsx";
import  './index.less';
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
    const [mouseData, setMouseData] = useState(0)
    // 鼠标移动
    const handleMouseUp = (e, item) => {
        const { src } = item || {}
        const { clientX: x, clientY: y } = e || {} //  鼠标移动坐标
        // 屏幕坐标转标准设备坐标
        const x1 = ( x / window.innerWidth ) * 2 - 1;
        const y1 = -( y / window.innerHeight ) * 2 + 1;
        //标准设备坐标(z=0.5这个值并没有一个具体的说法)
        const stdVector = new THREE.Vector3(x1, y1, 0.5);
        // 标准设备坐标转为世界坐标
        const worldVector = stdVector.unproject(cameraGL);
        // worldVector.y = 0
        setCanvasArray({
            ...item,
            position: worldVector,
            modeType: src && 'gltf',
            modeId: `c_s_${canvasArray.length + 1}`
        })
        setMouseData(null)
    }
    // 单击添加模具 坐标默认[0,0,0]
    //  eslint-disable-next-line
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
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        const { clientX, clientY } = e || {}
                                        setMouseData({
                                            data: modeItem,
                                            x: clientX,
                                            y: clientY
                                        })
                                        // handleClickMode(modeItem)
                                    }} 
                                    className="tool_bar_item_col"
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